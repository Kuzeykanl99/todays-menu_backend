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

export function matchItemsFromMessage(
  message: string,
  allFoods: FoodItem[]
): FoodItem[] {
  const parts = message
    .split(/[,،\n]/)
    .map((p) => p.toLowerCase().trim().replace(/[.!?]/g, "").replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const matched: FoodItem[] = [];
  const matchedIds = new Set<string>();

  for (const part of parts) {
    // ← sort by longest keyword first — prevents partial matches winning
    const sortedFoods = [...allFoods]
      .filter(f => !f.isSaladBar && !matchedIds.has(f.id))
      .sort((a, b) => {
        const aMax = Math.max(...a.keywords.map(k => k.length));
        const bMax = Math.max(...b.keywords.map(k => k.length));
        return bMax - aMax; // longest keyword first
      });

    for (const food of sortedFoods) {
      const isMatch = food.keywords.some(
        (keyword) =>
          part.includes(keyword.toLowerCase()) ||
          keyword.toLowerCase().includes(part)
      );

      if (isMatch) {
        matched.push(food);
        matchedIds.add(food.id);
        break;
      }
    }
  }

  return matched;
}

export function getUnmatchedParts(
  message: string,
  matched: FoodItem[]
): string[] {
  const normalized = message.toLowerCase().trim();
  const parts = normalized
    .split(/[,\n]/)
    .map((p) => p.trim())
    .filter(Boolean);

  return parts.filter(
    (part) =>
      !matched.some((food) =>
        food.keywords.some(
          (k) =>
            part.includes(k.toLowerCase()) ||
            k.toLowerCase().includes(part)
        )
      )
  );
}
