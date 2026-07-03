import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Pornesc seed-ul bazei de date...')

  // Curatam datele existente (pentru re-rulari curate)
  await prisma.redemption.deleteMany()
  await prisma.purchase.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()
  await prisma.reward.deleteMany()
  await prisma.offer.deleteMany()

  // --- Utilizator client (datele clientului Denis Petraru) ---
  const clientPass = await bcrypt.hash('parola123', 10)
  const andrei = await prisma.user.create({
    data: {
      email: 'denis.petraru@gmail.com',
      password: clientPass,
      name: 'Denis Petraru',
      memberId: 'JC-204815',
      points: 320,
      tier: 'Silver',
      visits: 12,
      role: 'client',
    },
  })

  // --- Cont de administrator (pentru Admin Dashboard) ---
  const adminPass = await bcrypt.hash('admin123', 10)
  await prisma.user.create({
    data: {
      email: 'admin@dodocafe.ro',
      password: adminPass,
      name: 'Administrator DODO CAFÉ',
      memberId: 'JC-ADMIN',
      points: 0,
      tier: 'Gold',
      visits: 0,
      role: 'admin',
    },
  })

  // --- Cativa clienti suplimentari, ca Admin Dashboard sa arate populat ---
  const extraClients = [
    { name: 'Maria Ionescu', email: 'maria.ionescu@gmail.com', memberId: 'JC-204816', points: 540, tier: 'Gold', visits: 24 },
    { name: 'Vlad Georgescu', email: 'vlad.georgescu@gmail.com', memberId: 'JC-204817', points: 90, tier: 'Bronze', visits: 4 },
    { name: 'Elena Dumitru', email: 'elena.dumitru@gmail.com', memberId: 'JC-204818', points: 270, tier: 'Silver', visits: 11 },
    { name: 'Andrei Stoica', email: 'andrei.stoica@gmail.com', memberId: 'JC-204819', points: 15, tier: 'Bronze', visits: 1 },
  ]
  for (const c of extraClients) {
    await prisma.user.create({
      data: { ...c, password: clientPass, role: 'client' },
    })
  }

  // --- Recompense (din mock-data original) ---
  await prisma.reward.createMany({
    data: [
      { title: 'Cafea gratuită', description: 'Orice băutură la alegere', cost: 200, icon: '☕', category: 'drink' },
      { title: 'Reducere 10%', description: 'La orice comandă', cost: 150, icon: '🏷️', category: 'discount' },
      { title: 'Croissant gratuit', description: 'Proaspăt din cuptor', cost: 250, icon: '🥐', category: 'food' },
      { title: 'Acces eveniment VIP', description: 'Degustare exclusivă', cost: 500, icon: '🎟️', category: 'event' },
    ],
  })

  // --- Oferte (din mock-data original) ---
  await prisma.offer.createMany({
    data: [
      { title: 'Latte cu lapte de ovăz', description: 'Perfectă pentru dimineața ta. Savurează un latte cremos cu lapte de ovăz bio.', discount: 20, expiresAt: '15 iun 2026', tag: 'Recomandat AI', badge: 'POPULAR' },
      { title: 'Combo Matinal', description: 'Espresso + Croissant cu unt – combinația perfectă pentru start rapid.', discount: 15, expiresAt: '18 iun 2026', tag: 'Recomandat AI', badge: 'NOU' },
      { title: 'Cappuccino Double Shot', description: 'Dublu espresso, spumă fină – pentru zilele când ai nevoie de energie extra.', discount: 10, expiresAt: '20 iun 2026', tag: 'Recomandat AI', badge: null },
    ],
  })

  // --- Istoric achizitii pentru Andrei (din mock-data original) ---
  const history = [
    { items: 'Cappuccino + Croissant', total: 22.5, points: 45 },
    { items: 'Latte mare + Muffin', total: 19.0, points: 38 },
    { items: 'Espresso dublu', total: 10.0, points: 20 },
    { items: 'Frappe + Croissant cu ciocolată', total: 27.5, points: 55 },
    { items: 'Cappuccino + Muffin cu afine', total: 21.0, points: 42 },
  ]
  for (const h of history) {
    await prisma.purchase.create({ data: { ...h, userId: andrei.id } })
  }

  // --- Cateva revendicari de exemplu, ca graficele din Admin sa aiba date ---
  const allRewards = await prisma.reward.findMany()
  const allClients = await prisma.user.findMany({ where: { role: 'client' } })
  const sampleRedemptions = [
    { client: 'Maria Ionescu', reward: 'Cafea gratuită' },
    { client: 'Maria Ionescu', reward: 'Croissant gratuit' },
    { client: 'Elena Dumitru', reward: 'Reducere 10%' },
    { client: 'Denis Petraru', reward: 'Reducere 10%' },
    { client: 'Maria Ionescu', reward: 'Acces eveniment VIP' },
  ]
  for (const sr of sampleRedemptions) {
    const client = allClients.find((c) => c.name === sr.client)
    const reward = allRewards.find((r) => r.title === sr.reward)
    if (client && reward) {
      await prisma.redemption.create({
        data: { userId: client.id, rewardId: reward.id, pointsSpent: reward.cost },
      })
    }
  }

  console.log('✅ Seed complet!')
  console.log('   Client: denis.petraru@gmail.com / parola123')
  console.log('   Admin:  admin@dodocafe.ro / admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
