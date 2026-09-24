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

  // 2. Kategorileri oluştur
  console.log("🏷️ Kategoriler oluşturuluyor...");

  // Elektronik
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

  // Araç
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

  const motosiklet = await prisma.category.upsert({
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

  // Ev
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

  const mobilya = await prisma.category.upsert({
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

  const beyazEsya = await prisma.category.upsert({
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
    // =========================
    // TELEFON
    // =========================
    {
      categoryId: telefon.id,
      name: "iPhone 15",
      slug: "iphone-15",
      description: "Apple iPhone 15 akıllı telefon",
      brand: "Apple",
      model: "iPhone 15",
    },
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
      name: "iPhone 15 Pro Max",
      slug: "iphone-15-pro-max",
      description: "Apple iPhone 15 Pro Max akıllı telefon",
      brand: "Apple",
      model: "iPhone 15 Pro Max",
    },
    {
      categoryId: telefon.id,
      name: "iPhone 16",
      slug: "iphone-16",
      description: "Apple iPhone 16 akıllı telefon",
      brand: "Apple",
      model: "iPhone 16",
    },
    {
      categoryId: telefon.id,
      name: "iPhone 16 Pro",
      slug: "iphone-16-pro",
      description: "Apple iPhone 16 Pro akıllı telefon",
      brand: "Apple",
      model: "iPhone 16 Pro",
    },
    {
      categoryId: telefon.id,
      name: "iPhone 16 Pro Max",
      slug: "iphone-16-pro-max",
      description: "Apple iPhone 16 Pro Max akıllı telefon",
      brand: "Apple",
      model: "iPhone 16 Pro Max",
    },
    {
      categoryId: telefon.id,
      name: "Samsung Galaxy S23",
      slug: "samsung-galaxy-s23",
      description: "Samsung Galaxy S23 akıllı telefon",
      brand: "Samsung",
      model: "Galaxy S23",
    },
    {
      categoryId: telefon.id,
      name: "Samsung Galaxy S24",
      slug: "samsung-galaxy-s24",
      description: "Samsung Galaxy S24 akıllı telefon",
      brand: "Samsung",
      model: "Galaxy S24",
    },
    {
      categoryId: telefon.id,
      name: "Samsung Galaxy S24 Ultra",
      slug: "samsung-galaxy-s24-ultra",
      description: "Samsung Galaxy S24 Ultra akıllı telefon",
      brand: "Samsung",
      model: "Galaxy S24 Ultra",
    },
    {
      categoryId: telefon.id,
      name: "Samsung Galaxy S25",
      slug: "samsung-galaxy-s25",
      description: "Samsung Galaxy S25 akıllı telefon",
      brand: "Samsung",
      model: "Galaxy S25",
    },
    {
      categoryId: telefon.id,
      name: "Samsung Galaxy A55",
      slug: "samsung-galaxy-a55",
      description: "Samsung Galaxy A55 akıllı telefon",
      brand: "Samsung",
      model: "Galaxy A55",
    },
    {
      categoryId: telefon.id,
      name: "Xiaomi Redmi Note 13 Pro",
      slug: "xiaomi-redmi-note-13-pro",
      description: "Xiaomi Redmi Note 13 Pro akıllı telefon",
      brand: "Xiaomi",
      model: "Redmi Note 13 Pro",
    },
    {
      categoryId: telefon.id,
      name: "Xiaomi Redmi Note 14 Pro",
      slug: "xiaomi-redmi-note-14-pro",
      description: "Xiaomi Redmi Note 14 Pro akıllı telefon",
      brand: "Xiaomi",
      model: "Redmi Note 14 Pro",
    },
    {
      categoryId: telefon.id,
      name: "Xiaomi 14",
      slug: "xiaomi-14",
      description: "Xiaomi 14 akıllı telefon",
      brand: "Xiaomi",
      model: "Xiaomi 14",
    },
    {
      categoryId: telefon.id,
      name: "Google Pixel 9",
      slug: "google-pixel-9",
      description: "Google Pixel 9 akıllı telefon",
      brand: "Google",
      model: "Pixel 9",
    },

    // =========================
    // BİLGİSAYAR
    // =========================
    {
      categoryId: bilgisayar.id,
      name: "MacBook Air M2",
      slug: "macbook-air-m2",
      description: "Apple MacBook Air M2",
      brand: "Apple",
      model: "MacBook Air M2",
    },
    {
      categoryId: bilgisayar.id,
      name: "MacBook Air M3",
      slug: "macbook-air-m3",
      description: "Apple MacBook Air M3",
      brand: "Apple",
      model: "MacBook Air M3",
    },
    {
      categoryId: bilgisayar.id,
      name: "MacBook Pro 14",
      slug: "macbook-pro-14",
      description: "Apple MacBook Pro 14",
      brand: "Apple",
      model: "MacBook Pro 14",
    },
    {
      categoryId: bilgisayar.id,
      name: "MacBook Pro 16",
      slug: "macbook-pro-16",
      description: "Apple MacBook Pro 16",
      brand: "Apple",
      model: "MacBook Pro 16",
    },
    {
      categoryId: bilgisayar.id,
      name: "Dell XPS 13",
      slug: "dell-xps-13",
      description: "Dell XPS 13 dizüstü bilgisayar",
      brand: "Dell",
      model: "XPS 13",
    },
    {
      categoryId: bilgisayar.id,
      name: "Lenovo Legion 5",
      slug: "lenovo-legion-5",
      description: "Lenovo Legion 5 oyuncu bilgisayarı",
      brand: "Lenovo",
      model: "Legion 5",
    },
    {
      categoryId: bilgisayar.id,
      name: "Lenovo IdeaPad 3",
      slug: "lenovo-ideapad-3",
      description: "Lenovo IdeaPad 3 dizüstü bilgisayar",
      brand: "Lenovo",
      model: "IdeaPad 3",
    },
    {
      categoryId: bilgisayar.id,
      name: "ASUS TUF Gaming",
      slug: "asus-tuf-gaming",
      description: "ASUS TUF Gaming oyuncu bilgisayarı",
      brand: "ASUS",
      model: "TUF Gaming",
    },
    {
      categoryId: bilgisayar.id,
      name: "ASUS ROG Strix",
      slug: "asus-rog-strix",
      description: "ASUS ROG Strix oyuncu bilgisayarı",
      brand: "ASUS",
      model: "ROG Strix",
    },
    {
      categoryId: bilgisayar.id,
      name: "MSI Katana",
      slug: "msi-katana",
      description: "MSI Katana oyuncu bilgisayarı",
      brand: "MSI",
      model: "Katana",
    },
    {
      categoryId: bilgisayar.id,
      name: "HP Victus",
      slug: "hp-victus",
      description: "HP Victus oyuncu bilgisayarı",
      brand: "HP",
      model: "Victus",
    },
    {
      categoryId: bilgisayar.id,
      name: "Acer Nitro 5",
      slug: "acer-nitro-5",
      description: "Acer Nitro 5 oyuncu bilgisayarı",
      brand: "Acer",
      model: "Nitro 5",
    },

    // =========================
    // OYUN KONSOLU
    // =========================
    {
      categoryId: konsol.id,
      name: "PlayStation 5",
      slug: "playstation-5",
      description: "Sony PlayStation 5",
      brand: "Sony",
      model: "PS5",
    },
    {
      categoryId: konsol.id,
      name: "PlayStation 5 Slim",
      slug: "playstation-5-slim",
      description: "Sony PlayStation 5 Slim",
      brand: "Sony",
      model: "PS5 Slim",
    },
    {
      categoryId: konsol.id,
      name: "PlayStation 5 Digital Edition",
      slug: "playstation-5-digital-edition",
      description: "Sony PlayStation 5 Digital Edition",
      brand: "Sony",
      model: "PS5 Digital Edition",
    },
    {
      categoryId: konsol.id,
      name: "PlayStation 4",
      slug: "playstation-4",
      description: "Sony PlayStation 4",
      brand: "Sony",
      model: "PS4",
    },
    {
      categoryId: konsol.id,
      name: "PlayStation 4 Pro",
      slug: "playstation-4-pro",
      description: "Sony PlayStation 4 Pro",
      brand: "Sony",
      model: "PS4 Pro",
    },
    {
      categoryId: konsol.id,
      name: "Xbox Series X",
      slug: "xbox-series-x",
      description: "Microsoft Xbox Series X",
      brand: "Microsoft",
      model: "Xbox Series X",
    },
    {
      categoryId: konsol.id,
      name: "Xbox Series S",
      slug: "xbox-series-s",
      description: "Microsoft Xbox Series S",
      brand: "Microsoft",
      model: "Xbox Series S",
    },
    {
      categoryId: konsol.id,
      name: "Xbox One",
      slug: "xbox-one",
      description: "Microsoft Xbox One",
      brand: "Microsoft",
      model: "Xbox One",
    },
    {
      categoryId: konsol.id,
      name: "Nintendo Switch",
      slug: "nintendo-switch",
      description: "Nintendo Switch oyun konsolu",
      brand: "Nintendo",
      model: "Switch",
    },
    {
      categoryId: konsol.id,
      name: "Nintendo Switch OLED",
      slug: "nintendo-switch-oled",
      description: "Nintendo Switch OLED",
      brand: "Nintendo",
      model: "Switch OLED",
    },

    // =========================
    // OTOMOBİL
    // =========================
    {
      categoryId: otomobil.id,
      name: "Honda Civic",
      slug: "honda-civic",
      description: "Honda Civic sedan",
      brand: "Honda",
      model: "Civic",
    },
    {
      categoryId: otomobil.id,
      name: "Toyota Corolla",
      slug: "toyota-corolla",
      description: "Toyota Corolla",
      brand: "Toyota",
      model: "Corolla",
    },
    {
      categoryId: otomobil.id,
      name: "Renault Clio",
      slug: "renault-clio",
      description: "Renault Clio",
      brand: "Renault",
      model: "Clio",
    },
    {
      categoryId: otomobil.id,
      name: "Renault Megane",
      slug: "renault-megane",
      description: "Renault Megane",
      brand: "Renault",
      model: "Megane",
    },
    {
      categoryId: otomobil.id,
      name: "Fiat Egea",
      slug: "fiat-egea",
      description: "Fiat Egea",
      brand: "Fiat",
      model: "Egea",
    },
    {
      categoryId: otomobil.id,
      name: "Fiat Doblo",
      slug: "fiat-doblo",
      description: "Fiat Doblo",
      brand: "Fiat",
      model: "Doblo",
    },
    {
      categoryId: otomobil.id,
      name: "Volkswagen Golf",
      slug: "volkswagen-golf",
      description: "Volkswagen Golf",
      brand: "Volkswagen",
      model: "Golf",
    },
    {
      categoryId: otomobil.id,
      name: "Volkswagen Passat",
      slug: "volkswagen-passat",
      description: "Volkswagen Passat",
      brand: "Volkswagen",
      model: "Passat",
    },
    {
      categoryId: otomobil.id,
      name: "Volkswagen Polo",
      slug: "volkswagen-polo",
      description: "Volkswagen Polo",
      brand: "Volkswagen",
      model: "Polo",
    },
    {
      categoryId: otomobil.id,
      name: "Ford Focus",
      slug: "ford-focus",
      description: "Ford Focus",
      brand: "Ford",
      model: "Focus",
    },
    {
      categoryId: otomobil.id,
      name: "Ford Fiesta",
      slug: "ford-fiesta",
      description: "Ford Fiesta",
      brand: "Ford",
      model: "Fiesta",
    },
    {
      categoryId: otomobil.id,
      name: "BMW 3 Serisi",
      slug: "bmw-3-serisi",
      description: "BMW 3 Serisi",
      brand: "BMW",
      model: "3 Serisi",
    },
    {
      categoryId: otomobil.id,
      name: "Mercedes-Benz C Serisi",
      slug: "mercedes-benz-c-serisi",
      description: "Mercedes-Benz C Serisi",
      brand: "Mercedes-Benz",
      model: "C Serisi",
    },
    {
      categoryId: otomobil.id,
      name: "Audi A3",
      slug: "audi-a3",
      description: "Audi A3",
      brand: "Audi",
      model: "A3",
    },

    // =========================
    // MOTOSİKLET
    // =========================
    {
      categoryId: motosiklet.id,
      name: "Honda PCX",
      slug: "honda-pcx",
      description: "Honda PCX motosiklet",
      brand: "Honda",
      model: "PCX",
    },
    {
      categoryId: motosiklet.id,
      name: "Honda CB 125 F",
      slug: "honda-cb-125-f",
      description: "Honda CB 125 F motosiklet",
      brand: "Honda",
      model: "CB 125 F",
    },
    {
      categoryId: motosiklet.id,
      name: "Honda CBR 250R",
      slug: "honda-cbr-250r",
      description: "Honda CBR 250R motosiklet",
      brand: "Honda",
      model: "CBR 250R",
    },
    {
      categoryId: motosiklet.id,
      name: "Yamaha YZF R25",
      slug: "yamaha-yzf-r25",
      description: "Yamaha YZF R25 motosiklet",
      brand: "Yamaha",
      model: "YZF R25",
    },
    {
      categoryId: motosiklet.id,
      name: "Yamaha MT-25",
      slug: "yamaha-mt-25",
      description: "Yamaha MT-25 motosiklet",
      brand: "Yamaha",
      model: "MT-25",
    },
    {
      categoryId: motosiklet.id,
      name: "Yamaha MT-07",
      slug: "yamaha-mt-07",
      description: "Yamaha MT-07 motosiklet",
      brand: "Yamaha",
      model: "MT-07",
    },
    {
      categoryId: motosiklet.id,
      name: "Kawasaki Ninja 400",
      slug: "kawasaki-ninja-400",
      description: "Kawasaki Ninja 400 motosiklet",
      brand: "Kawasaki",
      model: "Ninja 400",
    },
    {
      categoryId: motosiklet.id,
      name: "Kawasaki Ninja 250",
      slug: "kawasaki-ninja-250",
      description: "Kawasaki Ninja 250 motosiklet",
      brand: "Kawasaki",
      model: "Ninja 250",
    },
    {
      categoryId: motosiklet.id,
      name: "Bajaj Pulsar NS200",
      slug: "bajaj-pulsar-ns200",
      description: "Bajaj Pulsar NS200 motosiklet",
      brand: "Bajaj",
      model: "Pulsar NS200",
    },
    {
      categoryId: motosiklet.id,
      name: "KTM Duke 390",
      slug: "ktm-duke-390",
      description: "KTM Duke 390 motosiklet",
      brand: "KTM",
      model: "Duke 390",
    },

    // =========================
    // MOBİLYA
    // =========================
    {
      categoryId: mobilya.id,
      name: "Koltuk Takımı",
      slug: "koltuk-takimi",
      description: "Salon koltuk takımı",
      brand: "Genel",
      model: "Koltuk Takımı",
    },
    {
      categoryId: mobilya.id,
      name: "L Koltuk",
      slug: "l-koltuk",
      description: "L tipi koltuk",
      brand: "Genel",
      model: "L Koltuk",
    },
    {
      categoryId: mobilya.id,
      name: "Yemek Masası",
      slug: "yemek-masasi",
      description: "Yemek masası",
      brand: "Genel",
      model: "Yemek Masası",
    },
    {
      categoryId: mobilya.id,
      name: "Gardırop",
      slug: "gardrop",
      description: "Gardırop",
      brand: "Genel",
      model: "Gardırop",
    },
    {
      categoryId: mobilya.id,
      name: "Çalışma Masası",
      slug: "calisma-masasi",
      description: "Çalışma masası",
      brand: "Genel",
      model: "Çalışma Masası",
    },
    {
      categoryId: mobilya.id,
      name: "Oyuncu Koltuğu",
      slug: "oyuncu-koltugu",
      description: "Oyuncu koltuğu",
      brand: "Genel",
      model: "Oyuncu Koltuğu",
    },

    // =========================
    // BEYAZ EŞYA
    // =========================
    {
      categoryId: beyazEsya.id,
      name: "Buzdolabı",
      slug: "buzdolabi",
      description: "Buzdolabı",
      brand: "Genel",
      model: "Buzdolabı",
    },
    {
      categoryId: beyazEsya.id,
      name: "Çamaşır Makinesi",
      slug: "camasir-makinesi",
      description: "Çamaşır makinesi",
      brand: "Genel",
      model: "Çamaşır Makinesi",
    },
    {
      categoryId: beyazEsya.id,
      name: "Bulaşık Makinesi",
      slug: "bulasik-makinesi",
      description: "Bulaşık makinesi",
      brand: "Genel",
      model: "Bulaşık Makinesi",
    },
    {
      categoryId: beyazEsya.id,
      name: "Kurutma Makinesi",
      slug: "kurutma-makinesi",
      description: "Kurutma makinesi",
      brand: "Genel",
      model: "Kurutma Makinesi",
    },
    {
      categoryId: beyazEsya.id,
      name: "Fırın",
      slug: "firin",
      description: "Ankastre veya solo fırın",
      brand: "Genel",
      model: "Fırın",
    },
    {
      categoryId: beyazEsya.id,
      name: "Televizyon",
      slug: "televizyon",
      description: "Televizyon",
      brand: "Genel",
      model: "Televizyon",
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

  console.log(`✅ ${products.length} ürün oluşturuldu\n`);
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