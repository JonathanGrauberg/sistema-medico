import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const paciente = await prisma.paciente.findFirst({
      where: {
        dni: body.dni
      }
    })

    if (!paciente) {
      return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 })
    }

    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    const mañana = new Date(hoy)
    mañana.setDate(hoy.getDate() + 1)

    const turno = await prisma.turno.findFirst({
      where: {
        pacienteId: paciente.id,
        fecha: {
          gte: hoy,
          lt: mañana
        }
      },
      include: {
        medico: true
      }
    })

    if (!turno) {
      return NextResponse.json({ error: "No tenés turnos hoy" }, { status: 404 })
    }

    return NextResponse.json({
      paciente,
      turno
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error en kiosco" }, { status: 500 })
  }
}