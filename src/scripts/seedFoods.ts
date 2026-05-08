import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();

const db = new PrismaClient();

async function seed() {
  console.log("Seeding food items...");

  await db.foodItem.deleteMany();

  await db.foodItem.createMany({
    data: [
      // STARTERS
      {
        name: "Mercimek Çorbası",
        description: "Geleneksel Türk mutfağından kırmızı mercimek çorbası, limon ve kruton eşliğinde",
        calories: 180,
        category: "starter",
        keywords: ["mercimek", "çorba", "mercimek çorbası"],
        isSaladBar: false,
      },
      {
        name: "Ezogelin Çorbası",
        description: "Bulgur, kırmızı mercimek ve baharatlarla hazırlanmış besleyici çorba",
        calories: 195,
        category: "starter",
        keywords: ["ezogelin", "ezogelin çorbası"],
        isSaladBar: false,
      },
      {
        name: "Sigara Böreği",
        description: "Beyaz peynir ve maydanoz harmanıyla hazırlanmış çıtır hamur böreği",
        calories: 240,
        category: "starter",
        keywords: ["börek", "sigara böreği", "sigara"],
        isSaladBar: false,
      },
      // MAINS
      {
        name: "Izgara Tavuk",
        description: "Marine edilmiş tavuk göğsü, közlenmiş sebzeler ve pilav eşliğinde ızgarada pişirilmiş",
        calories: 420,
        category: "main",
        keywords: ["tavuk", "izgara tavuk", "tavuk göğsü"],
        isSaladBar: false,
      },
      {
        name: "Pilav",
        description: "Tereyağlı buharda pişirilmiş Türk pilavı",
        calories: 280,
        category: "main",
        keywords: ["pilav", "pirinç", "pirinç pilavı"],
        isSaladBar: false,
      },
      {
        name: "Bezelye Yemeği",
        description: "Havuç ve domates sosuyla yavaş pişirilmiş ev usulü bezelye yemeği",
        calories: 310,
        category: "main",
        keywords: ["bezelye", "bezelye yemeği"],
        isSaladBar: false,
      },
      {
        name: "Kuru Fasulye",
        description: "Geleneksel Türk usulü domates soslu kuru fasulye",
        calories: 340,
        category: "main",
        keywords: ["fasulye", "kuru fasulye"],
        isSaladBar: false,
      },
      {
        name: "Fettuccine Alfredo",
        description: "Kremalı parmesan sosuyla hazırlanmış fettuccine makarna",
        calories: 580,
        category: "main",
        keywords: ["makarna", "fettuccine", "alfredo"],
        isSaladBar: false,
      },
      {
        name: "Balık Izgara",
        description: "Limonlu tereyağı sosu ve mevsim yeşillikleriyle servis edilen ızgara levrek",
        calories: 390,
        category: "main",
        keywords: ["balık", "levrek", "izgara balık"],
        isSaladBar: false,
      },
      // DESSERTS
      {
        name: "Sütlaç",
        description: "Fırında pişirilmiş geleneksel Türk sütlacı, tarçın ile servis edilir",
        calories: 280,
        category: "dessert",
        keywords: ["sütlaç", "sutlac"],
        isSaladBar: false,
      },
      {
        name: "Baklava",
        description: "Antep fıstığı ve bal şerbetiyle hazırlanmış ince katlı Türk baklavası",
        calories: 380,
        category: "dessert",
        keywords: ["baklava"],
        isSaladBar: false,
      },
      {
        name: "Kazandibi",
        description: "Karamelize taban ile hazırlanmış geleneksel Türk sütlü tatlısı",
        calories: 310,
        category: "dessert",
        keywords: ["kazandibi", "kazan dibi"],
        isSaladBar: false,
      },
      // DRINKS
      {
        name: "Ayran",
        description: "Günlük taze yoğurttan yapılan soğuk servis edilen geleneksel Türk içeceği",
        calories: 60,
        category: "drink",
        keywords: ["ayran"],
        isSaladBar: false,
      },
      {
        name: "Limonata",
        description: "Taze sıkılmış limon ve nane ile hazırlanmış ev yapımı limonata",
        calories: 80,
        category: "drink",
        keywords: ["limonata", "limon"],
        isSaladBar: false,
      },
      {
        name: "Çay",
        description: "Doğu Karadeniz'in seçkin yapraklarından demlenmiş Türk çayı",
        calories: 5,
        category: "drink",
        keywords: ["çay", "tea"],
        isSaladBar: false,
      },
      // SALAD BAR — always included
      {
        name: "Çoban Salatası",
        description: "Domates, salatalık, biber ve maydanozdan oluşan taze Türk salatası",
        calories: 65,
        category: "starter",
        keywords: ["çoban", "çoban salatası"],
        isSaladBar: true,
      },
      {
        name: "Mevsim Salatası",
        description: "Taze mevsim yeşillikleri, kiraz domates ve balzamik sos ile hazırlanmış hafif salata",
        calories: 95,
        category: "starter",
        keywords: ["mevsim", "mevsim salatası"],
        isSaladBar: true,
      },
      {
        name: "Turşu",
        description: "Geleneksel yöntemlerle hazırlanmış karışık sebze turşusu",
        calories: 25,
        category: "starter",
        keywords: ["turşu"],
        isSaladBar: true,
      },
    ],
  });

  console.log("✅ Seeded successfully");
  await db.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  db.$disconnect();
  process.exit(1);
});