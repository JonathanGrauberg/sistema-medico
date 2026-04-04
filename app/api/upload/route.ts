import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const file = formData.get("file") as File
    const pacienteId = formData.get("pacienteId") as string
    const tipo = formData.get("tipo") as "ESTUDIO" | "INFORME"

    if (!file || !pacienteId || !tipo) {
      return NextResponse.json(
        { error: "Faltan datos" },
        { status: 400 }
      )
    }

    // buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // carpeta
    const uploadDir = path.join(process.cwd(), "public/uploads", pacienteId)

    // nombre único
    const fileName = `${Date.now()}-${file.name}`
    const filePath = path.join(uploadDir, fileName)

    // crear carpeta si no existe
    await import("fs/promises").then(fs =>
      fs.mkdir(uploadDir, { recursive: true })
    )

    // guardar archivo
    await writeFile(filePath, buffer)

    // url pública
    const url = `/uploads/${pacienteId}/${fileName}`

    // guardar en DB
    const nuevoArchivo = await prisma.archivo.create({
      data: {
        pacienteId,
        nombre: file.name,
        tipo,
        url,
        size: file.size,
        mimeType: file.type,
      },
    })

    return NextResponse.json(nuevoArchivo)

  } catch (error) {
    console.error("UPLOAD ERROR:", error)
    return NextResponse.json(
      { error: "Error al subir archivo" },
      { status: 500 }
    )
  }
}