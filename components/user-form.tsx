"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { toast } from "sonner"

import type { User } from "@/lib/types"

// ─────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────
const userFormSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres"),

  apellido: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres"),

  dni: z
    .string()
    .regex(/^\d{7,8}$/, "El DNI debe tener entre 7 y 8 dígitos"),

  telefono: z.string().optional(),

  email: z
    .string()
    .email("Mail inválido")
    .optional()
    .or(z.literal("")),

  localidad: z.string().optional(),

  obraSocial: z.string().optional(),

  observaciones: z.string().optional(),
})

type UserFormValues = z.infer<typeof userFormSchema>

interface UserFormProps {
  onUserCreated?: (user: User) => void
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export function UserForm({
  onUserCreated,
}: UserFormProps) {
  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),

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
  // Submit
  // ─────────────────────────────────────────────
  const onSubmit = async (
    values: UserFormValues
  ) => {
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/pacientes", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(values),
      })

      if (!res.ok) {
        throw new Error("Error al crear paciente")
      }

      const newUser = await res.json()

      toast.success("Paciente creado")

      form.reset()

      onUserCreated?.(newUser)
    } catch (error) {
      console.error(error)

      toast.error("Error al crear paciente")
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
          Registro administrativo del paciente
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Nombre / Apellido */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Nombre
              </label>

              <Input
                placeholder="Juan"
                {...form.register("nombre")}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Apellido
              </label>

              <Input
                placeholder="Pérez"
                {...form.register("apellido")}
              />
            </div>
          </div>

          {/* DNI */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              DNI
            </label>

            <Input
              placeholder="12345678"
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
                placeholder="3434567890"
                {...form.register("telefono")}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Mail
              </label>

              <Input
                placeholder="paciente@mail.com"
                {...form.register("email")}
              />
            </div>
          </div>

          {/* Localidad / Obra social */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Localidad
              </label>

              <Input
                placeholder="Paraná"
                {...form.register("localidad")}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Obra social
              </label>

              <Input
                placeholder="IOSPER"
                {...form.register("obraSocial")}
              />
            </div>
          </div>

          {/* Observaciones */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Observaciones
            </label>

            <textarea
              className="w-full min-h-[100px] rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Notas administrativas..."
              {...form.register("observaciones")}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
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