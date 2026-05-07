import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

const TENANT_ID = "cmng4trt70000v5346vbu6qhl"

// ─────────────────────────────────────────────
// CREAR TURNO
// ─────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const turno = await prisma.turno.create({
      data: {
        tenantId: TENANT_ID,

        pacienteId: body.pacienteId,
        medicoId: body.medicoId,

        fecha: new Date(body.fecha),

        estado: "PENDIENTE",
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
        {
          ordenLlegada: "asc",
        },
      ],
    })

    return NextResponse.json(turnos)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Error al obtener turnos" },
      { status: 500 }
    )
  }
}