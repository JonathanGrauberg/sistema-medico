import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const turnos = await prisma.turno.findMany({
    where: {
      medicoId: params.id
    },
    include: {
      paciente: true
    },
    orderBy: {
      fecha: "asc"
    }
  })

  return NextResponse.json(turnos)
}