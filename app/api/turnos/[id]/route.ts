import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

// ─────────────────────────────────────────────
// PATCH
// ─────────────────────────────────────────────
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()

    let data: any = {
      ...body,
    }

    // 🔥 Si pasa a EN_SALA
    // asignamos ordenLlegada automático
    if (body.estado === "EN_SALA") {
      const ultimo = await prisma.turno.findFirst({
        where: {
          estado: "EN_SALA",
        },

        orderBy: {
          ordenLlegada: "desc",
        },
      })

      data.ordenLlegada =
        (ultimo?.ordenLlegada || 0) + 1
    }

    const turno = await prisma.turno.update({
      where: {
        id: params.id,
      },

      data,

      include: {
        paciente: true,
        medico: true,
      },
    })

    return NextResponse.json(turno)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Error al actualizar turno" },
      { status: 500 }
    )
  }
}

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.turno.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Error al eliminar turno" },
      { status: 500 }
    )
  }
}

// ─────────────────────────────────────────────
// GET BY ID
// ─────────────────────────────────────────────
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const turno = await prisma.turno.findUnique({
      where: {
        id: params.id,
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
      { error: "Error al obtener turno" },
      { status: 500 }
    )
  }
}