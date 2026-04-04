import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    console.log("ID recibido:", id)

    const paciente = await prisma.paciente.findUnique({
      where: { id },
      include: {
        archivos: true
      }
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