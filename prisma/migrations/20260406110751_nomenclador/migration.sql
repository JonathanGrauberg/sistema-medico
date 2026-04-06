/*
  Warnings:

  - You are about to drop the column `detalle` on the `Nomenclador` table. All the data in the column will be lost.
  - Added the required column `practica` to the `Nomenclador` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Nomenclador_codigo_idx";

-- AlterTable
ALTER TABLE "Nomenclador" DROP COLUMN "detalle",
ADD COLUMN     "practica" TEXT NOT NULL;
