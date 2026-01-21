# CLAUDE.md – Kokoushuonevarausjärjestelmä

---

## Projektin perustiedot

**Projektin nimi:** Meeting Room Booking API
**Käyttäjä:** Lucas
**Kuvaus:** REST API kokoushuoneiden varaamiseen
**Tavoite:** Mahdollistaa varausten luonti, peruutus ja katselu huonekohtaisesti

---

## Teknologiastack

| Teknologia | Versio | Käyttötarkoitus                |
| ---------- | ------ | ------------------------------ |
| TypeScript | 5.x    | Ohjelmointikieli               |
| Express.js | 5.x    | Web-framework                  |
| Jest       | 30.x   | Yksikkö- ja integraatiotestaus |
| uuid       | 13.x   | Uniikkien ID:iden generointi   |
| Supertest  | 7.x    | HTTP-testauskirjasto           |

---

## Vaatimukset

### Toiminnalliset vaatimukset

- Varauksen luonti tietylle aikavälille (POST /api/bookings)
- Varauksen peruutus (DELETE /api/bookings/:id)
- Varausten katselu huonekohtaisesti (GET /api/rooms/:roomId/bookings)

### Ei-toiminnalliset vaatimukset

- In-memory tietokanta (ei ulkoista tietokantaa)
- RESTful API -arkkitehtuuri
- Kattava yksikkö- ja integraatiotestaus
- Tyyppiturvallisuus TypeScriptillä

### Rajaukset

- Ei autentikointia tai käyttäjähallintaa
- Ei huoneiden CRUD-operaatioita (esiladatut huoneet)
- Ei varausten muokkausta (vain luonti ja poisto)

---

## Business-säännöt

1. **Ei päällekkäisyyksiä** - Sama huone ei voi olla varattu kahdesti samaan aikaan
2. **Ei menneisyyteen** - Varauksen alkuaika ei voi olla menneisyydessä
3. **Alkuaika < loppuaika** - Aloitusajan on oltava ennen lopetusaikaa

---

## Oletukset

1. **Aikavyöhyke:** API käsittelee kaikki ajat UTC-muodossa (ISO 8601)
2. **Käyttäjät:** userId ja userEmail tallennetaan varaukseen, ei erillistä käyttäjähallintaa
3. **Huoneet:** Esiladatut huoneet tietokannassa käynnistyksen yhteydessä
4. **Varauksen kesto:** Ei ylärajaa varauksen pituudelle

---

## Koodistandardit

### Yleiset periaatteet

- Selkeä ja luettava koodi
- Yksi funktio = yksi tehtävä
- Kuvaavat nimet muuttujille ja funktioille
- Kommentoi MIKSI, ei MITÄ

### Nimeämiskäytännöt

| Tyyppi            | Käytäntö       | Esimerkki             |
| ----------------- | -------------- | --------------------- |
| Tiedostot         | kebab-case     | booking.service.ts    |
| Funktiot          | camelCase      | createBooking()       |
| Luokat/Interfacet | PascalCase     | BookingService        |
| Vakiot            | SCREAMING_SNAKE| MAX_BOOKING_DURATION  |
| Muuttujat         | camelCase      | bookingList           |

### Virheenkäsittely

- Kaikki virheet käsitellään custom error -luokilla (AppError, ValidationError, NotFoundError, ConflictError)
- Globaali virheenkäsittely-middleware Expressille
- Async-virheet aina try-catchilla tai error-middlewarella

### Testaus

- TDD-lähestyminen: testit ensin kriittisille osille
- Yksikkötestit: validators, services, utils
- Integraatiotestit: API-reitit
- Testikattavuus: pyritään >80%

---

## Komennot

```bash
# Kehitys
npm run dev

# Testaus
npm run test
npm run test:watch
npm run test:coverage

# Laadunvarmistus
npm run typecheck

# Tuotanto
npm run build
npm run start
```

---

## Projektirakenne

```
meeting-room-booking-api/
├── src/
│   ├── models/
│   │   ├── booking.model.ts
│   │   └── room.model.ts
│   ├── validators/
│   │   └── booking.validator.ts
│   ├── services/
│   │   ├── booking.service.ts
│   │   └── room.service.ts
│   ├── controllers/
│   │   └── booking.controller.ts
│   ├── routes/
│   │   ├── booking.routes.ts
│   │   └── index.ts
│   ├── middleware/
│   │   └── errorHandler.ts
│   ├── database/
│   │   └── inMemoryDb.ts
│   ├── utils/
│   │   └── dateUtils.ts
│   ├── errors/
│   │   └── customErrors.ts
│   ├── app.ts
│   └── index.ts
├── tests/
│   ├── unit/
│   │   ├── validators/
│   │   ├── services/
│   │   └── utils/
│   └── integration/
│       └── booking.routes.test.ts
├── package.json
├── tsconfig.json
├── jest.config.js
├── CLAUDE.md
├── PROMPTIT.md
└── ANALYYSI.md
```

