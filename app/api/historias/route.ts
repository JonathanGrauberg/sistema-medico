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

    // 🔥 parsear contenido a estructura usable
    const parsed = historias.map(h => {
      const contenido = h.contenido || ""

      const getValue = (label: string) => {
        const regex = new RegExp(`${label}:\\s*(.*)`)
        const match = contenido.match(regex)
        return match ? match[1] : ""
      }

      return {
        id: h.id,
        fecha: h.fecha,
        medicoNombre: `${h.medico?.nombre || ""} ${h.medico?.apellido || ""}`,
        motivo: getValue("Motivo"),
        diagnostico: getValue("Diagnóstico"),
        tratamiento: getValue("Tratamiento"),
        observaciones: getValue("Observaciones"),
      }
    })

    return NextResponse.json(parsed)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Error al obtener historias clínicas" },
      { status: 500 }
    )
  }
}


// ✅ POST (el tuyo, lo dejo igual)
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const historia = await prisma.historiaClinica.create({
      data: {
        pacienteId: body.pacienteId,
        medicoId: body.medicoId,
        contenido: body.contenido,
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