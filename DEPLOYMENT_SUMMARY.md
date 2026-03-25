# AUKSION Proyekti - Vercel ga Tayyorlik Xulasasi

## ✅ Tayyorlangan O'zgarishlar

### 1. **Session Management (Cookies)**
- `src/lib/auth.ts` - Cookies bilan session qilish
  - Admin login: admin / 1234
  - User login: Ismini kiritib login
  - Auto user registration
  - 7 kunga sessionlar saqlanadi

### 2. **In-Memory Database**
- `src/lib/db.ts` - Vercel serverless uchun tayyorlangan
  - Hech qanday SQLite database fayllar kerak emas
  - Faqat in-memory JavaScript arrays
  - Direct access va prepare() compatibility ikkalasi

### 3. **SQL-free Pages va Actions**
Barcha SQL prepare() calls olib tashland, faqat in-memory logic:
- `src/app/page.tsx` - Auksionlar ro'yxati
- `src/app/admin/page.tsx` - Admin dashboard
- `src/app/auction/[id]/page.tsx` - Auksion detalyları
- `src/app/admin/edit/[id]/page.tsx` - Raqam tahrirlash
- `src/app/admin/actions.ts` - Admin actions (add, edit, delete, etc)
- `src/app/auction/[id]/actions.ts` - Bid placement
- `src/app/login/actions.ts` - Login/logout

### 4. **Metadata Tuzatish**
- `src/app/layout.tsx` - Metadata yangilandi
  - Title: "VIP Auksion - Avtomobil Raqamlari"
  - Lang: uz

### 5. **Vercel Configuration**
- `.vercelignore` - Database va log fayllarni istisno qilish
- `next.config.ts` - Production uchun optimized
- `.gitignore` - Allaqachon *.db va *.log qo'shilgan

## 🚀 Deploy Qilish Uchun

### Lokal Test:
```bash
npm install
npm run build
npm start
```

### Vercel Deploy:
1. GitHub ga push qilish
2. Vercel Dashboard ga kirib yangi project qo'shish
3. Vercel avtomatik build va deploy qiladi

## 📊 Data Flow

```
User Session → Cookies (httpOnly for admin, normal for users)
                    ↓
Auth Checks (getSession())
                    ↓
In-Memory Data (db.users, db.plates, db.bids)
                    ↓
Revalidate Paths → ISR Cache Invalidation
```

## ⚠️ Eslatmalar

1. **Persistent Storage Yo'q**: Vercel serverless functions tarpai o'zaro mavjudot saqlamaydi
   - Multi-instance deploy qilsangiz har birining o'z datasi bo'ladi
   - Production uchun database qo'shish tavsiya etiladi

2. **Admin Credentials**: `.gitignore` da saqlang ✅

3. **Cookies Settings**:
   - Admin: httpOnly=true (XSS protection)
   - User: httpOnly=false (foydalanuvchi ko'rishi uchun)

## 📁 Ishlatilgan Fayllar

```
✅ D:\darslar\programming2\AUKSION\
   ├── src/
   │   ├── app/
   │   │   ├── page.tsx ✅ Tuzatildi
   │   │   ├── layout.tsx ✅ Tuzatildi
   │   │   ├── login/
   │   │   │   ├── page.tsx
   │   │   │   └── actions.ts
   │   │   ├── admin/
   │   │   │   ├── page.tsx ✅ Tuzatildi
   │   │   │   ├── actions.ts ✅ Tuzatildi (editPlateAction qo'shildi)
   │   │   │   ├── edit/[id]/page.tsx ✅ Tuzatildi
   │   │   │   ├── edit/[id]/EditPlateClientForm.tsx
   │   │   │   └── AddPlateForm.tsx
   │   │   └── auction/[id]/
   │   │       ├── page.tsx ✅ Tuzatildi
   │   │       ├── actions.ts ✅ Tuzatildi
   │   │       ├── BidClientCard.tsx
   │   │       └── AdminControlsCard.tsx
   │   └── lib/
   │       ├── db.ts ✅ In-memory qilindi
   │       ├── auth.ts ✅ Cookies bilan
   │       └── utils.ts
   ├── next.config.ts ✅ Tuzatildi
   ├── .gitignore ✅ *.db qo'shilgan
   ├── .vercelignore ✅ Yaratildi
   └── README.md - Yangilash kerak
```

## 🔧 Boshqa Config Fayllar

- `package.json` - O'zgarishsiz
- `tsconfig.json` - O'zgarishsiz
- `tailwind.config.mjs` - O'zgarishsiz
- `postcss.config.mjs` - O'zgarishsiz
- `eslint.config.mjs` - O'zgarishsiz

## ✨ Qolgan Ishlar

1. README.md ni o'zbekchaga toliq yangilash (opsional)
2. Local test qilish (npm run build)
3. GitHub ga push
4. Vercel ga deploy

Done! ✅
