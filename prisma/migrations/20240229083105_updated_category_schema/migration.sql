/*
  Warnings:

  - You are about to drop the column `category` on the `Cateogry` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Cateogry` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Cateogry_category_key";

-- AlterTable
ALTER TABLE "Cateogry" DROP COLUMN "category";

-- CreateIndex
CREATE UNIQUE INDEX "Cateogry_title_key" ON "Cateogry"("title");
