"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import {
  Loader2,
  Save,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Textarea } from "@/components/ui/textarea"

import { toast } from "sonner"

import type {
  GeneratedCredentials,
  User,
} from "@/lib/types"

const schema = z.object({
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  dni: z.string().min(7),

  email: z.string().optional(),
  telefono: z.string().optional(),
  localidad: z.string().optional(),
  obraSocial: z.string().optional(),
  observaciones: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  onUserCreated?: (user: User) => void
}

// ─────────────────────────────────────────────
// Generar username
// ─────────────────────────────────────────────

function generateUsername(
  nombre: string,
  apellido: string
): string {
  const cleanNombre = nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

  const cleanApellido = apellido
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

  return `${cleanNombre.charAt(0)}${cleanApellido}`
    .replace(/\s/g, "")
}

// ─────────────────────────────────────────────
// Generar password
// ─────────────────────────────────────────────

function generatePassword(): string {
  const chars =
    "abcdefghijkmnpqrstuvwxyz23456789"

  let password = ""

  for (let i = 0; i < 8; i++) {
    password += chars.charAt(
      Math.floor(Math.random() * chars.length)
    )
  }

  return password
}

export function SecretariaUserForm({
  onUserCreated,
}: Props) {

  const [loading, setLoading] = useState(false)

  const [credentials, setCredentials] =
    useState<GeneratedCredentials | null>(null)

  const [showPassword, setShowPassword] =
    useState(false)

  const [generating, setGenerating] =
    useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      nombre: "",
      apellido: "",
      dni: "",

      email: "",
      telefono: "",
      localidad: "",
      obraSocial: "",
      observaciones: "",
    },
  })

  // ─────────────────────────────────────────────
  // Generar credenciales
  // ─────────────────────────────────────────────

  const handleGenerateCredentials = async () => {

    const values = form.getValues()

    if (
      !values.nombre ||
      !values.apellido ||
      !values.dni
    ) {
      toast.error(
        "Completa nombre, apellido y DNI"
      )
      return
    }

    setGenerating(true)

    setTimeout(() => {

      const username = generateUsername(
        values.nombre,
        values.apellido
      )

      const password = generatePassword()

      setCredentials({
        nombreApellido:
          `${values.nombre} ${values.apellido}`,

        username,
        password,
      })

      toast.success("Credenciales generadas")

      setGenerating(false)

    }, 300)
  }

  // ─────────────────────────────────────────────
  // Submit
  // ─────────────────────────────────────────────

  const onSubmit = async (
    values: FormValues
  ) => {

    if (!credentials) {
      toast.error(
        "Genera las credenciales primero"
      )
      return
    }

    try {

      setLoading(true)

      const res = await fetch(
        "/api/pacientes",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...values,

            username: credentials.username,
            password: credentials.password,
          }),
        }
      )

      if (!res.ok) {
        throw new Error()
      }

      const paciente = await res.json()

      toast.success("Paciente creado")

      form.reset()

      setCredentials(null)

      onUserCreated?.(paciente)

    } catch (error) {

      console.error(error)

      toast.error(
        "Error al crear paciente"
      )

    } finally {

      setLoading(false)
    }
  }

  return (
    <Card>

      <CardHeader>
        <CardTitle>
          Nuevo paciente
        </CardTitle>

        <CardDescription>
          Alta administrativa
        </CardDescription>
      </CardHeader>

      <CardContent>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >

          {/* DATOS */}

          <div className="grid gap-4 md:grid-cols-2">

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Apellido
              </label>

              <Input
                placeholder="Perez"
                {...form.register("apellido")}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Nombre
              </label>

              <Input
                placeholder="Juan"
                {...form.register("nombre")}
              />
            </div>

          </div>

          <div className="grid gap-4 md:grid-cols-2">

            <div className="space-y-2">
              <label className="text-sm font-medium">
                DNI
              </label>

              <Input
                placeholder="12345678"
                {...form.register("dni")}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Teléfono
              </label>

              <Input
                placeholder="3434555555"
                {...form.register("telefono")}
              />
            </div>

          </div>

          {/* CONTACTO */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Mail
            </label>

            <Input
              placeholder="paciente@mail.com"
              {...form.register("email")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Localidad
            </label>

            <Input
              placeholder="Paraná"
              {...form.register("localidad")}
            />
          </div>

          {/* OBRA SOCIAL */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Obra social
            </label>

            <Input
              placeholder="IOSPER"
              {...form.register("obraSocial")}
            />
          </div>

          {/* OBSERVACIONES */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Observaciones
            </label>

            <Textarea
              placeholder="Notas internas..."
              className="min-h-[120px]"
              {...form.register("observaciones")}
            />
          </div>

          {/* GENERAR CREDENCIALES */}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGenerateCredentials}
          >

            {generating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}

            Generar credenciales

          </Button>

          {/* PREVIEW */}

          {credentials && (

            <div className="space-y-4 rounded-lg border bg-muted/30 p-4">

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Usuario
                </label>

                <Input
                  value={credentials.username}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Contraseña
                </label>

                <div className="relative">

                  <Input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }

                    value={credentials.password}

                    readOnly
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"

                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >

                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}

                  </Button>

                </div>
              </div>

            </div>
          )}

          {/* SUBMIT */}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >

            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}

            Guardar paciente

          </Button>

        </form>
      </CardContent>
    </Card>
  )
}