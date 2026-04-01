-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MEDICO', 'SECRETARIA');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('ESTUDIO', 'INFORME');

-- CreateEnum
CREATE TYPE "TurnoEstado" AS ENUM ('PENDIENTE', 'CONFIRMADO', 'EN_SALA', 'ATENDIDO', 'CANCELADO');

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Archivo" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "FileType" NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Archivo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoriaClinica" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "medicoId" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoriaClinica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Turno" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "medicoId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "estado" "TurnoEstado" NOT NULL,
    "notasSecretaria" TEXT,
    "notasMedico" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Turno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preparacion" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,

    CONSTRAINT "Preparacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credencial" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Credencial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_tenantId_idx" ON "User"("tenantId");

-- CreateIndex
CREATE INDEX "Paciente_nombre_apellido_idx" ON "Paciente"("nombre", "apellido");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_tenantId_dni_key" ON "Paciente"("tenantId", "dni");

-- CreateIndex
CREATE INDEX "Archivo_pacienteId_idx" ON "Archivo"("pacienteId");

-- CreateIndex
CREATE INDEX "Archivo_tipo_idx" ON "Archivo"("tipo");

-- CreateIndex
CREATE INDEX "HistoriaClinica_pacienteId_idx" ON "HistoriaClinica"("pacienteId");

-- CreateIndex
CREATE INDEX "HistoriaClinica_medicoId_idx" ON "HistoriaClinica"("medicoId");

-- CreateIndex
CREATE INDEX "Turno_tenantId_idx" ON "Turno"("tenantId");

-- CreateIndex
CREATE INDEX "Turno_medicoId_fecha_idx" ON "Turno"("medicoId", "fecha");

-- CreateIndex
CREATE INDEX "Turno_pacienteId_idx" ON "Turno"("pacienteId");

-- CreateIndex
CREATE INDEX "Preparacion_tenantId_idx" ON "Preparacion"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Credencial_codigo_key" ON "Credencial"("codigo");

-- CreateIndex
CREATE INDEX "Credencial_pacienteId_idx" ON "Credencial"("pacienteId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Archivo" ADD CONSTRAINT "Archivo_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoriaClinica" ADD CONSTRAINT "HistoriaClinica_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoriaClinica" ADD CONSTRAINT "HistoriaClinica_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preparacion" ADD CONSTRAINT "Preparacion_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credencial" ADD CONSTRAINT "Credencial_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
