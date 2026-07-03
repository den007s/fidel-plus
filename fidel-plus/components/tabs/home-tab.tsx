'use client'

import { Bell, Coffee, TrendingUp, Calendar, Loader2 } from 'lucide-react'
import { QRCode } from '@/components/qr-code'
import { useAuth } from '@/components/auth-context'
import { cn } from '@/lib/utils'

export function HomeTab() {
  const { user } = useAuth()

  // user poate fi inca null in momentul randarii initiale -> aratam un loader scurt
  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    )
  }

  // Daca utilizatorul e pe ultimul nivel (Gold), nextTierPoints e null.
  // Tratam cazul ca sa nu impartim la null.
  const hasNextTier = user.nextTierPoints != null
  const progressPercent = hasNextTier
    ? Math.min(100, Math.round((user.points / (user.nextTierPoints as number)) * 100))
    : 100

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-2 px-1">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Bine ai revenit</p>
          <h1 className="text-2xl font-bold text-foreground mt-0.5 text-balance">
            Bună, {user.firstName}! 👋
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            aria-label="Notificări"
            className="relative w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center shadow-sm hover:bg-accent transition-colors active:scale-95"
          >
            <Bell size={18} className="text-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-sm shadow-primary/30">
            <span className="text-sm font-bold text-primary-foreground">{user.avatarInitials}</span>
          </div>
        </div>
      </div>

      {/* Hero Points Card */}
      <div
        className="relative rounded-3xl overflow-hidden p-5 text-white shadow-lg shadow-primary/25"
        style={{
          background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 45%, #a855f7 100%)',
        }}
      >
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute top-4 right-16 w-16 h-16 rounded-full bg-white/5" />
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-1">Puncte disponibile</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-5xl font-bold tabular-nums">{user.points}</span>
                <span className="text-white/70 text-sm font-medium">pct</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="bg-white/20 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                {user.tier}
              </span>
              {hasNextTier && (
                <p className="text-white/60 text-xs">Următorul: {user.nextTier}</p>
              )}
            </div>
          </div>

          <div className="mt-2">
            <div className="flex justify-between text-xs text-white/70 mb-2">
              <span>{user.points} puncte</span>
              {hasNextTier && <span>{user.nextTierPoints} pentru {user.nextTier}</span>}
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Digital Card */}
      <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="flex items-stretch">
          <div className="flex items-center justify-center p-4 bg-muted/30 border-r border-border">
            <QRCode size={90} />
          </div>
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Coffee size={13} className="text-primary" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">DODO CAFÉ</span>
              </div>
              <p className="text-base font-bold text-foreground leading-tight">{user.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Card de fidelitate</p>
            </div>
            <div className="mt-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">ID Membru</p>
              <p className="text-sm font-mono font-bold text-foreground tracking-widest">{user.memberId}</p>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-green-600 font-semibold">Activ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Points Progress */}
      {hasNextTier && (
        <div className="bg-card rounded-3xl border border-border p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Coffee size={15} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user.points} / {user.nextTierPoints} puncte
              </p>
              <p className="text-xs text-muted-foreground">până la următoarea recompensă</p>
            </div>
            <span className="text-xs font-bold text-primary shrink-0">
              {(user.nextTierPoints as number) - user.points} rămase
            </span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #7c3aed, #a855f7)',
              }}
            />
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={<Calendar size={16} className="text-primary" />}
          value={user.visits.toString()}
          label="vizite"
          color="primary"
        />
        <StatCard
          icon={<TrendingUp size={16} className="text-emerald-500" />}
          value={`${user.pointsThisMonth}`}
          label="pct luna aceasta"
          color="emerald"
        />
        <StatCard
          icon={<span className="text-base leading-none">⭐</span>}
          value={user.tier}
          label="nivel actual"
          color="amber"
        />
      </div>
    </div>
  )
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode
  value: string
  label: string
  color: 'primary' | 'emerald' | 'amber'
}) {
  const bgMap = {
    primary: 'bg-primary/8',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/30',
    amber: 'bg-amber-50 dark:bg-amber-950/30',
  }
  return (
    <div className={cn('rounded-2xl p-3.5 border border-border bg-card shadow-sm flex flex-col gap-1.5')}>
      <div className={cn('w-7 h-7 rounded-xl flex items-center justify-center', bgMap[color])}>
        {icon}
      </div>
      <p className="text-lg font-bold text-foreground leading-none tabular-nums">{value}</p>
      <p className="text-[10px] text-muted-foreground leading-tight">{label}</p>
    </div>
  )
}
