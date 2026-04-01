import { NextResponse } from "next/server"
import { searchUsers, getAllUsers } from "@/lib/db"
import type { ApiResponse, User } from "@/lib/types"

export async function GET(request: Request): Promise<NextResponse<ApiResponse<User[]>>> {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    let users: User[]

    if (query && query.trim()) {
      users = await searchUsers(query.trim())
    } else {
      users = await getAllUsers()
    }

    return NextResponse.json({ success: true, data: users })
  } catch {
    console.error("Error searching users:", Error)
    return NextResponse.json(
      { success: false, error: "Error al buscar usuarios" },
      { status: 500 }
    )
  }
}
