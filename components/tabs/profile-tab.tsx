'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Mail, Smartphone, ChevronRight, Star, Coffee, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/auth-context'
import { cn } from '@/lib/utils'

type Purchase = {
  id: string
  items: string
  total: number
  points: number
  createdAt: string
}

export function ProfileTab() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(true)
  const [logoutConfirm, setLogoutConfirm] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const [history, setHistory] = useState<Purchase[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  // Aducem istoricul real de achizitii al utilizatorului din DB
  useEffect(() => {
    fetch('/api/history')
      .then((res) => res.json())
      .then((data) => setHistory(data.purchases ?? []))
      .catch(() => setHistory([]))
      .finally(() => setLoadingHistory(false))
  }, [])

  async function handleLogout() {
    setLoggingOut(true)
    await logout()
    router.push('/login')
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    )
  }

  const hasNextTier = user.nextTierPoints != null
  const progressPercent = hasNextTier
    ? Math.min(100, Math.round((user.points / (user.nextTierPoints as number)) * 100))
    : 100

  // Formatam data ISO din DB intr-un format romanesc lizibil
  function formatDate(iso: string): string {
    const d = new Date(iso)
    return d.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Profile Hero */}
      <div className="bg-card rounded-3xl border border-border p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-md shadow-primary/25 shrink-0"
            style={{ background: 'linear-gradient(135deg, #5b21b6, #7c3aed)' }}
          >
            {user.avatarInitials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-foreground truncate">{user.name}</h2>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full flex items-center gap-1">
                ⭐ Nivel {user.tier}
              </span>
              <span className="text-[10px] text-muted-foreground">{user.visits} vizite</span>
            </div>
          </div>
        </div>

        {/* Tier Progress */}
        {hasNextTier ? (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-muted-foreground">Progres spre {user.nextTier}</span>
              <span className="font-bold text-primary">{user.points} / {user.nextTierPoints} pct</span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, #7c3aed, #a855f7)',
                }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              Încă {(user.nextTierPoints as number) - user.points} puncte pentru {user.nextTier}
            </p>
          </div>
        ) : (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-center text-amber-600 font-semibold">🏆 Ai atins nivelul maxim!</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Puncte', value: user.points.toString(), icon: <Star size={14} className="text-amber-500" />, bg: 'bg-amber-50 dark:bg-amber-950/30' },
          { label: 'Vizite', value: user.visits.toString(), icon: <Coffee size={14} className="text-primary" />, bg: 'bg-primary/8' },
          { label: 'Nivel', value: user.tier, icon: <span className="text-sm">⭐</span>, bg: 'bg-slate-100 dark:bg-slate-800/50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-2xl border border-border p-3 shadow-sm text-center flex flex-col items-center gap-1.5">
            <div className={cn('w-7 h-7 rounded-xl flex items-center justify-center', stat.bg)}>
              {stat.icon}
            </div>
            <p className="text-base font-bold text-foreground tabular-nums">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Purchase History */}
      <section>
        <h2 className="text-base font-bold text-foreground mb-3 px-1">Istoric achiziții</h2>
        <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
          {loadingHistory ? (
            <div className="flex justify-center py-8">
              <Loader2 size={20} className="animate-spin text-primary" />
            </div>
          ) : history.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">Nicio achiziție încă</p>
          ) : (
            history.map((purchase, idx) => (
              <div
                key={purchase.id}
                className={cn(
                  'flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors',
                  idx < history.length - 1 && 'border-b border-border'
                )}
              >
                <div className="w-9 h-9 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Coffee size={15} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{purchase.items}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{formatDate(purchase.createdAt)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-primary">+{purchase.points} pct</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{purchase.total.toFixed(2)} lei</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Notifications */}
      <section>
        <h2 className="text-base font-bold text-foreground mb-3 px-1">Notificări</h2>
        <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
          <NotifRow
            icon={<Mail size={15} className="text-blue-500" />}
            label="Notificări Email"
            description="Oferte, puncte și noutăți"
            checked={emailNotifs}
            onChange={setEmailNotifs}
            bg="bg-blue-50 dark:bg-blue-950/40"
          />
          <div className="border-t border-border" />
          <NotifRow
            icon={<Smartphone size={15} className="text-primary" />}
            label="Notificări Push"
            description="Alertă imediată pe telefon"
            checked={pushNotifs}
            onChange={setPushNotifs}
            bg="bg-primary/10"
          />
        </div>
      </section>

      {/* Logout */}
      {logoutConfirm ? (
        <div className="bg-destructive/8 border border-destructive/20 rounded-3xl p-4 text-center">
          <p className="text-sm font-semibold text-destructive mb-3">Ești sigur că vrei să ieși?</p>
          <div className="flex gap-3">
            <button
              onClick={() => setLogoutConfirm(false)}
              disabled={loggingOut}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-muted text-foreground hover:bg-muted/80 transition-colors"
            >
              Anulează
            </button>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-destructive text-white hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2"
            >
              {loggingOut && <Loader2 size={14} className="animate-spin" />}
              Deconectare
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setLogoutConfirm(true)}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-3xl border border-destructive/30 bg-destructive/5 text-destructive text-sm font-semibold hover:bg-destructive/10 transition-all duration-200 active:scale-[0.98]"
        >
          <LogOut size={16} />
          Deconectare
        </button>
      )}
    </div>
  )
}

function NotifRow({
  icon, label, description, checked, onChange, bg,
}: {
  icon: React.ReactNode
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
  bg: string
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className={cn('w-9 h-9 rounded-2xl flex items-center justify-center shrink-0', bg)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0',
          checked ? 'bg-primary' : 'bg-muted-foreground/25'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300',
            checked && 'translate-x-5'
          )}
        />
      </button>
    </div>
  )
}
