//app\api\historias\route.ts:
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

// ✅ GET HISTORIAS POR PACIENTE
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const pacienteId = searchParams.get("pacienteId")

    if (!pacienteId) {
      return NextResponse.json([], { status: 200 })
    }

    const historias = await prisma.historiaClinica.findMany({
      where: { pacienteId },
      include: {
        medico: true
      },
      orderBy: {
        fecha: "desc"
      }
    })

    // ✅ YA NO parseamos nada, usamos campos reales
    const parsed = historias.map(h => ({
      id: h.id,
      fecha: h.fecha,
      medicoNombre: `${h.medico?.nombre || ""} ${h.medico?.apellido || ""}`,
      motivo: h.motivo,
      diagnostico: h.diagnostico,
      tratamiento: h.tratamiento,
      observaciones: h.observaciones,
    }))

    return NextResponse.json(parsed)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Error al obtener historias clínicas" },
      { status: 500 }
    )
  }
}


// ✅ POST CORREGIDO (SIN contenido)
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const historia = await prisma.historiaClinica.create({
      data: {
        pacienteId: body.pacienteId,
        medicoId: body.medicoId,
        motivo: body.motivo,
        diagnostico: body.diagnostico,
        tratamiento: body.tratamiento,
        observaciones: body.observaciones,
        fecha: new Date()
      }
    })

    return NextResponse.json(historia)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Error al crear historia clínica" },
      { status: 500 }
    )
  }
}