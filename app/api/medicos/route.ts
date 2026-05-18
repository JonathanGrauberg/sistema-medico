import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const medicos = await prisma.medico.findMany({
      orderBy: {
        apellido: "asc",
      },
    })

    return NextResponse.json(medicos)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Error obteniendo médicos" },
      { status: 500 }
    )
  }
}