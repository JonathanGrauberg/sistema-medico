import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const medico = await prisma.user.create({
    data: {
      tenantId: "cmng4trt70000v5346vbu6qhl",
      nombre: "Dr. Juan",
      apellido: "Gomez",
      email: "doctor@test.com",
      password: "123456",
      rol: "MEDICO"
    }
  })

  console.log(medico)
}

main().finally(() => prisma.$disconnect())