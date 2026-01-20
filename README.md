# Kokoushuonevarausjärjestelmä

REST API kokoushuoneiden varaamiseen. Mahdollistaa varausten luomisen, peruutuksen ja katselun huonekohtaisesti.

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Express](https://img.shields.io/badge/Express-5.2-green)
![Jest](https://img.shields.io/badge/Jest-30.2-red)
![Test Coverage](https://img.shields.io/badge/Coverage-96%25-brightgreen)

---

## Ominaisuudet

- RESTful API kokoushuoneiden varaamiseen
- In-memory tietokanta esiladatuilla huoneilla
- Kattava testaus (47 yksikkö- ja integraatiotestiä)
- Interaktiivinen OpenAPI/Swagger-dokumentaatio
- Täydellinen tyyppiturvallisuus TypeScriptillä
- Validointi ja virheenkäsittely
- Business-sääntöjen valvonta (ei päällekkäisyyksiä, ei menneisyyteen)

---

## Teknologiastack

| Teknologia          | Versio        | Käyttötarkoitus   |
| ------------------- | ------------- | ----------------- |
| **TypeScript**      | 5.9.3         | Ohjelmointikieli  |
| **Express.js**      | 5.2.1         | Web-framework     |
| **Jest**            | 30.2.0        | Testausframework  |
| **Supertest**       | 7.2.2         | HTTP-testaus      |
| **Swagger/OpenAPI** | 6.2.8 / 5.0.1 | API-dokumentaatio |
| **uuid**            | 13.0.0        | ID-generointi     |

---

## API-endpointit

| Metodi     | Endpoint                      | Kuvaus                | Vastaukset         |
| ---------- | ----------------------------- | --------------------- | ------------------ |
| **POST**   | `/api/bookings`               | Luo uusi varaus       | 201, 400, 404, 409 |
| **DELETE** | `/api/bookings/:id`           | Poista varaus         | 204, 404           |
| **GET**    | `/api/rooms/:roomId/bookings` | Hae huoneen varaukset | 200, 404           |

### Esimerkkipyyntö: Varauksen luonti

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "room-1",
    "userId": "user-123",
    "userEmail": "user@example.com",
    "title": "Tiimipalaveri",
    "startTime": "2026-01-21T10:00:00.000Z",
    "endTime": "2026-01-21T11:00:00.000Z"
  }'
```

### Vastaus

```json
{
  "id": "uuid-generated-id",
  "roomId": "room-1",
  "roomName": "Neuvotteluhuone A",
  "userId": "user-123",
  "userEmail": "user@example.com",
  "title": "Tiimipalaveri",
  "startTime": "2026-01-21T10:00:00.000Z",
  "endTime": "2026-01-21T11:00:00.000Z",
  "createdAt": "2026-01-20T12:00:00.000Z"
}
```

---

## Aloitus

### Esivaatime

- **Node.js** 18.x tai 20.x
- **npm** 9.x tai uudempi

### Asennus

```bash
# Kloonaa repositorio
git clone <repository-url>
cd vincit-kokoushuonevaraus

# Asenna riippuvuudet
npm install
```

### Kehitysajo

```bash
npm run dev
```

Palvelin käynnistyy osoitteessa: **http://localhost:3000**

API-dokumentaatio (Swagger UI): **http://localhost:3000/api-docs**

### Testaus

```bash
# Aja kaikki testit
npm run test

# Testit watch-tilassa
npm run test:watch

# Testikattavuusraportti
npm run test:coverage

# TypeScript-tarkistus
npm run typecheck
```

### Tuotanto

```bash
# Käännä TypeScript JavaScriptiksi
npm run build

# Käynnistä tuotantopalvelin
npm run start
```

---

## Projektirakenne

```
src/
├── models/           # Tietomallit (Booking, Room)
├── services/         # Business-logiikka
├── controllers/      # HTTP-käsittelijät
├── routes/           # API-reitit (OpenAPI-dokumentoitu)
├── validators/       # Syötteiden validointi
├── middleware/       # Express-middlewaret (virheenkäsittely)
├── database/         # In-memory tietokanta
├── config/           # Konfiguraatiot (Swagger)
├── utils/            # Apufunktiot (päivämääräkäsittely)
├── errors/           # Custom error-luokat
├── app.ts            # Express-sovellus
└── index.ts          # Palvelimen käynnistyspiste

tests/
├── unit/             # Yksikkötestit (validators, services, utils)
├── integration/      # API-integraatiotestit
└── __mocks__/        # Test mockit (uuid)
```

---

## API-dokumentaatio

Projekti sisältää täydellisen **OpenAPI 3.0** -spesifikaation interaktiivisella Swagger UI:lla.

**Käyttö:**

1. Käynnistä palvelin: `npm run dev`
2. Avaa selaimessa: http://localhost:3000/api-docs
3. Tutustu endpointeihin
4. Testaa API:a "Try it out" -toiminnolla

**Dokumentaatio sisältää:**

- Jokaisen endpointin kuvauksen
- Request/response-skeemat
- HTTP-statuskoodit
- Esimerkkipyynnöt ja -vastaukset

---

## Testaus

Projekti noudattaa **TDD-lähestymistapaa** ja sisältää kattavan testikokoelman.

**Testikattavuus:** 96.84%

**Testityypit:**

- **Yksikkötestit** (32 testiä):
  - Validointi (17 testiä)
  - Palvelut (7 testiä)
  - Apufunktiot (15 testiä)
- **Integraatiotestit** (8 testiä):
  - API-endpointit end-to-end

**Testaustyökalut:**

- Jest 30.x - Testausframework
- Supertest - HTTP-testaus
- ts-jest - TypeScript-tuki

```bash
# Aja testit
npm run test

# Katso testikattavuus
npm run test:coverage
```

---

## Business-säännöt

API valvoo seuraavia liiketoimintasääntöjä:

1. **Ei päällekkäisiä varauksia** - Sama huone ei voi olla varattu kahdesti samaan aikaan
2. **Ei varauksia menneisyyteen** - Sekä alku- että loppuajan on oltava tulevaisuudessa
3. **Aikavälin validointi** - Aloitusajan on oltava ennen lopetusaikaa

**Päällekkäisyyden tarkistus:**

```typescript
// Varaukset menevät päällekkäin jos:
newStart < existingEnd && newEnd > existingStart;
```

---

## Esiladatut huoneet

API sisältää neljä esiladattua kokoushuonetta:

| ID     | Nimi              |
| ------ | ----------------- |
| room-1 | Neuvotteluhuone A |
| room-2 | Neuvotteluhuone B |
| room-3 | Kokoushuone C     |
| room-4 | Auditorio         |

---

## Virheenkäsittely

API käyttää standardoituja HTTP-statuskoodeja ja yhtenäistä virheformaattia:

**Virhetyypit:**

- **400 Bad Request** - Validointivirhe
- **404 Not Found** - Resurssia ei löydy
- **409 Conflict** - Päällekkäinen varaus
- **500 Internal Server Error** - Odottamaton virhe

**Virhevastauk esimerkki:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "startTime",
        "message": "startTime ei voi olla menneisyydessä"
      }
    ]
  }
}
```

---

## Kehitystyökalut

- **nodemon** - Automaattinen palvelimen uudelleenkäynnistys
- **ts-node** - TypeScript-suoritus ilman kääntämistä
- **TypeScript strict mode** - Maksimaalinen tyyppiturvallisuus
- **Jest watch mode** - Jatkuva testausympäristö

---

## Komennot

```bash
npm run dev            # Kehityspalvelin (nodemon + ts-node)
npm run build          # TypeScript-kääntäminen
npm run start          # Tuotantopalvelin
npm run test           # Testit
npm run test:watch     # Testit watch-tilassa
npm run test:coverage  # Testikattavuusraportti
npm run typecheck      # TypeScript-tarkistus
```

---

## Tekijä

Toteutettu osana Vincit Oy:n rekrytointitehtävää.
