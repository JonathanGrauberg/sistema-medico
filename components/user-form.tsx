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
import { addMockUser, addMockFile } from "@/lib/mock-data"
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

// Funcion para generar username
function generateUsername(nombre: string, apellido: string): string {
  const cleanNombre = nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  const cleanApellido = apellido.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  return `${cleanNombre.charAt(0)}${cleanApellido}`.replace(/\s/g, "")
}

// Funcion para generar password
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

    // Simulamos delay de API
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
      // Crear usuario en mock data
      const newUser = addMockUser({
        nombre: values.nombre,
        apellido: values.apellido,
        dni: values.dni,
        username: credentials.username,
        password: credentials.password
      })

      // Agregar estudios
      for (const file of estudios) {
        addMockFile({
          nombre: file.name,
          tipo: "ESTUDIO",
          url: `/mock/${file.name}`,
          size: file.size,
          mimeType: file.type,
          userId: newUser.id
        })
      }

      // Agregar informes
      for (const file of informes) {
        addMockFile({
          nombre: file.name,
          tipo: "INFORME",
          url: `/mock/${file.name}`,
          size: file.size,
          mimeType: file.type,
          userId: newUser.id
        })
      }

      toast.success("Usuario creado exitosamente")
      
      // Reset form
      form.reset()
      setCredentials(null)
      setEstudios([])
      setInformes([])
      
      onUserCreated?.(newUser)
    } catch {
      toast.error("Error al crear usuario")
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
              <label htmlFor="nombre" className="text-sm font-medium">
                Nombre
              </label>
              <Input
                id="nombre"
                placeholder="Juan"
                {...form.register("nombre")}
              />
              {form.formState.errors.nombre && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.nombre.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="apellido" className="text-sm font-medium">
                Apellido
              </label>
              <Input
                id="apellido"
                placeholder="Perez"
                {...form.register("apellido")}
              />
              {form.formState.errors.apellido && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.apellido.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="dni" className="text-sm font-medium">
              DNI
            </label>
            <Input
              id="dni"
              placeholder="12345678"
              {...form.register("dni")}
            />
            {form.formState.errors.dni && (
              <p className="text-sm text-destructive">
                {form.formState.errors.dni.message}
              </p>
            )}
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={generateCredentials}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Generar Credenciales
          </Button>

          {credentials && (
            <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre y Apellido</label>
                <Input value={credentials.nombreApellido} readOnly />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Usuario</label>
                <Input value={credentials.username} readOnly />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Contraseña</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    readOnly
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Ocultar" : "Mostrar"} contraseña
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <FileDropzone
              label="Subir Estudios"
              onFilesChange={setEstudios}
              disabled={!credentials}
            />
            <FileDropzone
              label="Subir Informes"
              onFilesChange={setInformes}
              disabled={!credentials}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!credentials || isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Crear Paciente
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
