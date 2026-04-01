// prisma/seed.ts

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.tenant.create({
    data: {
      nombre: "Clínica 1",
    },
  })

  await prisma.tenant.create({
    data: {
      nombre: "Clínica 2",
    },
  })

  console.log("Seed ejecutado correctamente 🌱")
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })