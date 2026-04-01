"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileDropzone } from "@/components/file-dropzone"
import { toast } from "sonner"
import type { GeneratedCredentials, User } from "@/lib/types"

const userFormSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  dni: z.string().regex(/^\d{7,8}$/, "El DNI debe tener entre 7 y 8 digitos")
})

type UserFormValues = z.infer<typeof userFormSchema>

interface UserFormProps {
  onUserCreated?: (user: User) => void
}

// Generar username
function generateUsername(nombre: string, apellido: string): string {
  const cleanNombre = nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  const cleanApellido = apellido.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  return `${cleanNombre.charAt(0)}${cleanApellido}`.replace(/\s/g, "")
}

// Generar password
function generatePassword(): string {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789"
  let password = ""
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export function UserForm({ onUserCreated }: UserFormProps) {
  const [credentials, setCredentials] = useState<GeneratedCredentials | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [estudios, setEstudios] = useState<File[]>([])
  const [informes, setInformes] = useState<File[]>([])

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      dni: ""
    }
  })

  const generateCredentials = async () => {
    const values = form.getValues()

    if (!values.nombre || !values.apellido || !values.dni) {
      toast.error("Completa nombre, apellido y DNI primero")
      return
    }

    const dniValid = /^\d{7,8}$/.test(values.dni)
    if (!dniValid) {
      toast.error("El DNI debe tener entre 7 y 8 digitos")
      return
    }

    setIsGenerating(true)

    setTimeout(() => {
      const username = generateUsername(values.nombre, values.apellido)
      const password = generatePassword()

      setCredentials({
        nombreApellido: `${values.nombre} ${values.apellido}`,
        username,
        password
      })
      toast.success("Credenciales generadas")
      setIsGenerating(false)
    }, 300)
  }

  const onSubmit = async (values: UserFormValues) => {
    if (!credentials) {
      toast.error("Genera las credenciales primero")
      return
    }

    setIsSubmitting(true)

    try {
      // 🔥 AHORA VA A LA API REAL
      const res = await fetch("/api/pacientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: values.nombre,
          apellido: values.apellido,
          dni: values.dni
        })
      })

      if (!res.ok) {
        throw new Error("Error al crear paciente")
      }

      const newUser = await res.json()

      toast.success("Paciente creado exitosamente")

      // Reset
      form.reset()
      setCredentials(null)
      setEstudios([])
      setInformes([])

      onUserCreated?.(newUser)

    } catch (error) {
      console.error(error)
      toast.error("Error al crear paciente")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Nuevo Paciente</CardTitle>
        <CardDescription>
          Ingresa los datos del paciente para crear su cuenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre</label>
              <Input placeholder="Juan" {...form.register("nombre")} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Apellido</label>
              <Input placeholder="Perez" {...form.register("apellido")} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">DNI</label>
            <Input placeholder="12345678" {...form.register("dni")} />
          </div>

          <Button type="button" onClick={generateCredentials} className="w-full">
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Generar Credenciales
          </Button>

          {credentials && (
            <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
              <Input value={credentials.nombreApellido} readOnly />
              <Input value={credentials.username} readOnly />

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  readOnly
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <FileDropzone label="Estudios" onFilesChange={setEstudios} />
            <FileDropzone label="Informes" onFilesChange={setInformes} />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Crear Paciente
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}