"use client"

import { useState } from "react"

import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import * as z from "zod"

import {
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
} from "lucide-react"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { FileDropzone } from "@/components/file-dropzone"

import type {
  GeneratedCredentials,
  User,
} from "@/lib/types"

// ─────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────
const userFormSchema = z.object({
  nombre: z
    .string()
    .min(2),

  apellido: z
    .string()
    .min(2),

  dni: z.string(),

  telefono:
    z.string().optional(),

  email: z
    .string()
    .optional(),

  localidad:
    z.string().optional(),

  obraSocial:
    z.string().optional(),

  observaciones:
    z.string().optional(),
})

type UserFormValues =
  z.infer<
    typeof userFormSchema
  >

interface Props {
  onUserCreated?: (
    user: User
  ) => void
}

// ─────────────────────────────────────────────
// Username
// ─────────────────────────────────────────────
function generateUsername(
  nombre: string,
  apellido: string
) {
  const cleanNombre =
    nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )

  const cleanApellido =
    apellido
      .toLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )

  return `${cleanNombre.charAt(
    0
  )}${cleanApellido}`.replace(
    /\s/g,
    ""
  )
}

// ─────────────────────────────────────────────
// Password
// ─────────────────────────────────────────────
function generatePassword() {
  const chars =
    "abcdefghijkmnpqrstuvwxyz23456789"

  let password = ""

  for (let i = 0; i < 8; i++) {
    password += chars.charAt(
      Math.floor(
        Math.random() *
          chars.length
      )
    )
  }

  return password
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export function ProfessionalUserForm({
  onUserCreated,
}: Props) {
  const [credentials, setCredentials] =
    useState<GeneratedCredentials | null>(
      null
    )

  const [showPassword, setShowPassword] =
    useState(false)

  const [isGenerating, setIsGenerating] =
    useState(false)

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const [estudios, setEstudios] =
    useState<File[]>([])

  const [informes, setInformes] =
    useState<File[]>([])

  // ─────────────────────────────────────────────
  // Form
  // ─────────────────────────────────────────────
  const form =
    useForm<UserFormValues>({
      resolver:
        zodResolver(
          userFormSchema
        ),

      defaultValues: {
        nombre: "",
        apellido: "",
        dni: "",

        telefono: "",
        email: "",

        localidad: "",

        obraSocial: "",

        observaciones: "",
      },
    })

  // ─────────────────────────────────────────────
  // Generate credentials
  // ─────────────────────────────────────────────
  const handleGenerateCredentials =
    async () => {
      const values =
        form.getValues()

      if (
        !values.nombre ||
        !values.apellido
      ) {
        toast.error(
          "Completa nombre y apellido"
        )

        return
      }

      setIsGenerating(true)

      setTimeout(() => {
        const username =
          generateUsername(
            values.nombre,
            values.apellido
          )

        const password =
          generatePassword()

        setCredentials({
          nombreApellido: `${values.nombre} ${values.apellido}`,

          username,

          password,
        })

        toast.success(
          "Credenciales generadas"
        )

        setIsGenerating(false)
      }, 300)
    }

  // ─────────────────────────────────────────────
  // Submit
  // ─────────────────────────────────────────────
  const onSubmit = async (
    values: UserFormValues
  ) => {
    if (!credentials) {
      toast.error(
        "Genera las credenciales primero"
      )

      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch(
        "/api/pacientes",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            ...values,
          }),
        }
      )

      if (!res.ok) {
        throw new Error()
      }

      const paciente =
        await res.json()

      // ─────────────────────────────────────────
      // Upload estudios
      // ─────────────────────────────────────────
      const uploadFiles =
        async (
          files: File[],
          tipo:
            | "ESTUDIO"
            | "INFORME"
        ) => {
          for (const file of files) {
            const formData =
              new FormData()

            formData.append(
              "file",
              file
            )

            formData.append(
              "pacienteId",
              paciente.id
            )

            formData.append(
              "tipo",
              tipo
            )

            await fetch(
              "/api/upload",
              {
                method: "POST",
                body: formData,
              }
            )
          }
        }

      await uploadFiles(
        estudios,
        "ESTUDIO"
      )

      await uploadFiles(
        informes,
        "INFORME"
      )

      toast.success(
        "Paciente creado"
      )

      form.reset()

      setCredentials(null)

      setEstudios([])

      setInformes([])

      onUserCreated?.(paciente)
    } catch {
      toast.error(
        "Error creando paciente"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Nuevo Paciente
        </CardTitle>

        <CardDescription>
          Alta completa de paciente
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(
            onSubmit
          )}
          className="space-y-6"
        >
          {/* Nombre */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Nombre
              </label>

              <Input
                {...form.register(
                  "nombre"
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Apellido
              </label>

              <Input
                {...form.register(
                  "apellido"
                )}
              />
            </div>
          </div>

          {/* DNI */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              DNI
            </label>

            <Input
              {...form.register("dni")}
            />
          </div>

          {/* Contacto */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Teléfono
              </label>

              <Input
                {...form.register(
                  "telefono"
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Email
              </label>

              <Input
                {...form.register(
                  "email"
                )}
              />
            </div>
          </div>

          {/* Localidad / OS */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Localidad
              </label>

              <Input
                {...form.register(
                  "localidad"
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Obra Social
              </label>

              <Input
                {...form.register(
                  "obraSocial"
                )}
              />
            </div>
          </div>

          {/* Observaciones */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Observaciones
            </label>

            <textarea
              {...form.register(
                "observaciones"
              )}
              className="w-full min-h-[120px] rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          {/* Credenciales */}
          <Button
            type="button"
            onClick={
              handleGenerateCredentials
            }
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
              <Input
                value={
                  credentials.nombreApellido
                }
                readOnly
              />

              <Input
                value={
                  credentials.username
                }
                readOnly
              />

              <div className="relative">
                <Input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    credentials.password
                  }
                  readOnly
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword ? (
                    <EyeOff />
                  ) : (
                    <Eye />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Uploads */}
          <div className="grid gap-4 lg:grid-cols-2">
            <FileDropzone
              label="Estudios"
              onFilesChange={
                setEstudios
              }
            />

            <FileDropzone
              label="Informes"
              onFilesChange={
                setInformes
              }
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            Crear Paciente
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}