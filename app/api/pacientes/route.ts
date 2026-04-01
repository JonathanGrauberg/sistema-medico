import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

const TENANT_ID = "cmng4trt70000v5346vbu6qhl"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const paciente = await prisma.paciente.create({
      data: {
        tenantId: TENANT_ID,
        nombre: body.nombre,
        apellido: body.apellido,
        dni: body.dni,
        telefono: body.telefono,
        email: body.email,
      },
    })

    return NextResponse.json(paciente)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Error al crear paciente" },
      { status: 500 }
    )
  }
}

export async function GET() {
  const pacientes = await prisma.paciente.findMany()

  return NextResponse.json(pacientes)
}