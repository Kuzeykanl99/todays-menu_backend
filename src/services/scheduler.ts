import cron from "node-cron";
import { db } from "../lib/db";
import { notifyAllUsers } from "./notificationService";

export function startScheduler() {
  // runs every day at 08:00 Istanbul time (UTC+3 = 05:00 UTC)
  cron.schedule("15 10 * * *", async () => {
    console.log("⏰ Scheduler running — checking monthly menu...");
    await publishFromMonthlyMenu();
  }, {
    timezone: "Europe/Istanbul"
  });

  console.log("⏰ Scheduler started — publishes menu daily at 08:00");
}

export async function publishFromMonthlyMenu() {
  const today = new Date(new Date().toISOString().split("T")[0]);

  // find today in the monthly plan
  const monthlyEntry = await db.monthlyMenu.findUnique({
    where: { date: today }
  });

  if (!monthlyEntry) {
    console.log(`No monthly menu entry found for ${today.toISOString().split("T")[0]}`);
    return false;
  }

  // publish it as today's menu
  await db.dailyMenu.upsert({
    where: { date: today },
    update: {
      foodItemIds: monthlyEntry.foodItemIds,
      rawMessage: "auto-published from monthly menu",
      publishedAt: new Date(),
    },
    create: {
      date: today,
      foodItemIds: monthlyEntry.foodItemIds,
      rawMessage: "auto-published from monthly menu",
      publishedAt: new Date(),
    }
  });

  // notify all users
  await notifyAllUsers();

  console.log(`✅ Auto-published menu for ${today.toISOString().split("T")[0]}`);
  return true;
}