# Ghid de pornire — FideliX cu backend

Acest ghid te duce de la zip-ul descărcat până la aplicația care rulează cu bază de date reală și login funcțional. Urmează pașii **în ordine**.

---

## Înainte să începi: ce-ți trebuie

- **Node.js** instalat (versiunea 18 sau mai nouă). Verifici cu: `node --version`
  Dacă nu-l ai, descarcă-l de pe nodejs.org (versiunea LTS).
- Proiectul dezarhivat undeva unde-l găsești ușor (ex. Desktop).
- Un terminal deschis **în folderul proiectului** (acolo unde e `package.json`).

> Cum deschizi terminalul în folder: în VS Code, deschide folderul proiectului, apoi meniul `Terminal → New Terminal`. Sau click-dreapta pe folder → „Open in Terminal".

---

## Pasul 1 — Instalează dependențele

```bash
npm install
```

Asta citește `package.json` și descarcă toate bibliotecile (inclusiv cele noi de backend: Prisma, bcrypt). Durează 1-3 minute. E normal să vezi multe linii de text.

> Dacă vezi erori despre versiuni de pachete, încearcă: `npm install --legacy-peer-deps`

---

## Pasul 2 — Generează clientul Prisma

```bash
npx prisma generate
```

Asta creează codul prin care aplicația „vorbește" cu baza de date, pe baza schemei din `prisma/schema.prisma`. Rapid (câteva secunde).

---

## Pasul 3 — Creează baza de date

```bash
npm run db:push
```

Asta citește schema și creează fișierul bazei de date (`prisma/dev.db`) cu toate tabelele (utilizatori, recompense, etc.). E gol deocamdată — îl umplem la pasul următor.

---

## Pasul 4 — Populează baza de date (seed)

```bash
npm run db:seed
```

Asta rulează scriptul care adaugă datele inițiale: utilizatorul Andrei, un cont de admin, câțiva clienți de test, recompensele și ofertele. La final trebuie să vezi:

```
✅ Seed complet!
   Client: andrei.popescu@gmail.com / parola123
   Admin:  admin@jocafe.ro / admin123
```

---

## Pasul 5 — Pornește aplicația

```bash
npm run dev
```

Aștepți să vezi ceva de genul `Ready on http://localhost:3000`. Deschizi în browser:

**http://localhost:3000**

Ar trebui să fii redirectat automat la pagina de login.

---

## Ce ar trebui să meargă acum

1. **Login** — intri cu `andrei.popescu@gmail.com` / `parola123`.
2. **Înregistrare** — apeși „Creează cont", faci un cont nou (începe cu 0 puncte, nivel Bronze).
3. **Tab Home** — vezi datele reale ale contului (punctele lui Andrei: 320).
4. **Tab Rewards** — vezi recompensele din DB. Apeși „Revendică" la una pe care ți-o permiți → punctele scad. **Dă refresh la pagină (F5) — punctele rămân scăzute.** Asta demonstrează persistența reală.
5. **Logout** — încă nu e conectat (urmează în profile-tab).

---

## Unealtă bonus: vezi baza de date cu ochii tăi

```bash
npm run db:studio
```

Deschide o interfață vizuală (Prisma Studio) în browser unde vezi toate tabelele și datele — util pentru lucrare (poți face capturi de ecran ale bazei de date) și pentru a verifica că revendicările chiar se salvează.

---

## Dacă ceva nu merge

Notează **mesajul exact de eroare** (din terminal sau din consola browserului, tasta F12 → tab Console) și trimite-mi-l. Aproape sigur vom avea nevoie de o tură-două de ajustări — e absolut normal la prima integrare de backend, nu înseamnă că ai greșit ceva.

### Comenzi utile dacă vrei să o iei de la capăt cu datele

```bash
npm run db:reset
```

Șterge tot și repopulează baza de date curată (util dacă ai făcut multe teste și vrei date proaspete).
