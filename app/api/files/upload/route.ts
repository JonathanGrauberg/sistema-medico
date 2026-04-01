import { NextResponse } from "next/server"
import { uploadFile, validateFile } from "@/lib/storage"
import { getUserById } from "@/lib/db"
import type { ApiResponse, FileType } from "@/lib/types"

export async function POST(request: Request): Promise<NextResponse<ApiResponse<{ url: string; nombre: string }>>> {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const userId = formData.get("userId") as string | null
    const tipo = formData.get("tipo") as FileType | null

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        { success: false, error: "No se proporcionó ningún archivo" },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Se requiere el ID de usuario" },
        { status: 400 }
      )
    }

    if (!tipo || !["ESTUDIO", "INFORME"].includes(tipo)) {
      return NextResponse.json(
        { success: false, error: "Tipo de archivo inválido (ESTUDIO o INFORME)" },
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

    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    // Upload file (simulated)
    const result = await uploadFile(file, userId, tipo)

    if (!result.success || !result.url) {
      return NextResponse.json(
        { success: false, error: result.error || "Error al subir el archivo" },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      data: { 
        url: result.url,
        nombre: file.name
      } 
    }, { status: 201 })
  } catch {
    console.error("Error uploading file:", Error)
    return NextResponse.json(
      { success: false, error: "Error al subir el archivo" },
      { status: 500 }
    )
  }
}
