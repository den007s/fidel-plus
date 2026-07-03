'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Coffee, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/auth-context'

export default function LoginPage() {
  const router = useRouter()
  const { login, register } = useAuth()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setError('')
    setLoading(true)

    const result =
      mode === 'login'
        ? await login(email, password)
        : await register(name, email, password)

    setLoading(false)

    if (result.ok) {
      router.push('/') // intram in aplicatie
    } else {
      setError(result.error ?? 'A apărut o eroare')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg shadow-primary/30 mb-4"
            style={{ background: 'linear-gradient(135deg, #5b21b6, #7c3aed)' }}
          >
            <Coffee size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">
            Fidel<span className="text-primary">+</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">powered by DODO CAFÉ</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-3xl border border-border shadow-sm p-6">
          {/* Toggle login / register */}
          <div className="flex gap-2 mb-6 bg-muted rounded-2xl p-1">
            <button
              onClick={() => { setMode('login'); setError('') }}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                mode === 'login' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
              }`}
            >
              Intră în cont
            </button>
            <button
              onClick={() => { setMode('register'); setError('') }}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                mode === 'register' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
              }`}
            >
              Creează cont
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {mode === 'register' && (
              <Field icon={<UserIcon size={16} />} label="Nume complet">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Denis Petraru"
                  className="w-full bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                />
              </Field>
            )}

            <Field icon={<Mail size={16} />} label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplu.ro"
                className="w-full bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
              />
            </Field>

            <Field icon={<Lock size={16} />} label="Parolă">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="••••••••"
                className="w-full bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
              />
            </Field>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 rounded-2xl text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #5b21b6, #7c3aed)' }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {mode === 'login' ? 'Intră în cont' : 'Creează cont'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <div className="flex items-center gap-2.5 bg-muted/50 border border-border rounded-2xl px-3.5 py-3 focus-within:border-primary/50 transition-colors">
        <span className="text-muted-foreground">{icon}</span>
        {children}
      </div>
    </div>
  )
}
