import { Router, Request, Response } from "express";
import { getTodaysMenu } from "../services/menuService";
import { registerToken } from "../services/notificationService";

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