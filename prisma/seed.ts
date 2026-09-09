import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seed başlıyor...\n");

  // 1. Rolleri oluştur
  console.log("📋 Roller oluşturuluyor...");
  await prisma.role.upsert({
    where: { name: "USER" },
    update: {},
    create: {
      name: "USER",
      description: "Normal kullanıcı rolü",
    },
  });

  await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: {
      name: "ADMIN",
      description: "Admin rolü",
    },
  });

  await prisma.role.upsert({
    where: { name: "SUPER_ADMIN" },
    update: {},
    create: {
      name: "SUPER_ADMIN",
      description: "Süper admin rolü",
    },
  });

  console.log("✅ Roller oluşturuldu\n");

  // 2. Kategorileri oluştur (hiyerarşik yapı)
  console.log("🏷️  Kategoriler oluşturuluyor...");

  // Elektronik (parent)
  const elektronik = await prisma.category.upsert({
    where: { slug: "elektronik" },
    update: {},
    create: {
      name: "Elektronik",
      slug: "elektronik",
      description: "Elektronik ürünleri",
      isActive: true,
    },
  });

  // Elektronik > Telefon
  const telefon = await prisma.category.upsert({
    where: { slug: "telefon" },
    update: {},
    create: {
      name: "Telefon",
      slug: "telefon",
      description: "Cep telefonları",
      parentId: elektronik.id,
      isActive: true,
    },
  });

  // Elektronik > Bilgisayar
  const bilgisayar = await prisma.category.upsert({
    where: { slug: "bilgisayar" },
    update: {},
    create: {
      name: "Bilgisayar",
      slug: "bilgisayar",
      description: "Dizüstü ve masaüstü bilgisayarlar",
      parentId: elektronik.id,
      isActive: true,
    },
  });

  // Elektronik > Oyun Konsolu
  const konsol = await prisma.category.upsert({
    where: { slug: "oyun-konsolu" },
    update: {},
    create: {
      name: "Oyun Konsolu",
      slug: "oyun-konsolu",
      description: "Oyun konsolları",
      parentId: elektronik.id,
      isActive: true,
    },
  });

  // Araç (parent)
  const arac = await prisma.category.upsert({
    where: { slug: "arac" },
    update: {},
    create: {
      name: "Araç",
      slug: "arac",
      description: "Araçlar",
      isActive: true,
    },
  });

  // Araç > Otomobil
  const otomobil = await prisma.category.upsert({
    where: { slug: "otomobil" },
    update: {},
    create: {
      name: "Otomobil",
      slug: "otomobil",
      description: "Otomobiller",
      parentId: arac.id,
      isActive: true,
    },
  });

  // Araç > Motosiklet
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _motosiklet = await prisma.category.upsert({
    where: { slug: "motosiklet" },
    update: {},
    create: {
      name: "Motosiklet",
      slug: "motosiklet",
      description: "Motosikletler",
      parentId: arac.id,
      isActive: true,
    },
  });

  // Ev (parent)
  const ev = await prisma.category.upsert({
    where: { slug: "ev" },
    update: {},
    create: {
      name: "Ev",
      slug: "ev",
      description: "Ev eşyaları",
      isActive: true,
    },
  });

  // Ev > Mobilya
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _mobilya = await prisma.category.upsert({
    where: { slug: "mobilya" },
    update: {},
    create: {
      name: "Mobilya",
      slug: "mobilya",
      description: "Mobilya",
      parentId: ev.id,
      isActive: true,
    },
  });

  // Ev > Beyaz Eşya
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _beyazEsya = await prisma.category.upsert({
    where: { slug: "beyaz-esya" },
    update: {},
    create: {
      name: "Beyaz Eşya",
      slug: "beyaz-esya",
      description: "Beyaz eşyalar",
      parentId: ev.id,
      isActive: true,
    },
  });

  console.log("✅ Kategoriler oluşturuldu\n");

  // 3. Ürünleri oluştur
  console.log("📦 Ürünler oluşturuluyor...");

  const products = [
    // Telefon ürünleri
    {
      categoryId: telefon.id,
      name: "iPhone 15 Pro",
      slug: "iphone-15-pro",
      description: "Apple iPhone 15 Pro akıllı telefon",
      brand: "Apple",
      model: "iPhone 15 Pro",
    },
    {
      categoryId: telefon.id,
      name: "Samsung Galaxy S24",
      slug: "samsung-galaxy-s24",
      description: "Samsung Galaxy S24 akıllı telefon",
      brand: "Samsung",
      model: "Galaxy S24",
    },
    // Bilgisayar ürünleri
    {
      categoryId: bilgisayar.id,
      name: "MacBook Pro 16",
      slug: "macbook-pro-16",
      description: "Apple MacBook Pro 16 inç",
      brand: "Apple",
      model: "MacBook Pro 16",
    },
    {
      categoryId: bilgisayar.id,
      name: "Dell XPS 13",
      slug: "dell-xps-13",
      description: "Dell XPS 13 dizüstü",
      brand: "Dell",
      model: "XPS 13",
    },
    // Konsol ürünleri
    {
      categoryId: konsol.id,
      name: "PlayStation 5",
      slug: "playstation-5",
      description: "Sony PlayStation 5",
      brand: "Sony",
      model: "PS5",
    },
    // Otomobil ürünleri
    {
      categoryId: otomobil.id,
      name: "Honda Civic",
      slug: "honda-civic",
      description: "Honda Civic sedan",
      brand: "Honda",
      model: "Civic",
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        isActive: true,
      },
    });
  }

  console.log("✅ Ürünler oluşturuldu\n");

  console.log("✨ Seed başarıyla tamamlandı!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed hatası:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
