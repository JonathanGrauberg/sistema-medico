import { NextResponse } from "next/server"
import { createUser, getUserByDni, checkDniExists } from "@/lib/db"
import { generateCredentials, validateDni } from "@/lib/credentials"
import type { ApiResponse, User, CreateUserInput } from "@/lib/types"

export async function POST(request: Request): Promise<NextResponse<ApiResponse<User>>> {
  try {
    const body = await request.json()
    const { nombre, apellido, dni, username, password } = body as CreateUserInput

    // Validate required fields
    if (!nombre || !apellido || !dni || !username || !password) {
      return NextResponse.json(
        { success: false, error: "Todos los campos son obligatorios" },
        { status: 400 }
      )
    }

    // Validate DNI format
    if (!validateDni(dni)) {
      return NextResponse.json(
        { success: false, error: "El DNI debe tener entre 7 y 8 dígitos" },
        { status: 400 }
      )
    }

    // Check if DNI already exists
    const existingUser = await getUserByDni(dni)
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Ya existe un usuario con este DNI" },
        { status: 409 }
      )
    }

    // Create user
    const user = await createUser({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      dni: dni.trim(),
      username: username.trim(),
      password // In production, hash this password
    })

    return NextResponse.json({ success: true, data: user }, { status: 201 })
  } catch {
    console.error("Error creating user:", Error)
    return NextResponse.json(
      { success: false, error: "Error al crear el usuario" },
      { status: 500 }
    )
  }
}

// Generate credentials endpoint
export async function GET(request: Request): Promise<NextResponse<ApiResponse>> {
  const { searchParams } = new URL(request.url)
  const nombre = searchParams.get("nombre")
  const apellido = searchParams.get("apellido")
  const dni = searchParams.get("dni")

  if (!nombre || !apellido || !dni) {
    return NextResponse.json(
      { success: false, error: "Se requieren nombre, apellido y DNI" },
      { status: 400 }
    )
  }

  if (!validateDni(dni)) {
    return NextResponse.json(
      { success: false, error: "El DNI debe tener entre 7 y 8 dígitos" },
      { status: 400 }
    )
  }

  // Check if DNI already exists
  const exists = await checkDniExists(dni)
  if (exists) {
    return NextResponse.json(
      { success: false, error: "Ya existe un usuario con este DNI" },
      { status: 409 }
    )
  }

  const credentials = generateCredentials(nombre, apellido, dni)

  return NextResponse.json({ success: true, data: credentials })
}
