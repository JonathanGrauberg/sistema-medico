import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

const TENANT_ID = "cmng4trt70000v5346vbu6qhl"

// 🔥 CREAR TURNO
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const turno = await prisma.turno.create({
      data: {
        tenantId: TENANT_ID,
        pacienteId: body.pacienteId,
        medicoId: body.medicoId, // temporal
        fecha: new Date(body.fecha),
        estado: "PENDIENTE"
      }
    })

    return NextResponse.json(turno)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error al crear turno" }, { status: 500 })
  }
}

// 🔥 LISTAR TURNOS
export async function GET() {
  const turnos = await prisma.turno.findMany({
    include: {
      paciente: true,
      medico: true
    },
    orderBy: {
      fecha: "asc"
    }
  })

  return NextResponse.json(turnos)
}