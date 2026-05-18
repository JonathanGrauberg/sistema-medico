import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

const TENANT_ID = "cmpb7gd8i0000v5ecuey4300e"

// ─────────────────────────────────────────────
// CREAR TURNO
// ─────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json()

    console.log("BODY:", body)

const paciente = await prisma.paciente.findUnique({
  where: {
    id: body.pacienteId,
  },
})

console.log("PACIENTE:", paciente)

    const turno = await prisma.turno.create({
  data: {
    tenantId: TENANT_ID,

    pacienteId: body.pacienteId,
    medicoId: body.medicoId,

    fecha: new Date(body.fecha),

    estado: "PENDIENTE",

    practica: body.practica,
    motivo: body.motivo,

    observaciones: body.observaciones,

    duracionMin: body.duracionMin || 30,

    obraSocial: body.obraSocial,

    coseguro: body.coseguro
      ? Number(body.coseguro)
      : null,
  },

  include: {
    paciente: true,
    medico: true,
  },
})

    return NextResponse.json(turno)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Error al crear turno" },
      { status: 500 }
    )
  }
}

// ─────────────────────────────────────────────
// LISTAR TURNOS
// ─────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const fecha = searchParams.get("fecha")

    let where = {}

    // 🔥 Filtrar por día
    if (fecha) {
      const start = new Date(fecha)
      start.setHours(0, 0, 0, 0)

      const end = new Date(fecha)
      end.setHours(23, 59, 59, 999)

      where = {
        fecha: {
          gte: start,
          lte: end,
        },
      }
    }

    const turnos = await prisma.turno.findMany({
      where,

      include: {
        paciente: true,
        medico: true,
      },

      orderBy: [
        {
          fecha: "asc",
        },
      ],
    })

    return NextResponse.json(turnos)
  } catch (error: any) {

  console.error("ERROR TURNO:", error)

  return NextResponse.json(
    {
      error: error.message || "Error al crear turno",
    },
    {
      status: 500,
    }
  )
}
}