import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

const TENANT_ID = "cmng4trt70000v5346vbu6qhl"

export async function GET() {
  const medicos = await prisma.user.findMany({
    where: {
      tenantId: TENANT_ID,
      rol: "MEDICO"
    }
  })

  return NextResponse.json(medicos)
}