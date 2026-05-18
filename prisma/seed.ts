import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando seed...")

  // ─────────────────────────────────────────────
  // LIMPIAR DB
  // ─────────────────────────────────────────────

  await prisma.turno.deleteMany()

  await prisma.historiaClinica.deleteMany()

  await prisma.archivo.deleteMany()

  await prisma.credencial.deleteMany()

  await prisma.paciente.deleteMany()

  await prisma.medico.deleteMany()

  await prisma.user.deleteMany()

  await prisma.preparacion.deleteMany()

  await prisma.tenant.deleteMany()

  // ─────────────────────────────────────────────
  // TENANT
  // ─────────────────────────────────────────────

  const tenant = await prisma.tenant.create({
    data: {
      nombre: "CMP Centro Médico Paraná",
    },
  })

  console.log("✅ Tenant creado")

  // ─────────────────────────────────────────────
  // MÉDICOS
  // ─────────────────────────────────────────────

  const medicoCarlos = await prisma.medico.create({
    data: {
      tenantId: tenant.id,

      nombre: "Carlos",
      apellido: "González",

      email: "carlos@cmp.com",
    },
  })

  const medicoJuan = await prisma.medico.create({
    data: {
      tenantId: tenant.id,

      nombre: "Juan",
      apellido: "Pérez",

      email: "juan@cmp.com",
    },
  })

  console.log("✅ Médicos creados")

  // ─────────────────────────────────────────────
  // SECRETARIA
  // ─────────────────────────────────────────────

  await prisma.user.create({
    data: {
      tenantId: tenant.id,

      nombre: "Norma",
      apellido: "Fernández",

      email: "norma@cmp.com",

      password: "123456",

      rol: "SECRETARIA",
    },
  })

  console.log("✅ Secretaria creada")

  // ─────────────────────────────────────────────
  // PACIENTES
  // ─────────────────────────────────────────────

  const pacientesData = [
    {
      nombre: "Pedro",
      apellido: "Ramírez",
      dni: "35706576",
      telefono: "3435123456",
      obraSocial: "IOSPER",
      localidad: "Paraná",
    },

    {
      nombre: "María",
      apellido: "Gómez",
      dni: "30111222",
      telefono: "3435443322",
      obraSocial: "OSDE",
      localidad: "Paraná",
    },

    {
      nombre: "Lucas",
      apellido: "Fernández",
      dni: "28999111",
      telefono: "3435667788",
      obraSocial: "Swiss Medical",
      localidad: "Oro Verde",
    },

    {
      nombre: "Ana",
      apellido: "Martínez",
      dni: "41222333",
      telefono: "3435888899",
      obraSocial: "IOSPER",
      localidad: "Crespo",
    },
  ]

  const pacientes = []

  for (const paciente of pacientesData) {
    const created = await prisma.paciente.create({
      data: {
        tenantId: tenant.id,

        ...paciente,

        username: paciente.dni,

        password: "123456",
      },
    })

    pacientes.push(created)
  }

  console.log("✅ Pacientes creados")

  // ─────────────────────────────────────────────
  // PREPARACIONES
  // ─────────────────────────────────────────────

  await prisma.preparacion.createMany({
    data: [
      {
        tenantId: tenant.id,

        nombre: "Eco abdominal",

        contenido:
          "Ayuno de 6 a 8 horas. Evitar bebidas gaseosas y lácteos.",
      },

      {
        tenantId: tenant.id,

        nombre: "Resonancia",

        contenido:
          "Retirar objetos metálicos antes del estudio.",
      },
    ],
  })

  console.log("✅ Preparaciones creadas")

  // ─────────────────────────────────────────────
  // TURNOS
  // ─────────────────────────────────────────────

  const hoy = new Date()

  await prisma.turno.createMany({
    data: [
      {
        tenantId: tenant.id,

        pacienteId: pacientes[0].id,
        medicoId: medicoCarlos.id,

        fecha: new Date(hoy.getTime() + 1000 * 60 * 60),

        estado: "CONFIRMADO",

        practica: "Eco abdominal",

        obraSocial: "IOSPER",

        coseguro: 15000,
      },

      {
        tenantId: tenant.id,

        pacienteId: pacientes[1].id,
        medicoId: medicoJuan.id,

        fecha: new Date(hoy.getTime() + 1000 * 60 * 120),

        estado: "PENDIENTE",

        practica: "Resonancia",

        obraSocial: "OSDE",
      },

      {
        tenantId: tenant.id,

        pacienteId: pacientes[2].id,
        medicoId: medicoCarlos.id,

        fecha: new Date(hoy.getTime() - 1000 * 60 * 60 * 24),

        estado: "ATENDIDO",

        practica: "TAC",

        obraSocial: "Swiss Medical",

        pagado: true,
      },
    ],
  })

  console.log("✅ Turnos creados")

  console.log("🎉 Seed completado")
}

main()
  .catch((e) => {
    console.error(e)

    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })