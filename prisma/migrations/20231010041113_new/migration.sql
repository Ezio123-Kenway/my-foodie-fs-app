/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Addon` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `DisabledLocationMenu` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `MenuCategoryMenu` table. All the data in the column will be lost.
  - Added the required column `tableId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Addon" DROP COLUMN "imageUrl";

-- AlterTable
ALTER TABLE "DisabledLocationMenu" DROP COLUMN "isAvailable";

-- AlterTable
ALTER TABLE "MenuCategoryMenu" DROP COLUMN "isAvailable";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "tableId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
