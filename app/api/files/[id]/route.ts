import { NextResponse } from "next/server"
import { getFileById, deleteFile } from "@/lib/db"
import { deleteFileFromStorage, getDownloadUrl } from "@/lib/storage"
import type { ApiResponse, FileRecord } from "@/lib/types"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<FileRecord & { downloadUrl: string }>>> {
  try {
    const { id } = await params
    const file = await getFileById(id)

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Archivo no encontrado" },
        { status: 404 }
      )
    }

    const downloadUrl = getDownloadUrl(file.url)

    return NextResponse.json({ 
      success: true, 
      data: { ...file, downloadUrl } 
    })
  } catch {
    console.error("Error fetching file:", Error)
    return NextResponse.json(
      { success: false, error: "Error al obtener el archivo" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await params
    const file = await getFileById(id)

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Archivo no encontrado" },
        { status: 404 }
      )
    }

    // Delete from storage (simulated)
    await deleteFileFromStorage(file.url)

    // Delete file record from database
    await deleteFile(id)

    return NextResponse.json({ 
      success: true, 
      data: { message: "Archivo eliminado correctamente" } 
    })
  } catch {
    console.error("Error deleting file:", Error)
    return NextResponse.json(
      { success: false, error: "Error al eliminar el archivo" },
      { status: 500 }
    )
  }
}
