import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Praguri de nivel (tier) pentru a calcula progresul spre urmatorul nivel
const TIERS = [
  { name: 'Bronze', min: 0, next: 'Silver', nextAt: 250 },
  { name: 'Silver', min: 250, next: 'Gold', nextAt: 500 },
  { name: 'Gold', min: 500, next: null, nextAt: null },
]

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  // Puncte acumulate luna curenta (din achizitii)
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const monthly = await prisma.purchase.aggregate({
    where: { userId: user.id, createdAt: { gte: startOfMonth } },
    _sum: { points: true },
  })

  const tierInfo = TIERS.find((t) => t.name === user.tier) ?? TIERS[0]

  const { password: _, ...safeUser } = user
  return NextResponse.json({
    user: {
      ...safeUser,
      firstName: user.name.split(' ')[0],
      avatarInitials: user.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase(),
      pointsThisMonth: monthly._sum.points ?? 0,
      nextTier: tierInfo.next,
      nextTierPoints: tierInfo.nextAt,
    },
  })
}