---

## API-rajapinta

| Metodi | Endpoint                      | Kuvaus            |
| ------ | ----------------------------- | ----------------- |
| POST   | /api/bookings                 | Luo varaus        |
| DELETE | /api/bookings/:id             | Peruuta varaus    |
| GET    | /api/rooms/:roomId/bookings   | Huoneen varaukset |

---

# AGENTIN TOIMINTAOHJEET

## 1. Kontekstin hallinta (~20 viestin raja)

### Kun viestimäärä lähestyy 20:tä:

**1. Ilmoita käyttäjälle:**

```
"Huomio: Olemme lähestymässä ~20 viestin rajaa tässä sessiossa.
Suosittelen session vaihtoa kontekstin laadun säilyttämiseksi.
Kirjoitan CONTEXT_HANDOFF.md-tiedoston ennen vaihtoa."
```

**2. Kirjoita CONTEXT_HANDOFF.md:**

```markdown
# Context Handoff – Sessio X → Sessio X+1

**Päivämäärä:** DD.MM.YYYY, klo HH:MM
**Edellinen sessio:** X
**Viestimäärä:** ~Y

## Projektin nykytila

### Valmiit:

- [x] [Tiedosto/toiminto 1]
- [x] [Tiedosto/toiminto 2]

### Kesken:

- [ ] [Tiedosto/toiminto 3]

### Toimivuus:

- Käynnistyy: [kyllä/ei]
- Testit: [X/Y läpi]
- Lint: [OK/virheitä]

## Seuraavat tehtävät

1. [Tehtävä 1]
2. [Tehtävä 2]

## Tärkeät päätökset

- [Päätös 1: perustelu]

## Uuden session aloitus

Kopioi uuteen sessioon:
```

Lue CLAUDE.md ja CONTEXT_HANDOFF.md. Jatketaan siitä mihin jäätiin.

```

```

**3. Odota vahvistus** ennen session lopettamista.

---

## 3. Vaiheittainen rakentaminen

### ÄLÄ KOSKAAN:

- Generoi koko sovellusta kerralla
- Tee yli 3 tiedoston muutoksia yhdellä kertaa
- Oleta mitä käyttäjä haluaa – kysy

### AINA:

- Ehdota suunnitelma ENNEN toteutusta
- Toteuta yksi looginen kokonaisuus kerrallaan
- Kysy vahvistus ennen seuraavaan vaiheeseen siirtymistä
- Selitä MIKSI teet asiat tietyllä tavalla

### Tyypillinen rakentamisjärjestys:

```
1. Tyypit ja interfacet
2. Tiedon tallennus / tietokanta
3. Validointi
4. Business-logiikka + testit (yhdessä)
5. Rajapinta/reitit + integraatiotestit
6. Virheenkäsittely
7. Dokumentaatio
```

### Vaihe-ehdotuksen formaatti:

```markdown
## Ehdotan seuraavaksi: [Vaiheen nimi]

**Mitä tehdään:**

- [Konkreettinen asia 1]
- [Konkreettinen asia 2]

**Tiedostot joita muokataan/luodaan:**

- [tiedosto1.ts] – [kuvaus]
- [tiedosto2.ts] – [kuvaus]

**Hyväksytkö vai haluatko muutoksia?**
```

---

## 4. Testit ensin (TDD-henkinen)

### Kun mahdollista, ehdota:

```markdown
Ennen implementaatiota, kirjoitetaan testit jotka määrittelevät:

1. Onnistuneen tapauksen
2. Virhetapauksen
3. Reunatapauksen: [spesifi tapaus]

Näin varmistetaan että ymmärrämme vaatimukset oikein.
```

### Testien prioriteetti:

1. **Business-kriittiset** – ydinlogiikka
2. **Reunatapaukset** – virhetilanteet, rajat
3. **Integraatio** – komponenttien yhteistoiminta

---

## 5. Koodin tarkistus muutosten jälkeen

### Jokaisen koodimuutoksen jälkeen, aja:

```bash
npm run typecheck && npm run test
```

### ÄLÄ ehdota seuraavaa vaihetta ennen kuin:

- [ ] Ei tyyppivirheitä
- [ ] Testit menevät läpi

### Jos virheitä ilmenee:

