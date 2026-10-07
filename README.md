# Marijana AI Design Studio

**AI-first editor za izradu digitalnih proizvoda.**

Korisnik opisuje proizvod na srpskom, a Studio ga pretvara u strukturu stranica i editable elemente.

## Arhitektura

CONTENT → AI ART DIRECTION → LAYOUT → DESIGN → EDITOR → EXPORT

## Trenutno

- Serbian-first interfejs
- Projekti i više stranica
- Live canvas
- Editable tekstualni, slikovni i grafički elementi
- Insert panel
- Upload slike
- Slika preko URL-a
- Mockup biblioteka
- Link elementi
- Video / tabela / grafikon blokovi
- Element Inspector
- Pomeranje, rotacija, veličina, boja, font, poravnanje
- Slojevi napred/nazad
- Dupliranje i brisanje
- Undo / Redo
- 20 Brand profila
- Biblioteka fontova, boja, paleta i stilova
- Lokalno čuvanje projekta
- JSON izvoz
- AI Design Agent API

## AI backend

API ruta je:

`POST /api/design-agent`

Server očekuje:

`OPENAI_API_KEY`

Opcionalno:

`OPENAI_MODEL`

Ako `OPENAI_MODEL` nije postavljen, API koristi podrazumevani model iz server konfiguracije.

**Nikada ne stavljati OPENAI_API_KEY u `app.js`, HTML ili drugi frontend fajl.**

## Lokalni razvoj

1. Instalirati Node.js.
2. Instalirati Vercel CLI.
3. Postaviti `OPENAI_API_KEY` kao environment variable.
4. Pokrenuti `vercel dev`.

## Sledeći razvojni nivo

1. Pravi image generation provider
2. Biblioteka korisničkih asseta
3. Crop i resize slike
4. Upload fontova
5. Drag/resize handles
6. Page templates
7. AI generisanje kompletne strukture proizvoda
8. PDF export
9. PNG export
10. Integracija sa Marijana Canvas editorom
