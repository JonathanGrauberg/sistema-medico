import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""

    // 🔍 si no hay búsqueda → no traer nada
    if (search.length < 2) {
      return NextResponse.json([])
    }

    const data = await prisma.nomenclador.findMany({
      where: {
        OR: [
          {
            codigo: {
              contains: search,
              mode: "insensitive"
            }
          },
          {
            practica: {
              contains: search,
              mode: "insensitive"
            }
          }
        ]
      },
      take: 50, // 🔥 podés ajustar
      orderBy: {
        codigo: "asc"
      }
    })

    return NextResponse.json(data)

  } catch (error) {
    console.error(error)
    return NextResponse.json([])
  }
}