import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Neautentificat' }, { status: 401 })

  const { rewardId } = await req.json()
  const reward = await prisma.reward.findUnique({ where: { id: Number(rewardId) } })

  if (!reward || !reward.active) {
    return NextResponse.json({ error: 'Recompensă inexistentă' }, { status: 404 })
  }

  // Regula de business: nu poti revendica daca nu ai suficiente puncte
  if (user.points < reward.cost) {
    return NextResponse.json(
      { error: 'Puncte insuficiente', needed: reward.cost, have: user.points },
      { status: 400 }
    )
  }

  // Tranzactie atomica: scadem punctele SI inregistram revendicarea impreuna.
  // Daca una esueaza, ambele se anuleaza -> datele raman consistente.
  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { points: { decrement: reward.cost } },
    }),
    prisma.redemption.create({
      data: { userId: user.id, rewardId: reward.id, pointsSpent: reward.cost },
    }),
  ])

  return NextResponse.json({
    success: true,
    newPoints: updatedUser.points,
    reward: reward.title,
  })
}
