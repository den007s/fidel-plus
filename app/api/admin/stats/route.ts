import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Acces interzis' }, { status: 403 })
  }

  const totalClients = await prisma.user.count({ where: { role: 'client' } })
  const activeClients = await prisma.user.count({ where: { role: 'client', visits: { gt: 0 } } })
  const totalRedemptions = await prisma.redemption.count()

  const pointsIssued = await prisma.purchase.aggregate({ _sum: { points: true } })
  const pointsSpent = await prisma.redemption.aggregate({ _sum: { pointsSpent: true } })

  // Distributia pe niveluri (tier) - pentru un grafic
  const tiers = await prisma.user.groupBy({
    by: ['tier'],
    where: { role: 'client' },
    _count: { tier: true },
  })

  // Cele mai revendicate recompense - pentru un grafic
  const topRewardsRaw = await prisma.redemption.groupBy({
    by: ['rewardId'],
    _count: { rewardId: true },
  })
  const rewardNames = await prisma.reward.findMany()
  const topRewards = topRewardsRaw.map((r) => ({
    name: rewardNames.find((rn) => rn.id === r.rewardId)?.title ?? 'N/A',
    count: r._count.rewardId,
  }))

  const retentionRate = totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0

  return NextResponse.json({
    kpi: {
      totalClients,
      activeClients,
      retentionRate,
      pointsIssued: pointsIssued._sum.points ?? 0,
      pointsSpent: pointsSpent._sum.pointsSpent ?? 0,
      totalRedemptions,
    },
    tierDistribution: tiers.map((t) => ({ tier: t.tier, count: t._count.tier })),
    topRewards,
  })
}
