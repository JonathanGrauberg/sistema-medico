import { NextResponse } from "next/server"
import { createFile, getFilesByUserId, getUserById } from "@/lib/db"
import type { ApiResponse, FileRecord, FileType } from "@/lib/types"

export async function POST(request: Request): Promise<NextResponse<ApiResponse<FileRecord>>> {
  try {
    const body = await request.json()
    const { nombre, tipo, url, size, mimeType, userId } = body

    // Validate required fields
    if (!nombre || !tipo || !url || !userId) {
      return NextResponse.json(
        { success: false, error: "Faltan campos obligatorios" },
        { status: 400 }
      )
    }

    // Validate file type
    if (!["ESTUDIO", "INFORME"].includes(tipo)) {
      return NextResponse.json(
        { success: false, error: "Tipo de archivo inválido" },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await getUserById(userId)
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    // Create file record
    const file = await createFile({
      nombre,
      tipo: tipo as FileType,
      url,
      size: size || 0,
      mimeType: mimeType || "application/octet-stream",
      userId
    })

    return NextResponse.json({ success: true, data: file }, { status: 201 })
  } catch {
    console.error("Error creating file:", Error)
    return NextResponse.json(
      { success: false, error: "Error al crear el archivo" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request): Promise<NextResponse<ApiResponse<FileRecord[]>>> {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Se requiere el ID de usuario" },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await getUserById(userId)
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    const files = await getFilesByUserId(userId)

    return NextResponse.json({ success: true, data: files })
  } catch {
    console.error("Error fetching files:", Error)
    return NextResponse.json(
      { success: false, error: "Error al obtener los archivos" },
      { status: 500 }
    )
  }
}
