# Teste de stres Fidel+ — instrucțiuni de rulare

Scenariu testat pentru fiecare utilizator virtual:
1. `POST /api/auth/login` — autentificare (obține cookie de sesiune)
2. `GET /api/rewards` — consultarea catalogului de recompense
3. `POST /api/redeem` — revendicarea recompensei cu `rewardId=2` (Reducere 10%, 150p)

Cookie-ul `fidelix_session` este preluat automat din login de către Cookie Manager
și trimis la pasul de redeem, exact ca într-un browser real.

---

## Pregătire (o singură dată)

1. **Aplicația trebuie să ruleze în mod producție** pe `http://localhost:3000`:
   ```
   npm start
   ```
   (dacă ai închis-o: `npm run build` apoi `npm start`)

2. **Creează conturile de test.** Într-un al doilea terminal, din folderul `fidel-plus`:
   ```
   npx tsx prisma/seed-stress.ts
   ```
   Dacă `tsx` nu e disponibil, încearcă:
   ```
   npx ts-node prisma/seed-stress.ts
   ```
   Ar trebui să vezi „✅ Am creat 100 conturi de test.”

---

## Rularea unui test

Testele se rulează din linia de comandă (mod „non-GUI”, recomandat oficial pentru
măsurători corecte — interfața grafică consumă resurse și falsifică cifrele).

Deschide un terminal **în folderul `stress-test`** și rulează, înlocuind CALEA cu
locul unde ai dezarhivat JMeter:

```
C:\Users\denis\Downloads\apache-jmeter-5.6.3\bin\jmeter -n -t FidelPlus_StressTest.jmx -JUSERS=10 -JRAMP_UP=2 -l rezultate_10.jtl -e -o raport_10
```

Parametri:
- `-JUSERS=10` — numărul de utilizatori virtuali simultani
- `-JRAMP_UP=2` — în câte secunde pornesc toți (2s = aproape simultan)
- `-l rezultate_10.jtl` — fișierul brut cu rezultate
- `-e -o raport_10` — generează un raport HTML în folderul `raport_10`

### Cele trei rulări pe care le facem (crescând încărcarea)

```
...\jmeter -n -t FidelPlus_StressTest.jmx -JUSERS=10  -JRAMP_UP=2 -l rezultate_10.jtl  -e -o raport_10
...\jmeter -n -t FidelPlus_StressTest.jmx -JUSERS=50  -JRAMP_UP=5 -l rezultate_50.jtl  -e -o raport_50
...\jmeter -n -t FidelPlus_StressTest.jmx -JUSERS=100 -JRAMP_UP=5 -l rezultate_100.jtl -e -o raport_100
```

> Între rulări, dacă vrei de fiecare dată o stare curată a bazei de date, rulează
> din nou `npx tsx prisma/seed-stress.ts` (resetează punctele conturilor de test).
> Nu e strict necesar, fiindcă fiecare cont are 100.000 de puncte.

---

## Ce să-mi trimiți înapoi

Din fiecare rulare, JMeter afișează la final în terminal un rezumat („summary =”).
Trimite-mi:

1. **Textul din terminal** de la finalul fiecărei rulări (rândurile care încep cu `summary`).
2. Sau, și mai bine: din fiecare folder `raport_XX`, deschide `index.html` în browser
   și trimite-mi un screenshot cu tabelul **„Statistics”** (are coloanele: Samples,
   Average, Min, Max, Error %, Throughput).

Cu cifrele astea îți scriu secțiunea pentru lucrare (metodologie + tabel de rezultate
+ interpretare legată de limita despre migrarea la PostgreSQL).
