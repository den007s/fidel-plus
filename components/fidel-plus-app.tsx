'use client'

import { useState } from 'react'
import { Home, Gift, Tag, User } from 'lucide-react'
import { HomeTab } from '@/components/tabs/home-tab'
import { RewardsTab } from '@/components/tabs/rewards-tab'
import { OffersTab } from '@/components/tabs/offers-tab'
import { ProfileTab } from '@/components/tabs/profile-tab'
import { cn } from '@/lib/utils'

type Tab = 'home' | 'rewards' | 'offers' | 'profile'

const tabs: { id: Tab; label: string; Icon: React.ElementType; badge?: number }[] = [
  { id: 'home', label: 'Acasă', Icon: Home },
  { id: 'rewards', label: 'Recompense', Icon: Gift, badge: 2 },
  { id: 'offers', label: 'Oferte', Icon: Tag, badge: 3 },
  { id: 'profile', label: 'Profil', Icon: User },
]

export function FidelPlusApp() {
  const [activeTab, setActiveTab] = useState<Tab>('home')

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      {/* Phone Frame */}
      <div
        className="relative flex flex-col bg-background rounded-[3rem] overflow-hidden shadow-2xl"
        style={{
          width: '100%',
          maxWidth: 420,
          height: 'min(820px, calc(100vh - 32px))',
          boxShadow: '0 32px 64px -12px rgba(124,58,237,0.25), 0 0 0 1px rgba(0,0,0,0.08)',
        }}
      >
        {/* Status Bar */}
        <div className="flex items-center justify-between px-7 pt-3 pb-1 shrink-0 bg-background/95 backdrop-blur-sm z-10">
          <span className="text-[11px] font-semibold text-foreground/70 tabular-nums">9:41</span>
          <div className="flex items-center gap-1.5">
            <svg width="16" height="10" viewBox="0 0 16 10" className="text-foreground/70" fill="currentColor">
              <rect x="0" y="4" width="3" height="6" rx="0.5" />
              <rect x="4.5" y="2.5" width="3" height="7.5" rx="0.5" />
              <rect x="9" y="1" width="3" height="9" rx="0.5" />
              <rect x="13.5" y="0" width="2.5" height="10" rx="0.5" />
            </svg>
            <svg width="14" height="10" viewBox="0 0 14 10" className="text-foreground/70" fill="currentColor">
              <path d="M7 2C9.2 2 11.2 2.9 12.7 4.3L14 3C12.1 1.1 9.7 0 7 0C4.3 0 1.9 1.1 0 3L1.3 4.3C2.8 2.9 4.8 2 7 2Z" />
              <path d="M7 5C8.4 5 9.7 5.5 10.7 6.4L12 5.1C10.6 3.8 8.9 3 7 3C5.1 3 3.4 3.8 2 5.1L3.3 6.4C4.3 5.5 5.6 5 7 5Z" />
              <circle cx="7" cy="9" r="1.5" />
            </svg>
            <div className="flex items-center gap-0.5">
              <div className="w-6 h-3 rounded-[3px] border border-foreground/50 flex items-center p-[1.5px]">
                <div className="h-full w-4/5 rounded-[1.5px] bg-foreground/70" />
              </div>
            </div>
          </div>
        </div>

        {/* App Header */}
        <div className="shrink-0 px-5 py-2 bg-background/95 backdrop-blur-sm border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: 'linear-gradient(135deg, #5b21b6, #7c3aed)' }}
            >
              <span className="text-white font-black text-[11px]">F</span>
            </div>
            <span className="text-sm font-black text-foreground tracking-tight">
              Fidel<span className="text-primary">+</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-medium text-muted-foreground">powered by</span>
            <span className="text-[11px] font-bold text-foreground">DODO CAFÉ</span>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto scroll-smooth-hidden">
          <div className="px-4 pt-4">
            {activeTab === 'home' && <HomeTab />}
            {activeTab === 'rewards' && <RewardsTab />}
            {activeTab === 'offers' && <OffersTab />}
            {activeTab === 'profile' && <ProfileTab />}
          </div>
        </div>

        {/* Bottom Tab Bar */}
        <div
          className="shrink-0 bg-background/95 backdrop-blur-xl border-t border-border"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}
        >
          <nav className="flex items-stretch h-16" aria-label="Navigație principală">
            {tabs.map(({ id, label, Icon, badge }) => {
              const isActive = activeTab === id
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    'flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-all duration-200',
                    'active:scale-95'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={label}
                >
                  {/* Active indicator pill */}
                  {isActive && (
                    <span
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b-full"
                      style={{ background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }}
                    />
                  )}

                  {/* Icon with badge */}
                  <div className="relative">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-2xl flex items-center justify-center transition-all duration-200',
                        isActive ? 'bg-primary/15 scale-110' : 'bg-transparent hover:bg-muted'
                      )}
                    >
                      <Icon
                        size={18}
                        strokeWidth={isActive ? 2.5 : 1.8}
                        className={cn(
                          'transition-colors duration-200',
                          isActive ? 'text-primary' : 'text-muted-foreground'
                        )}
                      />
                    </div>
                    {badge && !isActive && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center leading-none">
                        {badge}
                      </span>
                    )}
                  </div>

                  <span
                    className={cn(
                      'text-[10px] font-semibold transition-colors duration-200 leading-none',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {label}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
