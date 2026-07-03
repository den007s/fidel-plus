'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Coffee, Users, TrendingUp, Award, Gift, LogOut, Loader2,
} from 'lucide-react'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useAuth } from '@/components/auth-context'

type Stats = {
  kpi: {
    totalClients: number
    activeClients: number
    retentionRate: number
    pointsIssued: number
    pointsSpent: number
    totalRedemptions: number
  }
  tierDistribution: { tier: string; count: number }[]
  topRewards: { name: string; count: number }[]
}

type Customer = {
  id: string
  name: string
  email: string
  memberId: string
  points: number
  tier: string
  visits: number
  segment: string
}

const TIER_COLORS: Record<string, string> = {
  Bronze: '#b45309',
  Silver: '#64748b',
  Gold: '#d97706',
}

const SEGMENT_STYLES: Record<string, string> = {
  Fidel: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  Activ: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
  Nou: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400',
  Inactiv: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
}

export default function AdminPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  const [stats, setStats] = useState<Stats | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Paznic de rol: doar adminii au voie aici
  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login')
      else if (user.role !== 'admin') router.push('/')
    }
  }, [user, loading, router])

  // Aducem datele din rutele de admin
  useEffect(() => {
    if (user?.role === 'admin') {
      Promise.all([
        fetch('/api/admin/stats').then((r) => r.json()),
        fetch('/api/admin/customers').then((r) => r.json()),
      ])
        .then(([statsData, custData]) => {
          setStats(statsData)
          setCustomers(custData.customers ?? [])
        })
        .catch(() => {})
        .finally(() => setDataLoading(false))
    }
  }, [user])

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    )
  }

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  )

  async function handleLogout() {
    await logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top bar */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm shadow-primary/25"
              style={{ background: 'linear-gradient(135deg, #5b21b6, #7c3aed)' }}
            >
              <Coffee size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground leading-tight">
                Fidel<span className="text-primary">+</span> <span className="text-primary">Admin</span>
              </h1>
              <p className="text-xs text-muted-foreground">Panou de control DODO CAFÉ</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors px-3 py-2 rounded-xl hover:bg-destructive/5"
          >
            <LogOut size={16} />
            Deconectare
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {dataLoading || !stats ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* KPI cards */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <KpiCard
                icon={<Users size={18} className="text-primary" />}
                label="Clienți activi"
                value={`${stats.kpi.activeClients} / ${stats.kpi.totalClients}`}
                hint="cu cel puțin o vizită"
              />
              <KpiCard
                icon={<TrendingUp size={18} className="text-emerald-500" />}
                label="Rată de retenție"
                value={`${stats.kpi.retentionRate}%`}
                hint="clienți care revin"
              />
              <KpiCard
                icon={<Award size={18} className="text-amber-500" />}
                label="Puncte emise"
                value={stats.kpi.pointsIssued.toLocaleString('ro-RO')}
                hint="acumulate de clienți"
              />
              <KpiCard
                icon={<Gift size={18} className="text-violet-500" />}
                label="Revendicări"
                value={stats.kpi.totalRedemptions.toString()}
                hint={`${stats.kpi.pointsSpent.toLocaleString('ro-RO')} pct cheltuite`}
              />
            </section>

            {/* Charts */}
            <section className="grid lg:grid-cols-2 gap-4 mb-6">
              <div className="bg-card rounded-3xl border border-border p-5 shadow-sm">
                <h2 className="text-sm font-bold text-foreground mb-4">Distribuția pe niveluri</h2>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.tierDistribution}
                        dataKey="count"
                        nameKey="tier"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={(entry) => `${entry.tier}: ${entry.count}`}
                      >
                        {stats.tierDistribution.map((entry) => (
                          <Cell key={entry.tier} fill={TIER_COLORS[entry.tier] ?? '#7c3aed'} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-card rounded-3xl border border-border p-5 shadow-sm">
                <h2 className="text-sm font-bold text-foreground mb-4">Recompense revendicate</h2>
                <div className="h-56">
                  {stats.topRewards.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                      Nicio revendicare încă
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.topRewards}>
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={50} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </section>

            {/* Customers table */}
            <section className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between gap-4 flex-wrap">
                <h2 className="text-sm font-bold text-foreground">Clienți ({filtered.length})</h2>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Caută după nume sau email..."
                  className="text-sm bg-muted/50 border border-border rounded-xl px-3 py-2 outline-none focus:border-primary/50 w-64 max-w-full"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground border-b border-border">
                      <th className="px-5 py-3 font-medium">Client</th>
                      <th className="px-5 py-3 font-medium">Nivel</th>
                      <th className="px-5 py-3 font-medium">Puncte</th>
                      <th className="px-5 py-3 font-medium">Vizite</th>
                      <th className="px-5 py-3 font-medium">Segment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => (
                      <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-3">
                          <div className="font-medium text-foreground">{c.name}</div>
                          <div className="text-xs text-muted-foreground">{c.email}</div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                            <span className="w-2 h-2 rounded-full" style={{ background: TIER_COLORS[c.tier] ?? '#7c3aed' }} />
                            {c.tier}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-semibold text-foreground tabular-nums">{c.points}</td>
                        <td className="px-5 py-3 text-muted-foreground tabular-nums">{c.visits}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${SEGMENT_STYLES[c.segment] ?? ''}`}>
                            {c.segment}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

function KpiCard({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint: string }) {
  return (
    <div className="bg-card rounded-3xl border border-border p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-2xl bg-muted/60 flex items-center justify-center">{icon}</div>
      </div>
      <p className="text-2xl font-bold text-foreground tabular-nums leading-none">{value}</p>
      <p className="text-sm font-medium text-foreground mt-1.5">{label}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
    </div>
  )
}
