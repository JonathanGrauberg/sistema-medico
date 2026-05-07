import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

// ─────────────────────────────────────────────
// GET
// ─────────────────────────────────────────────
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const paciente = await prisma.paciente.findUnique({
      where: { id },

      include: {
        archivos: true,
        historias: true,
      },
    })

    if (!paciente) {
      return NextResponse.json(
        { error: "Paciente no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(paciente)
  } catch (error) {
    console.error("ERROR BACKEND:", error)

    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    )
  }
}

// ─────────────────────────────────────────────
// PATCH
// ─────────────────────────────────────────────
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const body = await req.json()

    const paciente = await prisma.paciente.update({
      where: { id },

      data: {
        telefono: body.telefono,
        email: body.email,

        localidad: body.localidad,

        obraSocial: body.obraSocial,

        observaciones:
          body.observaciones,
      },
    })

    return NextResponse.json(paciente)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Error actualizando paciente" },
      { status: 500 }
    )
  }
}

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    await prisma.paciente.delete({
      where: { id },
    })

    return NextResponse.json({
      ok: true,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Error eliminando paciente" },
      { status: 500 }
    )
  }
}