import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

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