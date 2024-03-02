/*
  Warnings:

  - A unique constraint covering the columns `[category]` on the table `Cateogry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cateogry_category_key" ON "Cateogry"("category");
