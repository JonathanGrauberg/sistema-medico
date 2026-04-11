import "dotenv/config"
import * as XLSX from "xlsx"
import { prisma } from "../lib/prisma"

console.log("SCRIPT DB:", process.env.DATABASE_URL)

async function main() {
  const workbook = XLSX.readFile("data/nomenclador.xlsx")
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]

  const data: any[] = XLSX.utils.sheet_to_json(sheet)

  console.log("Filas encontradas:", data.length)

  // 🔥 limpiar tabla antes
  await prisma.nomenclador.deleteMany()

  for (const row of data) {
    // 🔥 COLUMNAS REALES DEL EXCEL
    const codigo = String(row["Código"] || "").trim()
    const practica = String(row["Detalle Prestación"] || "").trim()

    // DEBUG (podés dejarlo o sacarlo después)
    console.log("FILA PROCESADA:", { codigo, practica })

    if (!codigo || !practica) continue

    await prisma.nomenclador.create({
      data: {
        codigo,
        practica
      }
    })
  }

  console.log("✅ Nomenclador importado correctamente")
}

main()
  .catch(e => {
    console.error("ERROR:", e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })