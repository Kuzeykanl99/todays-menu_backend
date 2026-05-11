import TelegramBot from "node-telegram-bot-api";
import { db } from "../lib/db";
import { matchItemsFromMessage, getUnmatchedParts } from "./menuMatcher";
import { publishMenu } from "./menuService";
import { notifyAllUsers } from "./notificationService";
import { publishFromMonthlyMenu } from "./scheduler";

export function startBot() {
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
    polling: true,
  });

  const MANAGER_CHAT_ID = process.env.MANAGER_CHAT_ID!;

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id.toString();

    if (chatId !== MANAGER_CHAT_ID) {
      bot.sendMessage(chatId, "Bu bot sadece yetkili kullanıcılar içindir.");
      return;
    }

    const text = msg.text?.trim();
    if (!text) return;

    if (text === "/publish") {
      const published = await publishFromMonthlyMenu();
      if (published) {
        bot.sendMessage(chatId, "✅ Aylık menüden bugünün menüsü yayınlandı.");
      } else {
        bot.sendMessage(chatId, "⚠️ Bugün için aylık menüde kayıt bulunamadı veya menü zaten yayınlandı.");
      }
      return;
    }

    if (text === "/start" || text === "/menu") {
      bot.sendMessage(
        chatId,
        "Merhaba! Bugünün menüsünü gönderin.\n\nÖrnek:\ntavuk, pilav, mercimek çorbası, baklava\n\nYa da her satıra bir yemek yazabilirsiniz:\ntavuk\npilav\nmercimek"
      );
      return;
    }

    if (text === "/today") {
      const today = new Date(new Date().toISOString().split("T")[0]);
      const menu = await db.dailyMenu.findUnique({
        where: { date: today },
      });
      if (!menu) {
        bot.sendMessage(chatId, "Bugün için henüz menü yayınlanmadı.");
      } else {
        const items = await db.foodItem.findMany({
          where: { id: { in: menu.foodItemIds } },
        });
        const list = items
          .map((item: { name: string }) => `• ${item.name}`)
          .join("\n");
        bot.sendMessage(chatId, `Bugünün menüsü:\n\n${list}`);
      }
      return;
    }

    try {
      await bot.sendMessage(chatId, "⏳ Menü işleniyor...");

      const allFoods = await db.foodItem.findMany({
        where: { isActive: true },
      });

      const matched = matchItemsFromMessage(text, allFoods);
      const unmatched = getUnmatchedParts(text, matched);

      if (matched.length === 0) {
        await bot.sendMessage(
          chatId,
          "❌ Hiçbir yemek tanınamadı. Lütfen tekrar deneyin.\n\nÖrnek: tavuk, pilav, mercimek"
        );
        return;
      }

      const saladBarItems = await db.foodItem.findMany({
        where: { isSaladBar: true, isActive: true },
      });

      const allItems = [...matched, ...saladBarItems];

      await publishMenu({
        date: new Date(),
        foodItemIds: allItems.map((f: { id: string }) => f.id),
        rawMessage: text,
      });

      await notifyAllUsers();

      const matchedList = matched
        .map((f: { name: string }) => `✅ ${f.name}`)
        .join("\n");
      const saladList = saladBarItems
        .map((f: { name: string }) => `🥗 ${f.name} (sabit)`)
        .join("\n");
      const unmatchedWarning =
        unmatched.length > 0
          ? `\n\n⚠️ Tanınamayan kelimeler: ${unmatched.join(", ")}`
          : "";

      await bot.sendMessage(
        chatId,
        `✅ Menü yayınlandı!\n\n${matchedList}\n${saladList}${unmatchedWarning}\n\n📱 Kullanıcılara bildirim gönderildi.`
      );
    } catch (error) {
      console.error(error);
      await bot.sendMessage(
        chatId,
        "❌ Bir hata oluştu. Lütfen tekrar deneyin."
      );
    }
  });

  console.log("🤖 Telegram bot started");
  return bot;
}