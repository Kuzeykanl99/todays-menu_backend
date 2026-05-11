import { db } from "../lib/db";
import { matchItemsFromMessage } from "../services/menuMatcher";
import * as dotenv from "dotenv";

dotenv.config();

const MONTHLY_MENU = [
  { date: "2026-05-01", items: "şehriyeli tavuksuyu çorba, etli maraş taze fasulye, çıtır kadayıflı kup, sebzeli bulgur pilavı" },
  { date: "2026-05-04", items: "ezogelin, döner, pirinç pilavı, meşrubat" },
  { date: "2026-05-05", items: "kuru fasulye, yayla, arpa şehriyeli pilav, mevsim salata" },
  { date: "2026-05-06", items: "karışık ızgara, anadolu, peynirli makarna, mevsim meyve" },
  { date: "2026-05-07", items: "mercimek, mantı, şakşuka, yoğurt, kadayıf" },
  { date: "2026-05-08", items: "köz domates, susamlı tavuk, tepsi börek, ayran" },
  { date: "2026-05-11", items: "şehriyeli bulgur, yoğurt çorbası, haşlama, mevsim salata" },
  { date: "2026-05-12", items: "mercimek, dolma, su böreği, yoğurt, baklava" },
  { date: "2026-05-13", items: "soslu makarna, ezogelin, inegöl, mevsim meyve" },
  { date: "2026-05-14", items: "tel şehriyeli pilav, köylü, karnıyarık, cacık" },
  { date: "2026-05-15", items: "arpa şehriye çorba, çökertme, pilav, yoğurt, komposto" },
  { date: "2026-05-18", items: "tel şehriyeli pilav, ezogelin, filiz kebap, sütlaç" },
  { date: "2026-05-19", items: "milföy, mercimek, ıspanak, yoğurt, meşrubat" },
  { date: "2026-05-20", items: "çıtır tavuk, soslu makarna, tarhana, ayran" },
  { date: "2026-05-21", items: "mantar, barbunya, sandal sefası, arpa şehriyeli pilav, kek, mevsim meyve" },
  { date: "2026-05-22", items: "şehriyeli bulgur, mahluta, soslu köfte, cacık" },
  { date: "2026-05-25", items: "yayla, türlü, arpa şehriyeli pilav, irmik" },
  { date: "2026-05-26", items: "ezogelin, orman kebabı, sebzeli bulgur, cacık" },
  { date: "2026-05-31", items: "kanat, soslu makarna, mercimek, ayran" },
];

async function uploadMonthlyMenu() {
  console.log("Uploading monthly menu...");

  const allFoods = await db.foodItem.findMany({ where: { isActive: true } });
  const saladBarItems = await db.foodItem.findMany({
    where: { isSaladBar: true, isActive: true }
  });

  for (const day of MONTHLY_MENU) {
    const matched = matchItemsFromMessage(day.items, allFoods);

    if (matched.length === 0) {
      console.log(`⚠️ No items matched for ${day.date}: ${day.items}`);
      continue;
    }

    const allItems = [...matched, ...saladBarItems];
    const dateOnly = new Date(day.date);

    await db.monthlyMenu.upsert({
      where: { date: dateOnly },
      update: { foodItemIds: allItems.map(f => f.id) },
      create: {
        date: dateOnly,
        foodItemIds: allItems.map(f => f.id),
      },
    });

    const names = matched.map(f => f.name).join(", ");
    console.log(`✅ ${day.date}: ${names}`);
  }

  console.log("Monthly menu uploaded successfully");
  await db.$disconnect();
}

uploadMonthlyMenu().catch(e => {
  console.error(e);
  db.$disconnect();
  process.exit(1);
});