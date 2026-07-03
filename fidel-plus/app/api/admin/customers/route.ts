import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Segmentam clientii dupa comportament (logica simpla de business)
function segment(visits: number, points: number): string {
  if (visits === 0) return 'Inactiv'
  if (visits >= 20 || points >= 500) return 'Fidel'
  if (visits <= 3) return 'Nou'
  return 'Activ'
}

export async function GET() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Acces interzis' }, { status: 403 })
  }

  const clients = await prisma.user.findMany({
    where: { role: 'client' },
    orderBy: { points: 'desc' },
    select: {
      id: true, name: true, email: true, memberId: true,
      points: true, tier: true, visits: true, createdAt: true,
    },
  })

  const withSegment = clients.map((c) => ({ ...c, segment: segment(c.visits, c.points) }))
  return NextResponse.json({ customers: withSegment })
}
