import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, createSession } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email și parolă necesare' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'Email sau parolă incorecte' }, { status: 401 })
    }

    const valid = await verifyPassword(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Email sau parolă incorecte' }, { status: 401 })
    }

    await createSession(user.id)

    // Nu returnam niciodata hash-ul parolei
    const { password: _, ...safeUser } = user
    return NextResponse.json({ user: safeUser })
  } catch (e) {
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
