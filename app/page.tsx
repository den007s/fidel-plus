'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { FidelPlusApp } from '@/components/fidel-plus-app'
import { useAuth } from '@/components/auth-context'

export default function Page() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Cand verificarea sesiunii s-a terminat si stim ca nu e nimeni logat,
    // redirectionam catre login. Daca e admin, catre dashboard-ul de admin.
    if (!loading && !user) {
      router.push('/login')
    } else if (!loading && user?.role === 'admin') {
      router.push('/admin')
    }
  }, [loading, user, router])

  // Cat timp verificam sesiunea (sau redirectionam), aratam un ecran de incarcare
  if (loading || !user || user.role === 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    )
  }

  // Suntem logati ca client -> aratam aplicatia
  return (
    <main>
      <FidelPlusApp />
    </main>
  )
}
