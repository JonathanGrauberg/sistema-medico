/*
  Warnings:

  - You are about to drop the column `contenido` on the `HistoriaClinica` table. All the data in the column will be lost.
  - Added the required column `diagnostico` to the `HistoriaClinica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motivo` to the `HistoriaClinica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tratamiento` to the `HistoriaClinica` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HistoriaClinica" DROP COLUMN "contenido",
ADD COLUMN     "diagnostico" TEXT NOT NULL,
ADD COLUMN     "motivo" TEXT NOT NULL,
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "tratamiento" TEXT NOT NULL;
