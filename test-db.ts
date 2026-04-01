// test-db.ts
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const tenant = await prisma.tenant.create({
    data: {
      nombre: "Clínica Demo",
    },
  })

  console.log("Tenant creado:", tenant)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())