import * as XLSX from "xlsx"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const workbook = XLSX.readFile("./Nomenclador sistema medico.xlsx")
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]

  const rows: any[] = XLSX.utils.sheet_to_json(sheet)

  console.log("Filas encontradas:", rows.length)

  const data = rows.map((row) => ({
    codigo: String(row.CODIGO || row.codigo || "").trim(),
    practica: String(row.PRACTICA || row.practica || "").trim()
  }))

  // limpiar vacíos
  const clean = data.filter(
    (d) => d.codigo.length > 0 && d.practica.length > 0
  )

  console.log("Filas limpias:", clean.length)

  // 🔥 BORRAR TODO (opcional)
  await prisma.nomenclador.deleteMany()

  // 🔥 INSERTAR
  await prisma.nomenclador.createMany({
    data: clean,
    skipDuplicates: true
  })

  console.log("✅ Importación completa")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())