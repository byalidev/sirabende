# SıraBende

SıraBende, kullanıcı taleplerini alan satıcı teklifleri ile eşleştiren bir platform için geliştirilen üretim odaklı bir temel altyapıdır. Bu aşamada öncelik, ileride büyüyecek bir uygulama için doğru veri modeli, Prisma schema ve PostgreSQL çalışma mantığını kurmaktır.

## Amaç

- Next.js + TypeScript tabanlı uygulama altyapısı kurmak
- Prisma ile PostgreSQL için genişletilebilir veri modeli oluşturmak
- İleride auth, talep/teklif, mesajlaşma ve AI işlevleri için sağlam temel hazırlamak
- FAZ 1 kapsamında yalnızca database mimarisini ve model katmanını geliştirmek

## Teknoloji stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM

## Gereksinimler

- Node.js 22+
- npm
- PostgreSQL sunucusu (yerel veya uzak)

## Kurulum

PowerShell'i proje klasöründe açın:

```powershell
cd "C:\Users\Ali Emir\Desktop\projects\sirabende"
```

```powershell
npm install
Copy-Item .env.example .env
```

## Environment variables

`.env` dosyasında şu değeri güncelleyin:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sirabende?schema=public"
```

Not: Gerçek üretim credential'ları bu dosyaya yazmayın. `.env` Git'e dahil edilmez.

## Geliştirme

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Prisma komutları

```bash
npx prisma validate
npx prisma generate
npx prisma format
npx prisma migrate dev --name init
npx prisma db seed
```

## Klasör yapısı

```text
src/
├── app/
├── components/
├── config/
├── lib/
├── server/
├── types/
└── ...
prisma/
├── schema.prisma
└── migrations/
```

- `src/app`: Next.js App Router katmanı
- `src/lib`: Prisma ve yardımcı servisler
- `src/server`: gelecekteki iş mantığı ve API katmanı
- `src/config`: uygulama ve çevre yapılandırması
- `prisma`: veritabanı şeması ve migration dosyaları
