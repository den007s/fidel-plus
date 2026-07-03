export const user = {
  name: 'Andrei Popescu',
  firstName: 'Andrei',
  email: 'andrei.popescu@gmail.com',
  memberId: 'JC-204815',
  points: 320,
  tier: 'Silver' as const,
  nextTierPoints: 500,
  nextTier: 'Gold' as const,
  visits: 12,
  pointsThisMonth: 85,
  avatarInitials: 'AP',
}

export const rewards = [
  {
    id: 1,
    title: 'Cafea gratuită',
    description: 'Orice băutură la alegere',
    cost: 200,
    icon: '☕',
    category: 'drink',
  },
  {
    id: 2,
    title: 'Reducere 10%',
    description: 'La orice comandă',
    cost: 150,
    icon: '🏷️',
    category: 'discount',
  },
  {
    id: 3,
    title: 'Croissant gratuit',
    description: 'Proaspăt din cuptor',
    cost: 250,
    icon: '🥐',
    category: 'food',
  },
  {
    id: 4,
    title: 'Acces eveniment VIP',
    description: 'Degustare exclusivă',
    cost: 500,
    icon: '🎟️',
    category: 'event',
  },
]

export const badges = [
  { id: 1, title: 'Prima vizită', icon: '🌟', earned: true },
  { id: 2, title: '5 vizite', icon: '🏅', earned: true },
  { id: 3, title: 'Matinal', icon: '🌅', earned: true },
  { id: 4, title: 'Client fidel', icon: '💎', earned: true },
  { id: 5, title: 'Gurmand', icon: '🍰', earned: false },
  { id: 6, title: 'Social', icon: '👥', earned: false },
]

export const challenges = [
  {
    id: 1,
    title: 'Cumpără 3 cafele',
    description: 'Progres săptămânal',
    current: 2,
    target: 3,
    reward: 50,
    icon: '☕',
  },
  {
    id: 2,
    title: 'Invită un prieten',
    description: 'Recomandare nouă',
    current: 0,
    target: 1,
    reward: 100,
    icon: '👥',
  },
]

export const offers = [
  {
    id: 1,
    title: 'Latte cu lapte de ovăz',
    description: 'Perfectă pentru dimineața ta. Savurează un latte cremos cu lapte de ovăz bio.',
    discount: 20,
    expiresAt: '15 iun 2026',
    tag: 'Recomandat AI',
    badge: 'POPULAR',
  },
  {
    id: 2,
    title: 'Combo Matinal',
    description: 'Espresso + Croissant cu unt – combinația perfectă pentru start rapid.',
    discount: 15,
    expiresAt: '18 iun 2026',
    tag: 'Recomandat AI',
    badge: 'NOU',
  },
  {
    id: 3,
    title: 'Cappuccino Double Shot',
    description: 'Dublu espresso, spumă fină – pentru zilele când ai nevoie de energie extra.',
    discount: 10,
    expiresAt: '20 iun 2026',
    tag: 'Recomandat AI',
    badge: null,
  },
]

export const purchaseHistory = [
  {
    id: 1,
    date: '12 iun 2026',
    time: '08:45',
    items: 'Cappuccino + Croissant',
    points: 45,
    total: '22,50 RON',
  },
  {
    id: 2,
    date: '10 iun 2026',
    time: '09:12',
    items: 'Latte mare + Muffin',
    points: 38,
    total: '19,00 RON',
  },
  {
    id: 3,
    date: '7 iun 2026',
    time: '07:58',
    items: 'Espresso dublu',
    points: 20,
    total: '10,00 RON',
  },
  {
    id: 4,
    date: '5 iun 2026',
    time: '13:30',
    items: 'Frappe + Croissant cu ciocolată',
    points: 55,
    total: '27,50 RON',
  },
  {
    id: 5,
    date: '2 iun 2026',
    time: '10:05',
    items: 'Cappuccino + Muffin cu afine',
    points: 42,
    total: '21,00 RON',
  },
]
