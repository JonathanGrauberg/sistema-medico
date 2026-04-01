import { NextResponse } from "next/server"
import { getUserById, deleteUser, getFilesByUserId } from "@/lib/db"
import type { ApiResponse, User } from "@/lib/types"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<User>>> {
  try {
    const { id } = await params
    const user = await getUserById(id)

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: user })
  } catch {
    console.error("Error fetching user:", Error)
    return NextResponse.json(
      { success: false, error: "Error al obtener el usuario" },
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
    const user = await getUserById(id)

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    // Delete user (files are cascade deleted in the mock db)
    await deleteUser(id)

    return NextResponse.json({ 
      success: true, 
      data: { message: "Usuario eliminado correctamente" } 
    })
  } catch {
    console.error("Error deleting user:", Error)
    return NextResponse.json(
      { success: false, error: "Error al eliminar el usuario" },
      { status: 500 }
    )
  }
}
