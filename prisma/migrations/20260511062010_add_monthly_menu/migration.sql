-- CreateTable
CREATE TABLE "monthly_menus" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "foodItemIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "monthly_menus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "monthly_menus_date_key" ON "monthly_menus"("date");
