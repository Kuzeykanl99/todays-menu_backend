import { Router, Request, Response } from "express";
import { getTodaysMenu } from "../services/menuService";
import { registerToken } from "../services/notificationService";
import { db } from "../lib/db";

const router = Router();

// GET /api/menu/today
router.get("/today", async (req: Request, res: Response) => {
  try {
    const menu = await getTodaysMenu();
    if (!menu) {
      return res.status(404).json({
        error: "Bugün için menü henüz yayınlanmadı",
      });
    }
    res.json(menu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

router.get("/latest", async (req: Request, res: Response) => {
  try {
    const menu = await db.dailyMenu.findFirst({
      orderBy: { date: "desc" }, // ← most recent date first
    });

    if (!menu) {
      return res.status(404).json({ error: "Henüz menü yayınlanmadı" });
    }

    const items = await db.foodItem.findMany({
      where: { id: { in: menu.foodItemIds } },
    });

    const CATEGORY_ORDER = ["starter", "main", "dessert", "drink"];
    const CATEGORY_LABELS: Record<string, { title: string; emoji: string }> = {
      starter: { title: "Başlangıçlar", emoji: "🥗" },
      main: { title: "Ana Yemekler", emoji: "🍽️" },
      dessert: { title: "Tatlılar", emoji: "🍮" },
      drink: { title: "İçecekler", emoji: "🥤" },
    };

    const categories = CATEGORY_ORDER.map((cat) => ({
      id: cat,
      title: CATEGORY_LABELS[cat].title,
      emoji: CATEGORY_LABELS[cat].emoji,
      items: items
        .filter((i: any) => i.category === cat)
        .map((i: any) => ({
          id: i.id,
          name: i.name,
          description: i.description,
          calories: i.calories,
        })),
    })).filter((cat) => cat.items.length > 0);

    res.json({
      date: menu.date.toISOString(),
      restaurantName: "Özdisan",
      categories,
    });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// POST /api/tokens
router.post("/tokens", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: "Token gerekli" });
    }
    await registerToken(token);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

export default router;