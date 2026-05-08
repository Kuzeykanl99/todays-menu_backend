-- CreateEnum
CREATE TYPE "Category" AS ENUM ('starter', 'main', 'dessert', 'drink');

-- CreateTable
CREATE TABLE "food_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,
    "category" "Category" NOT NULL,
    "keywords" TEXT[],
    "isSaladBar" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "food_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_menus" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "foodItemIds" TEXT[],
    "rawMessage" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "device_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_menus_date_key" ON "daily_menus"("date");

-- CreateIndex
CREATE UNIQUE INDEX "device_tokens_token_key" ON "device_tokens"("token");
