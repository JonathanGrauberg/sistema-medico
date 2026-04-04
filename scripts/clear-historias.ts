import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const result = await prisma.historiaClinica.deleteMany()
  console.log(`🧹 Eliminadas ${result.count} historias clínicas`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())