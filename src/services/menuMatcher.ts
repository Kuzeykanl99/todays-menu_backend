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
  const normalized = message
    .toLowerCase()
    .trim()
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ");

  const parts = normalized
    .split(/[,\n]/)
    .map((p) => p.trim())
    .filter(Boolean);

  console.log("Message:", message);
  console.log("Parts:", parts);

  const matched: FoodItem[] = [];
  const matchedIds = new Set<string>();

  for (const part of parts) {
    console.log("Checking part:", part);
    for (const food of allFoods) {
      if (matchedIds.has(food.id)) continue;
      if (food.isSaladBar) continue;

      const isMatch = food.keywords.some(
        (keyword) =>
          part.includes(keyword.toLowerCase()) ||
          keyword.toLowerCase().includes(part)
      );

      if (isMatch) {
        console.log("Matched:", food.name);
        matched.push(food);
        matchedIds.add(food.id);
        break;
      }
    }
  }

  console.log("Total matched:", matched.length);
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
