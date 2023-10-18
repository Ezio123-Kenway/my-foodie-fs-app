/*
  Warnings:

  - Added the required column `assetUrl` to the `Table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Table" ADD COLUMN     "assetUrl" TEXT NOT NULL;
