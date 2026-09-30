# Carcrank

Next.js 14 (App Router) + Tailwind + Prisma/SQLite. Poora light, professional theme.

## Yeh zip already ready-to-run hai

`.env` aur `.env.local` **already is folder mein maujood hain**, aur database
(`prisma/dev.db`) **already ban chuki hai**. Koi extra setup command
(migrate/env banana) chalane ki zaroorat nahi.

**Admin login password:** `password@2026`
(is folder ki `.env.local` file mein — production mein jaane se pehle change kar dein)

## Chalane ke liye — sirf 2 commands

```bash
npm install
npm run dev
```

Phir browser mein:
- Public site: http://localhost:3000
- Admin panel: http://localhost:3000/admin/login (password: `password@2026`)

## User flow (public site)

1. **Step 1 — Landing page** (`/`): heading, checklist, aur "Continue securely"
   button. Registration-number form hata di gayi hai — button seedha Step 2
   khol deta hai.
2. **Step 2 — Car select popup**: admin ne jo cars `/admin` se add ki hain,
   wo yahan image + naam ke sath dikhti hain. User ek car select karta hai.
3. **Step 3 — Options popup**: us specific car ke liye admin ne jo options
   banaye hain (`/admin/cars/[id]/options` se — koi bhi naam ho sakta hai,
   jaise "Finance", "Cash Buyer", waghera), wo yahan dikhte hain.
4. User option select karta hai → ek **naya browser tab khulta hai**, jisme
   abhi ek placeholder "Sign in" page hai (`/app/portal/page.tsx`) — is page
   ka final design baad mein diya jayega.
   - Har completed journey (car + option) `Lead` table mein save ho jati hai.

## Admin panel (`/admin`) — poora light/professional theme

- **Inventory** (`/admin`) — cars ki list: add / edit / delete, har car ke
  saamne "Options" link
- **Options** (`/admin/cars/[id]/options`) — us car ke Step-3 options
  add/edit/delete karna (label + redirect link + display order)
- **Leads** (`/admin/leads`) — har user submission: date, konsi car, konsa
  option, kis link par bheja gaya — sab ek table mein

## Agar aap ye project dobara kisi naye folder mein le jayein

`.env` aur `.env.local` files copy karna na bhoolein (ya inhe khud dobara
banayein) — ye files har naye folder mein alag se chahiye hoti hain, zip mein
already shamil hain lekin agar aap manually copy-paste karte hain to inhe bhi
saath le jayein.

Agar database reset karni ho (sab cars/leads mita kar naya shuru karna ho):
```bash
rm prisma/dev.db
npx prisma migrate deploy
```

## Aage kya karna hai (jab aap ready hon)

1. `/portal` page ka final design + real login/authentication logic
2. Registration-number / vehicle lookup dobara chahiye ho to
   `app/api/vehicle-lookup/route.ts` already stub ke roop mein maujood hai
3. Production ke liye SQLite ki jagah Postgres (jaise Neon/Supabase) behtar
   rahega, aur `ADMIN_PASSWORD` ko strong/unique rakhna zaroori hai
