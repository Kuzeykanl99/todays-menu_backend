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
  // split FIRST before removing punctuation
  const parts = message
    .split(/[,،\n]/)           // ← split on comma first
    .map((p) => p
      .toLowerCase()
      .trim()
      .replace(/[.!?]/g, "")  // ← remove punctuation but NOT comma
      .replace(/\s+/g, " ")
      .trim()
    )
    .filter(Boolean);

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
