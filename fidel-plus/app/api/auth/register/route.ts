import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, createSession } from '@/lib/auth'

// Genereaza un memberId de forma JC-XXXXXX
function generateMemberId(): string {
  const n = Math.floor(100000 + Math.random() * 900000)
  return `JC-${n}`
}

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Toate câmpurile sunt necesare' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Parola trebuie să aibă minim 6 caractere' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Acest email este deja înregistrat' }, { status: 409 })
    }

    const hashed = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name,
        memberId: generateMemberId(),
        points: 0,
        tier: 'Bronze',
        visits: 0,
        role: 'client',
      },
    })

    await createSession(user.id)

    const { password: _, ...safeUser } = user
    return NextResponse.json({ user: safeUser })
  } catch (e) {
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
