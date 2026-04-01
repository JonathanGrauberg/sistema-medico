import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()

    const turno = await prisma.turno.update({
      where: {
        id: params.id
      },
      data: {
        estado: body.estado
      }
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