import { db } from "../lib/db";
import { matchItemsFromMessage } from "../services/menuMatcher";
import * as dotenv from "dotenv";

dotenv.config();

const MONTHLY_MENU = [
  { date: "2026-05-01", items: "tavuk, pilav, mercimek, baklava" },
  { date: "2026-05-02", items: "balık, bezelye, ezogelin, sütlaç" },
  { date: "2026-05-03", items: "köfte, makarna, mercimek, kazandibi" },
  { date: "2026-05-04", items: "köfte, makarna, mercimek, kazandibi" },
  { date: "2026-05-05", items: "köfte, makarna, mercimek, kazandibi" },
  { date: "2026-05-06", items: "köfte, makarna, mercimek, kazandibi" },
  { date: "2026-05-07", items: "köfte, makarna, mercimek, kazandibi" },
  { date: "2026-05-08", items: "köfte, makarna, mercimek, kazandibi" },
  { date: "2026-05-09", items: "köfte, makarna, mercimek, kazandibi" },
  { date: "2026-05-10", items: "köfte, makarna, mercimek, kazandibi" },
  { date: "2026-05-11", items: "ezogelin, çoban, pilav, baklava, ayran" },
  { date: "2026-05-12", items: "köfte, makarna, mercimek, kazandibi" },
  { date: "2026-05-13", items: "köfte, makarna, mercimek, kazandibi" },
  { date: "2026-05-14", items: "köfte, makarna, mercimek, kazandibi" },
  { date: "2026-05-15", items: "köfte, makarna, mercimek, kazandibi" },
  // add all days here
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