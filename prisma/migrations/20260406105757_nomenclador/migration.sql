-- AlterTable
ALTER TABLE "Turno" ADD COLUMN     "ordenLlegada" INTEGER;

-- CreateTable
CREATE TABLE "Nomenclador" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "detalle" TEXT NOT NULL,

    CONSTRAINT "Nomenclador_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Nomenclador_codigo_idx" ON "Nomenclador"("codigo");