1. Ilmoita selkeästi mikä on vialla
2. Ehdota korjausta
3. Odota hyväksyntä ennen korjaamista

---

## 6. Virheiden tunnistaminen ja raportointi

### Jos huomaat generoineesi ongelmallista koodia:

```markdown
**Huomio:** Havaitsin ongelman generoimassani koodissa.

**Ongelma:** [Kuvaus]
**Sijainti:** [Tiedosto, rivi/funktio]
**Riski:** [Mitä voi tapahtua]
**Korjausehdotus:** [Miten korjataan]

Haluatko että korjaan tämän?
```

### Tyypilliset tarkistettavat asiat:

- [ ] Virheenkäsittely kaikissa async-operaatioissa
- [ ] Syötteiden validointi
- [ ] Null/undefined-tarkistukset
- [ ] Resurssien vapautus (tiedostot, yhteydet)
- [ ] Tietoturva (injektiot, XSS, jne.)

---

## 7. Kommunikaation selkeys

### Kun selität päätöksiä:

```markdown
**Valitsin [X] koska:**

1. [Perustelu 1]
2. [Perustelu 2]

**Vaihtoehtona harkitsin [Y], mutta:**

- [Miksi ei valittu]
```

### Kun olet epävarma:

```markdown
**Tarvitsen tarkennusta:**

- [Kysymys 1]
- [Kysymys 2]

Oletus jos et tarkenna: [Mitä teen oletuksena]
```

### Kun tehtävä on monitulkintainen:

```markdown
**Ymmärsin tehtävän näin:** [Tulkintasi]

**Vaihtoehtoiset tulkinnat:**

- [Tulkinta A]
- [Tulkinta B]

Kumpi vastaa tarkoitustasi?
```

---

## 8. Commitit ja versionhallinta

### Commit-viestien formaatti:

```
[tyyppi]: [lyhyt kuvaus]

Tyypit:
- lisäys: Uusi toiminnallisuus
- korjaus: Bugikorjaus
- refaktorointi: Koodin uudelleenjärjestely
- testi: Testien lisäys/muokkaus
- dokumentaatio: Dokumentaation päivitys
- konfiguraatio: Konfiguraatiomuutokset
```

### Commit-strategia:

- Yksi looginen muutos = yksi commit
- Commitoi toimiva tila (testit menevät läpi)
- Älä yhdistä useita muutoksia samaan committiin

---

## 9. Muistilista jokaiseen sessioon

### Session alussa:

- [ ] Lue CLAUDE.md
- [ ] Lue CONTEXT_HANDOFF.md (jos jatkosessio)
- [ ] Vahvista session tavoite käyttäjältä

### Session aikana:

- [ ] Yksi vaihe kerrallaan
- [ ] Kysy vahvistus ennen etenemistä
- [ ] Aja tarkistukset muutosten jälkeen
- [ ] Seuraa viestimäärää (~20 raja)

### Session lopussa:

- [ ] Päivitä CONTEXT_HANDOFF.md (jos vaihdetaan sessiota)
- [ ] Listaa seuraavat tehtävät
- [ ] Varmista että kaikki on dokumentoitu

---

## 10. Kielletyt toiminnot

### ÄLÄ KOSKAAN:

| Kielletty                         | Syy                |
| --------------------------------- | ------------------ |
| Generoi >3 tiedostoa kerralla     | Laatu kärsii       |
| Oleta käyttäjän tarkoitusta       | Kysy aina          |
| Jätä virheitä raportoimatta       | Rehellisyys ensin  |
| Jatka ilman vahvistusta           | Käyttäjä päättää   |
| Käytä `any`-tyyppiä (TS)          | Tyyppiturvallisuus |
| Jätä async-virheet käsittelemättä | Sovellus kaatuu    |
| Ohita testit                      | Laatu kärsii       |

---

## Päällekkäisyyden tarkistuslogiikka

Kriittinen algoritmi varausten päällekkäisyyden tarkistukseen:

```
Olemassaoleva:  |-------|
Uusi 1:      |---|          (loppuu kun vanha alkaa - OK)
Uusi 2:             |---|   (alkaa kun vanha loppuu - OK)
Uusi 3:        |---|        (menee päällekkäin alusta - KONFLIKTI)
Uusi 4:            |---|    (menee päällekkäin lopusta - KONFLIKTI)
Uusi 5:         |-|         (sisällä - KONFLIKTI)
Uusi 6:      |---------|    (sisältää vanhan - KONFLIKTI)
```

Päällekkäisyys havaitaan kun: `newStart < existingEnd && newEnd > existingStart`
