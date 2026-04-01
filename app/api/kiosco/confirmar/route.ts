import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const body = await req.json()

  const turno = await prisma.turno.update({
    where: {
      id: body.turnoId
    },
    data: {
      estado: "EN_SALA"
    }
  })

  return NextResponse.json(turno)
}