// ============================================================================
// SEED PENTRU TESTELE DE STRES (JMeter)
// ============================================================================
// Ruleaza DUPA seed-ul normal. Adauga 100 de conturi de test dedicate testarii
// de incarcare, fiecare cu puncte suficiente incat sa NU pice pe regula de
// business "puncte insuficiente". Astfel testul masoara ce ne intereseaza cu
// adevarat: comportamentul serverului si al bazei de date sub cereri
// concurente, nu epuizarea punctelor unui singur cont.
//
// Conturi generate: loadtest1@fidel.test ... loadtest100@fidel.test
// Parola (identica pentru toate): stress123
// Puncte fiecare: 100000
//
// Rulare:  npx tsx prisma/seed-stress.ts
//   (sau: npx ts-node prisma/seed-stress.ts)
// ============================================================================

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const NUM_USERS = 100
const POINTS_EACH = 100000
const PASSWORD = 'stress123'

async function main() {
  console.log('🔧 Seed pentru testele de stres...')

  // Curatam eventualele conturi de test dintr-o rulare anterioara,
  // ca sa putem re-rula testul de la o stare curata si reproductibila.
  const existing = await prisma.user.findMany({
    where: { email: { startsWith: 'loadtest' } },
    select: { id: true },
  })
  if (existing.length > 0) {
    const ids = existing.map((u) => u.id)
    await prisma.redemption.deleteMany({ where: { userId: { in: ids } } })
    await prisma.session.deleteMany({ where: { userId: { in: ids } } })
    await prisma.user.deleteMany({ where: { id: { in: ids } } })
    console.log(`   Am sters ${existing.length} conturi de test dintr-o rulare anterioara.`)
  }

  // Toate conturile folosesc acelasi hash (parola comuna) -> un singur bcrypt.
  const hash = await bcrypt.hash(PASSWORD, 10)

  for (let i = 1; i <= NUM_USERS; i++) {
    await prisma.user.create({
      data: {
        email: `loadtest${i}@fidel.test`,
        password: hash,
        name: `Load Test ${i}`,
        memberId: `LT-${String(i).padStart(6, '0')}`,
        points: POINTS_EACH,
        tier: 'Gold',
        visits: 0,
        role: 'client',
      },
    })
  }

  console.log(`✅ Am creat ${NUM_USERS} conturi de test.`)
  console.log(`   Email:  loadtest1@fidel.test ... loadtest${NUM_USERS}@fidel.test`)
  console.log(`   Parola: ${PASSWORD}`)
  console.log(`   Puncte: ${POINTS_EACH} fiecare`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
