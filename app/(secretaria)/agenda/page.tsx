"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Plus,
  Search,
  UserCheck,
  X,
} from "lucide-react"

import {TurnoModal} from "@/components/turno-modal"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Turno = {
  id: string

  fecha: string
  estado:
    | "PENDIENTE"
    | "CONFIRMADO"
    | "EN_SALA"
    | "ATENDIDO"
    | "CANCELADO"

  paciente: {
    nombre: string
    apellido: string
    dni: string
  }

  medico: {
  id: string
  nombre: string
  apellido: string
}
}

export default function AgendaSecretariaPage() {
  const searchParams = useSearchParams()

  const [turnos, setTurnos] = useState<Turno[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [medico, setMedico] = useState("todos")

  const [fecha, setFecha] = useState(new Date())

  const [openModal, setOpenModal] = useState(false)

  // ─────────────────────────────────────────────
  // Abrir modal automático ?nuevo=1
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (searchParams.get("nuevo") === "1") {
      setOpenModal(true)
    }
  }, [searchParams])

  // ─────────────────────────────────────────────
  // Fetch turnos
  // ─────────────────────────────────────────────
  useEffect(() => {
    const fechaISO = fecha.toISOString().split("T")[0]

    setLoading(true)

    fetch(`/api/turnos?fecha=${fechaISO}`)
      .then((res) => res.json())
      .then(setTurnos)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [fecha])

  // ─────────────────────────────────────────────
  // Médicos únicos
  // ─────────────────────────────────────────────
  const medicos = useMemo(() => {
    const unique = new Map()

    turnos.forEach((t) => {
      unique.set(
        t.medico.id,
        `${t.medico.nombre} ${t.medico.apellido}`
      )
    })

    return Array.from(unique.entries())
  }, [turnos])

  // ─────────────────────────────────────────────
  // Filtrado
  // ─────────────────────────────────────────────
  const filtered = turnos.filter((turno) => {
    const text = search.toLowerCase()

    const matchesSearch =
      `${turno.paciente.nombre} ${turno.paciente.apellido}`
        .toLowerCase()
        .includes(text) ||
      turno.paciente.dni.includes(text) ||
      `${turno.medico.nombre} ${turno.medico.apellido}`
        .toLowerCase()
        .includes(text)

    const matchesMedico =
      medico === "todos" ||
      turno.medico.id === medico

    return matchesSearch && matchesMedico
  })

  // ─────────────────────────────────────────────
  // Cambiar estado
  // ─────────────────────────────────────────────
  async function updateEstado(
    turnoId: string,
    estado: string
  ) {
    try {
      await fetch(`/api/turnos/${turnoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado }),
      })

      setTurnos((prev) =>
        prev.map((t) =>
          t.id === turnoId ? { ...t, estado: estado as any } : t
        )
      )
    } catch (error) {
      console.error(error)
    }
  }

  // ─────────────────────────────────────────────
  // Fecha label
  // ─────────────────────────────────────────────
  const fechaLabel = fecha.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-tight">
            Agenda
          </h1>

          <p className="text-muted-foreground capitalize">
            {fechaLabel}
          </p>
        </div>

        <Button onClick={() => setOpenModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo turno
        </Button>
      </div>

      {/* NAVEGACIÓN */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setFecha((prev) => {
              const next = new Date(prev)
              next.setDate(next.getDate() - 1)
              return next
            })
          }
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          onClick={() => setFecha(new Date())}
        >
          Hoy
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setFecha((prev) => {
              const next = new Date(prev)
              next.setDate(next.getDate() + 1)
              return next
            })
          }
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* FILTROS */}
      <div className="grid gap-3 lg:grid-cols-[1fr_240px]">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder="Buscar paciente, DNI o médico..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={medico} onValueChange={setMedico}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar médico" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="todos">
              Todos los médicos
            </SelectItem>

            {medicos.map(([id, nombre]) => (
              <SelectItem key={id} value={id}>
                {nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* LISTA */}
      <div className="space-y-3">
        {loading ? (
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              Cargando agenda...
            </CardContent>
          </Card>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              No hay turnos
            </CardContent>
          </Card>
        ) : (
          filtered.map((turno) => (
            <Card key={turno.id}>
              <CardContent className="p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* INFO */}
                <div className="space-y-1">
                  <p className="font-semibold">
                    {turno.paciente.nombre}{" "}
                    {turno.paciente.apellido}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    DNI: {turno.paciente.dni}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Dr/a. {turno.medico.nombre}{" "}
                    {turno.medico.apellido}
                  </p>
                </div>

                {/* ESTADO */}
                <div className="flex items-center gap-2 flex-wrap">
                  <EstadoBadge estado={turno.estado} />

                  {turno.estado === "PENDIENTE" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() =>
                          updateEstado(
                            turno.id,
                            "CONFIRMADO"
                          )
                        }
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Confirmar
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          updateEstado(
                            turno.id,
                            "CANCELADO"
                          )
                        }
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancelar
                      </Button>
                    </>
                  )}

                  {turno.estado === "CONFIRMADO" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() =>
                          updateEstado(
                            turno.id,
                            "EN_SALA"
                          )
                        }
                      >
                        <Clock3 className="mr-2 h-4 w-4" />
                        Pasar a sala
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          updateEstado(
                            turno.id,
                            "CANCELADO"
                          )
                        }
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancelar
                      </Button>
                    </>
                  )}

                  {turno.estado === "EN_SALA" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        updateEstado(
                          turno.id,
                          "ATENDIDO"
                        )
                      }
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      Marcar atendido
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* MODAL */}
      <TurnoModal
        open={openModal}
        onOpenChange={setOpenModal}
      />
    </div>
  )
}

function EstadoBadge({
  estado,
}: {
  estado: Turno["estado"]
}) {
  const styles = {
    PENDIENTE:
      "bg-slate-100 text-slate-700 border-slate-200",

    CONFIRMADO:
      "bg-blue-100 text-blue-700 border-blue-200",

    EN_SALA:
      "bg-amber-100 text-amber-700 border-amber-200",

    ATENDIDO:
      "bg-emerald-100 text-emerald-700 border-emerald-200",

    CANCELADO:
      "bg-rose-100 text-rose-700 border-rose-200",
  }

  return (
    <div
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles[estado]}`}
    >
      {estado.replace("_", " ")}
    </div>
  )
}