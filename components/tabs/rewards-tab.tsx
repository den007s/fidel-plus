'use client'

import { useState, useEffect } from 'react'
import { Check, Lock, Zap, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/auth-context'
import { badges, challenges } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

type Reward = {
  id: number
  title: string
  description: string
  cost: number
  icon: string
  category: string
}

export function RewardsTab() {
  const { user, refresh } = useAuth()
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)
  const [claimingId, setClaimingId] = useState<number | null>(null)
  const [claimed, setClaimed] = useState<number[]>([])
  const [message, setMessage] = useState('')

  // La montarea tab-ului, cerem recompensele din DB
  useEffect(() => {
    fetch('/api/rewards')
      .then((res) => res.json())
      .then((data) => setRewards(data.rewards))
      .catch(() => setMessage('Nu am putut încărca recompensele'))
      .finally(() => setLoading(false))
  }, [])

  async function handleClaim(rewardId: number) {
    setClaimingId(rewardId)
    setMessage('')

    const res = await fetch('/api/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rewardId }),
    })
    const data = await res.json()

    setClaimingId(null)

    if (res.ok) {
      setClaimed((prev) => [...prev, rewardId])
      setMessage(`✓ Ai revendicat: ${data.reward}`)
      await refresh() // actualizam punctele in tot app-ul
    } else {
      setMessage(data.error ?? 'Revendicare eșuată')
    }
  }

  const points = user?.points ?? 0

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Rewards Grid */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-base font-bold text-foreground">Recompense disponibile</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {points} pct
          </span>
        </div>

        {message && (
          <p className="text-xs text-center mb-3 px-3 py-2 rounded-xl bg-primary/10 text-primary font-medium">
            {message}
          </p>
        )}

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {rewards.map((reward) => {
              const canAfford = reward.cost <= points
              const isClaimed = claimed.includes(reward.id)
              const isClaiming = claimingId === reward.id
              return (
                <div
                  key={reward.id}
                  className={cn(
                    'bg-card rounded-3xl border p-4 shadow-sm flex flex-col gap-3 transition-all duration-200',
                    canAfford
                      ? 'border-primary/20 hover:border-primary/40 hover:shadow-md hover:shadow-primary/10'
                      : 'border-border opacity-75'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        'w-11 h-11 rounded-2xl flex items-center justify-center text-xl',
                        canAfford ? 'bg-primary/10' : 'bg-muted'
                      )}
                    >
                      {reward.icon}
                    </div>
                    {!canAfford && <Lock size={13} className="text-muted-foreground mt-1" />}
                    {isClaimed && (
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <Check size={11} strokeWidth={3} className="text-white" />
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground leading-tight">{reward.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{reward.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className={cn(
                      'flex items-center gap-1 text-xs font-bold rounded-full px-2.5 py-1',
                      canAfford ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    )}>
                      <Zap size={10} />
                      {reward.cost} pct
                    </div>
                  </div>

                  <button
                    onClick={() => handleClaim(reward.id)}
                    disabled={!canAfford || isClaimed || isClaiming}
                    className={cn(
                      'w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5',
                      isClaimed
                        ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 cursor-default'
                        : canAfford
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/25'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    )}
                  >
                    {isClaiming && <Loader2 size={12} className="animate-spin" />}
                    {isClaimed ? '✓ Revendicat' : canAfford ? 'Revendică' : `Îți lipsesc ${reward.cost - points} pct`}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Badges (statice deocamdata - dezvoltare viitoare) */}
      <section>
        <h2 className="text-base font-bold text-foreground mb-3 px-1">Insigne câștigate</h2>
        <div className="bg-card rounded-3xl border border-border p-4 shadow-sm">
          <div className="grid grid-cols-3 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={cn(
                  'flex flex-col items-center gap-2 p-3 rounded-2xl transition-all',
                  badge.earned ? 'bg-primary/8 border border-primary/15' : 'bg-muted/40 border border-border opacity-50'
                )}
              >
                <div className={cn(
                  'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl',
                  badge.earned ? 'bg-primary/15' : 'bg-muted grayscale'
                )}>
                  {badge.icon}
                </div>
                <p className={cn(
                  'text-[10px] font-semibold text-center leading-tight',
                  badge.earned ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {badge.title}
                </p>
                {!badge.earned && <Lock size={10} className="text-muted-foreground -mt-1" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Challenges (statice deocamdata - dezvoltare viitoare) */}
      <section>
        <h2 className="text-base font-bold text-foreground mb-3 px-1">Provocări active</h2>
        <div className="flex flex-col gap-3">
          {challenges.map((challenge) => {
            const pct = Math.round((challenge.current / challenge.target) * 100)
            return (
              <div key={challenge.id} className="bg-card rounded-3xl border border-border p-4 shadow-sm hover:border-primary/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-xl shrink-0">
                    {challenge.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-foreground">{challenge.title}</p>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0 ml-2">
                        +{challenge.reward} pct
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2.5">{challenge.description}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background: pct === 100 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #7c3aed, #a855f7)',
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground tabular-nums shrink-0">
                        {challenge.current}/{challenge.target}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
