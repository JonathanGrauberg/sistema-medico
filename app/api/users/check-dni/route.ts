import { NextResponse } from "next/server"
import { checkDniExists } from "@/lib/db"
import { validateDni } from "@/lib/credentials"
import type { ApiResponse } from "@/lib/types"

export async function GET(request: Request): Promise<NextResponse<ApiResponse<{ exists: boolean }>>> {
  try {
    const { searchParams } = new URL(request.url)
    const dni = searchParams.get("dni")

    if (!dni) {
      return NextResponse.json(
        { success: false, error: "Se requiere el DNI" },
        { status: 400 }
      )
    }

    if (!validateDni(dni)) {
      return NextResponse.json(
        { success: false, error: "El DNI debe tener entre 7 y 8 dígitos" },
        { status: 400 }
      )
    }

    const exists = await checkDniExists(dni)

    return NextResponse.json({ success: true, data: { exists } })
  } catch {
    console.error("Error checking DNI:", Error)
    return NextResponse.json(
      { success: false, error: "Error al verificar el DNI" },
      { status: 500 }
    )
  }
}
