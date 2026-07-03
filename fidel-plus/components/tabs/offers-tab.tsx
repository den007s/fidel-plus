'use client'

import { useState, useEffect } from 'react'
import { MapPin, Sparkles, Clock, ChevronRight, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Offer = {
  id: number
  title: string
  description: string
  discount: number
  expiresAt: string
  tag: string
  badge: string | null
}

export function OffersTab() {
  const [saved, setSaved] = useState<number[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  // Aducem ofertele din DB la deschiderea tab-ului
  useEffect(() => {
    fetch('/api/offers')
      .then((res) => res.json())
      .then((data) => setOffers(data.offers ?? []))
      .catch(() => setOffers([]))
      .finally(() => setLoading(false))
  }, [])

  const toggle = (id: number) => {
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Geo-fencing Banner */}
      <div
        className="rounded-3xl p-4 text-white shadow-md shadow-emerald-500/20 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #059669 0%, #10b981 60%, #34d399 100%)',
        }}
      >
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/10" />

        <div className="relative z-10 flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
            <MapPin size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-balance leading-snug">
              Ești aproape de DODO CAFÉ!
            </p>
            <p className="text-white/80 text-xs mt-0.5 leading-relaxed">
              Câștigă <span className="font-bold text-white">2x puncte</span> la orice comandă astăzi. Oferta expiră la miezul nopții.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-white/80 text-[10px] font-medium">La 320m de tine • Crângași, București</span>
        </div>
      </div>

      {/* Personalized Offers */}
      <section>
        <div className="flex items-center gap-2 mb-3 px-1">
          <Sparkles size={15} className="text-primary" />
          <h2 className="text-base font-bold text-foreground">Recomandate pentru tine</h2>
          <span className="ml-auto text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles size={9} />
            AI
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 size={22} className="animate-spin text-primary" />
            </div>
          ) : offers.map((offer) => {
            const isSaved = saved.includes(offer.id)
            return (
              <div
                key={offer.id}
                className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden hover:border-primary/30 transition-all duration-200 hover:shadow-md"
              >
                {/* Top colored strip */}
                <div
                  className="h-1.5"
                  style={{
                    background: `linear-gradient(90deg, #7c3aed, #a855f7, #c084fc)`,
                  }}
                />

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {offer.badge && (
                          <span className={cn(
                            'text-[9px] font-bold px-2 py-0.5 rounded-full',
                            offer.badge === 'POPULAR'
                              ? 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400'
                              : 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                          )}>
                            {offer.badge}
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <Sparkles size={8} className="text-primary" />
                          {offer.tag}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-foreground text-balance leading-snug">
                        {offer.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {offer.description}
                      </p>
                    </div>

                    {/* Discount Badge */}
                    <div
                      className="shrink-0 w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white shadow-sm"
                      style={{
                        background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                      }}
                    >
                      <span className="text-lg font-black leading-none">-{offer.discount}%</span>
                      <span className="text-[9px] font-medium text-white/80">reducere</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={11} />
                      <span>Expiră {offer.expiresAt}</span>
                    </div>
                    <button
                      onClick={() => toggle(offer.id)}
                      className={cn(
                        'flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all duration-200 active:scale-95',
                        isSaved
                          ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      )}
                    >
                      {isSaved ? (
                        <>
                          <Check size={11} strokeWidth={3} />
                          Salvat
                        </>
                      ) : (
                        <>
                          Salvează
                          <ChevronRight size={11} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Today's Specials Banner */}
      <div className="bg-card rounded-3xl border border-border p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Specialitatea zilei</p>
            <p className="text-sm font-bold text-foreground">Flat White cu Vanilie</p>
            <p className="text-xs text-muted-foreground mt-0.5">Disponibil până la 17:00</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground line-through">14,00 RON</p>
            <p className="text-lg font-black text-primary">11,90 RON</p>
          </div>
        </div>
        <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full w-3/5 rounded-full" style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }} />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5">18 porții rămase din 30</p>
      </div>
    </div>
  )
}
