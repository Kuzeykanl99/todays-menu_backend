import { db } from "../lib/db";

export async function notifyAllUsers() {
  const tokens = await db.deviceToken.findMany();
  if (tokens.length === 0) {
    console.log("No device tokens found — skipping notifications");
    return;
  }

  const messages = tokens.map((t: { token: string }) => ({
    to: t.token,
    sound: "default",
    title: "🍽️ Bugünün Menüsü Hazır!",
    body: "Öğle yemeği menüsü güncellendi. Hemen inceleyin.",
    data: { date: new Date().toISOString().split("T")[0] },
    channelId: "menu-updates",  // ← add this
    priority: "high",           // ← add this
    ttl: 0,                     // ← deliver immediately
  }));

  // batch into groups of 100 — Expo's limit per request
  for (let i = 0; i < messages.length; i += 100) {
    const batch = messages.slice(i, i + 100);
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(batch),
    });
    const result = await response.json();
    console.log("Push result:", JSON.stringify(result));
  }

  console.log(`✅ Notifications sent to ${tokens.length} devices`);
}

export async function registerToken(token: string) {
  await db.deviceToken.upsert({
    where: { token },
    update: {},
    create: { token },
  });
}