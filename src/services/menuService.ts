import { db } from "../lib/db";

const CATEGORY_ORDER = ["starter", "main", "dessert", "drink"];

const CATEGORY_LABELS: Record<string, { title: string; emoji: string }> = {
  starter: { title: "Başlangıçlar", emoji: "🥗" },
  main: { title: "Ana Yemekler", emoji: "🍽️" },
  dessert: { title: "Tatlılar", emoji: "🍮" },
  drink: { title: "İçecekler", emoji: "🥤" },
};

type FoodItem = {
  id: string;
  name: string;
  description: string;
  calories: number;
  category: string;
  keywords: string[];
  isSaladBar: boolean;
  isActive: boolean;
  createdAt: Date;
};

export async function publishMenu({
  date,
  foodItemIds,
  rawMessage,
}: {
  date: Date;
  foodItemIds: string[];
  rawMessage: string;
}) {
  const dateOnly = new Date(date.toISOString().split("T")[0]);

  await db.dailyMenu.upsert({
    where: { date: dateOnly },
    update: {
      foodItemIds,
      rawMessage,
      publishedAt: new Date(),
    },
    create: {
      date: dateOnly,
      foodItemIds,
      rawMessage,
      publishedAt: new Date(),
    },
  });
}

export async function getTodaysMenu() {
  const today = new Date(new Date().toISOString().split("T")[0]);

  const menu = await db.dailyMenu.findUnique({
    where: { date: today },
  });

  if (!menu) return null;

  const items: FoodItem[] = await db.foodItem.findMany({
    where: { id: { in: menu.foodItemIds } },
  });

  const categories = CATEGORY_ORDER.map((cat: string) => ({
    id: cat,
    title: CATEGORY_LABELS[cat].title,
    emoji: CATEGORY_LABELS[cat].emoji,
    items: items
      .filter((item: FoodItem) => item.category === cat)
      .map((item: FoodItem) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        calories: item.calories,
      })),
  })).filter((cat: { items: unknown[] }) => cat.items.length > 0);

  return {
    date: menu.date.toISOString(),
    restaurantName: "Lezzet Mutfağı",
    categories,
  };
}