"use client"

import { useState } from "react"

import {
  ArrowLeft,
  Loader2,
  Save,
  User as UserIcon,
} from "lucide-react"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"

import type { User } from "@/lib/types"

interface Props {
  user: User

  onBack?: () => void

  onUpdated?: (user: User) => void
}

export function SecretariaPatientDetails({
  user,
  onBack,
  onUpdated,
}: Props) {
  const [loading, setLoading] =
    useState(false)

  const [form, setForm] = useState({
    telefono: user.telefono || "",
    email: user.email || "",

    localidad: user.localidad || "",

    obraSocial: user.obraSocial || "",

    observaciones:
      user.observaciones || "",
  })

  // ─────────────────────────────────────────────
  // Save
  // ─────────────────────────────────────────────
  const handleSave = async () => {
    setLoading(true)

    try {
      const res = await fetch(
        `/api/paciente/${user.id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(form),
        }
      )

      if (!res.ok) {
        throw new Error()
      }

      const updated = await res.json()

      toast.success(
        "Paciente actualizado"
      )

      onUpdated?.(updated)
    } catch {
      toast.error(
        "Error actualizando paciente"
      )
    } finally {
      setLoading(false)
    }
  }

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}

          <div>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />

              {user.nombre} {user.apellido}
            </CardTitle>

            <CardDescription>
              DNI: {user.dni}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Contacto */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Teléfono
            </label>

            <Input
              value={form.telefono}
              onChange={(e) =>
                setForm({
                  ...form,
                  telefono:
                    e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Mail
            </label>

            <Input
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email:
                    e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* Localidad / Obra Social */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Localidad
            </label>

            <Input
              value={form.localidad}
              onChange={(e) =>
                setForm({
                  ...form,
                  localidad:
                    e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Obra Social
            </label>

            <Input
              value={form.obraSocial}
              onChange={(e) =>
                setForm({
                  ...form,
                  obraSocial:
                    e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* Observaciones */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Observaciones
          </label>

          <textarea
            value={form.observaciones}
            onChange={(e) =>
              setForm({
                ...form,
                observaciones:
                  e.target.value,
              })
            }
            className="w-full min-h-[120px] rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        {/* Save */}
        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}

          Guardar Cambios
        </Button>
      </CardContent>
    </Card>
  )
}