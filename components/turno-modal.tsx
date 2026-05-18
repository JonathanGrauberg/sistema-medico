"use client"

import { useEffect, useRef, useState, useCallback } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Loader2,
  Trash2,
  Search,
  User,
  Stethoscope,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  Heart,
  X,
  CheckCircle2,
  ChevronRight,
} from "lucide-react"

import { toast } from "sonner"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface Paciente {
  id: string
  nombre: string
  apellido: string
  dni?: string
  obraSocial?: string
}

interface Medico {
  id: string
  nombre: string
  apellido: string
  especialidad?: string
}

interface TurnoData {
  id: string
  pacienteId: string
  medicoId: string
  fecha: string | Date
  practica?: string
  motivo?: string
  observaciones?: string
  obraSocial?: string
}

interface TurnoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fecha?: string | Date
  turno?: TurnoData
  onCreated?: () => void
  onDeleted?: () => void
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function formatFecha(fecha: string | Date | undefined): string {
  if (!fecha) return ""
  const d = new Date(fecha)
  return d.toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatHora(fecha: string | Date | undefined): string {
  if (!fecha) return ""
  const d = new Date(fecha)
  return d.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * Converts a Date (or string) to the value needed by <input type="date">
 * i.e. "YYYY-MM-DD" in local time.
 */
function toDateInputValue(fecha: string | Date | undefined): string {
  if (!fecha) return ""
  const d = new Date(fecha)
  if (isNaN(d.getTime())) return ""
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/**
 * Converts a Date (or string) to the value needed by <input type="time">
 * i.e. "HH:MM" in local time.
 */
function toTimeInputValue(fecha: string | Date | undefined): string {
  if (!fecha) return ""
  const d = new Date(fecha)
  if (isNaN(d.getTime())) return ""
  const hours = String(d.getHours()).padStart(2, "0")
  const minutes = String(d.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}

/**
 * Merges a date string ("YYYY-MM-DD") and a time string ("HH:MM") into
 * a local datetime string ("YYYY-MM-DD HH:MM:00") that the backend can
 * consume without timezone conversion.
 *
 * ⚠️  We intentionally avoid .toISOString() here because it converts to UTC.
 * Argentina is UTC-3: midnight local → "previous day T21:00:00Z" in UTC,
 * which would shift the turno to the wrong day in the agenda.
 *
 * The agenda's fetch already uses toLocaleDateString("sv-SE") (which produces
 * "YYYY-MM-DD" in local time) so we must stay in the same local-time domain.
 */
function mergeDateAndTime(dateStr: string, timeStr: string): string {
  if (!dateStr) return ""
  const time = timeStr || "00:00"
  return `${dateStr} ${time}:00`
}

// ─────────────────────────────────────────────
// Fetches — separated for future React Query adoption
// ─────────────────────────────────────────────

async function fetchPacientes(): Promise<Paciente[]> {
  const res = await fetch("/api/pacientes")
  if (!res.ok) throw new Error("Error cargando pacientes")
  return res.json()
}

async function fetchMedicos(): Promise<Medico[]> {
  const res = await fetch("/api/medicos")
  if (!res.ok) throw new Error("Error cargando médicos")
  return res.json()
}

async function createTurno(body: Record<string, unknown>): Promise<void> {
  const res = await fetch("/api/turnos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? "Error al crear turno")
  }
}

async function updateTurno(
  id: string,
  body: Record<string, unknown>
): Promise<void> {
  const res = await fetch(`/api/turnos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? "Error al actualizar turno")
  }
}

async function deleteTurno(id: string): Promise<void> {
  const res = await fetch(`/api/turnos/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Error eliminando turno")
}

// ─────────────────────────────────────────────
// Subcomponent: SectionLabel
// ─────────────────────────────────────────────

function SectionLabel({
  icon: Icon,
  label,
}: {
  icon: React.ElementType
  label: string
}) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────
// Subcomponent: PacienteBuscador
// ─────────────────────────────────────────────

function PacienteBuscador({
  pacientes,
  selectedId,
  onSelect,
  disabled,
}: {
  pacientes: Paciente[]
  selectedId: string
  onSelect: (id: string) => void
  disabled?: boolean
}) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  // Keyboard navigation: index of highlighted result
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const selected = pacientes.find((p) => p.id === selectedId)

  const filtered = query.trim()
    ? pacientes.filter((p) => {
        const q = query.toLowerCase()
        return (
          p.nombre.toLowerCase().includes(q) ||
          p.apellido.toLowerCase().includes(q) ||
          (p.dni && p.dni.includes(q))
        )
      })
    : pacientes.slice(0, 8)

  // Reset active index whenever list changes
  useEffect(() => {
    setActiveIndex(-1)
  }, [filtered.length, query])

  // Scroll highlighted item into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return
    const items = listRef.current.querySelectorAll<HTMLButtonElement>(
      "[data-paciente-item]"
    )
    items[activeIndex]?.scrollIntoView({ block: "nearest" })
  }, [activeIndex])

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = useCallback(
    (id: string) => {
      onSelect(id)
      setOpen(false)
      setQuery("")
      setActiveIndex(-1)
    },
    [onSelect]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (activeIndex >= 0 && filtered[activeIndex]) {
        handleSelect(filtered[activeIndex].id)
      }
    } else if (e.key === "Escape") {
      e.preventDefault()
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  if (selected && !open) {
    return (
      <div
        className={cn(
          "flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2.5 cursor-pointer hover:bg-muted/70 transition-colors",
          disabled && "pointer-events-none opacity-60"
        )}
        onClick={() => {
          if (!disabled) {
            setQuery("")
            setOpen(true)
            setTimeout(() => inputRef.current?.focus(), 50)
          }
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <User className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium leading-none">
              {selected.apellido}, {selected.nombre}
            </p>
            {selected.dni && (
              <p className="text-xs text-muted-foreground mt-0.5">
                DNI {selected.dni}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full"
            onClick={(e) => {
              e.stopPropagation()
              onSelect("")
            }}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder="Buscar por nombre, apellido o DNI..."
          value={query}
          disabled={disabled}
          className="pl-9 pr-4"
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          aria-autocomplete="list"
          aria-expanded={open}
          role="combobox"
        />
      </div>

      {open && (
        <div
          className="absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-lg overflow-hidden"
          role="listbox"
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <User className="w-8 h-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">
                No se encontraron pacientes
              </p>
            </div>
          ) : (
            <div
              ref={listRef}
              className="max-h-48 overflow-y-auto divide-y divide-border/50"
            >
              {filtered.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  data-paciente-item
                  role="option"
                  aria-selected={idx === activeIndex}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/60 transition-colors text-left",
                    idx === activeIndex && "bg-muted/60"
                  )}
                  onClick={() => handleSelect(p.id)}
                >
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {p.apellido}, {p.nombre}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {p.dni && (
                        <span className="text-xs text-muted-foreground">
                          DNI {p.dni}
                        </span>
                      )}
                      {p.obraSocial && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] h-4 px-1.5"
                        >
                          {p.obraSocial}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          )}
          {pacientes.length > 8 && !query && (
            <div className="px-3 py-1.5 bg-muted/30 border-t">
              <p className="text-xs text-muted-foreground">
                Escribí para filtrar ({pacientes.length} pacientes)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export function TurnoModal({
  open,
  onOpenChange,
  fecha,
  turno,
  onCreated,
  onDeleted,
}: TurnoModalProps) {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [loadingData, setLoadingData] = useState(false)

  const [pacienteId, setPacienteId] = useState("")
  const [medicoId, setMedicoId] = useState("")
  const [practica, setPractica] = useState("")
  const [motivo, setMotivo] = useState("")
  const [observaciones, setObservaciones] = useState("")
  const [obraSocial, setObraSocial] = useState("")

  // ── Editable date/time state ──────────────────
  // Initialised from the `fecha` prop or the `turno.fecha` field.
  // We keep them as strings to feed <input type="date"> and <input type="time">.
  const [fechaInput, setFechaInput] = useState("")
  const [horaInput, setHoraInput] = useState("")

  const [loading, setLoading] = useState(false)

  const isEdit = !!turno

  // ─── Fetch data ───
  useEffect(() => {
    if (!open) return

    setLoadingData(true)

    // Separated fetch functions — ready for React Query migration
    Promise.all([fetchPacientes(), fetchMedicos()])
      .then(([p, m]) => {
        setPacientes(p)
        setMedicos(m)
      })
      .catch(() => toast.error("Error cargando datos"))
      .finally(() => setLoadingData(false))
  }, [open])

  // ─── Populate / reset form ───
  useEffect(() => {
    if (turno) {
      setPacienteId(turno.pacienteId ?? "")
      setMedicoId(turno.medicoId ?? "")
      setPractica(turno.practica ?? "")
      setMotivo(turno.motivo ?? "")
      setObservaciones(turno.observaciones ?? "")
      setObraSocial(turno.obraSocial ?? "")
      // Populate editable date/time from existing turno
      setFechaInput(toDateInputValue(turno.fecha))
      setHoraInput(toTimeInputValue(turno.fecha))
    } else {
      setPacienteId("")
      setMedicoId("")
      setPractica("")
      setMotivo("")
      setObservaciones("")
      setObraSocial("")
      // Populate editable date/time from the `fecha` prop (slot selected in calendar)
      setFechaInput(toDateInputValue(fecha))
      setHoraInput(toTimeInputValue(fecha))
    }
  }, [turno, open, fecha])

  // ─── Auto-fill & clear obra social from paciente ───
  useEffect(() => {
    if (!pacienteId) {
      // Quitar paciente → limpiar obra social para evitar basura visual
      setObraSocial("")
      return
    }
    if (isEdit) return
    const p = pacientes.find((x) => x.id === pacienteId)
    if (p?.obraSocial) setObraSocial(p.obraSocial)
  }, [pacienteId, pacientes, isEdit])

  // ─── Build fecha ISO para el body (fecha editable) ───
  const buildFechaISO = useCallback((): string | null => {
    if (!fechaInput) return null
    return mergeDateAndTime(fechaInput, horaInput)
  }, [fechaInput, horaInput])

  // ─── Validar fecha/hora ───
  const validateFechaHora = (): boolean => {
    if (!fechaInput) {
      toast.error("Seleccioná una fecha para el turno")
      return false
    }
    const merged = mergeDateAndTime(fechaInput, horaInput)
    if (!merged || isNaN(new Date(merged).getTime())) {
      toast.error("La fecha u hora del turno no es válida")
      return false
    }
    return true
  }

  // ─── Crear ───
  const handleSubmit = async () => {
    if (!pacienteId) {
      toast.error("Seleccioná un paciente")
      return
    }
    if (!medicoId) {
      toast.error("Seleccioná un médico")
      return
    }
    if (!validateFechaHora()) return

    try {
      setLoading(true)
      await createTurno({
        pacienteId,
        medicoId,
        fecha: buildFechaISO(),
        practica,
        motivo,
        observaciones,
        obraSocial,
      })
      toast.success("Turno creado correctamente")
      onCreated?.()
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al crear turno")
    } finally {
      setLoading(false)
    }
  }

  // ─── Editar ───
  const handleUpdate = async () => {
    if (!turno?.id) return
    if (!pacienteId) {
      toast.error("Seleccioná un paciente")
      return
    }
    if (!medicoId) {
      toast.error("Seleccioná un médico")
      return
    }
    if (!validateFechaHora()) return

    try {
      setLoading(true)
      await updateTurno(turno.id, {
        pacienteId,
        medicoId,
        fecha: buildFechaISO(),
        practica,
        motivo,
        observaciones,
        obraSocial,
      })
      toast.success("Turno actualizado")
      onCreated?.()
      onOpenChange(false)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error al actualizar turno"
      )
    } finally {
      setLoading(false)
    }
  }

  // ─── Eliminar ───
  const handleDelete = async () => {
    if (!turno?.id) return

    try {
      setLoading(true)
      await deleteTurno(turno.id)
      toast.success("Turno eliminado")
      onDeleted?.()
      onOpenChange(false)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error eliminando turno"
      )
    } finally {
      setLoading(false)
    }
  }

  const selectedMedico = medicos.find((m) => m.id === medicoId)

  // Preview label shown in the header (uses edited values, not the original prop)
  const fechaPreviewLabel = fechaInput
    ? formatFecha(new Date(fechaInput + "T00:00:00"))
    : formatFecha(fecha)

  const horaPreviewLabel = horaInput
    ? horaInput
    : formatHora(fecha)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
        {/* ── Header ── */}
        <div className="bg-primary/5 border-b px-6 py-4">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Calendar className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold leading-none">
                  {isEdit ? "Editar Turno" : "Nuevo Turno"}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-1">
                  {isEdit
                    ? "Modificá los datos del turno médico"
                    : "Completá los datos para registrar el turno"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Fecha preview — always shows current edited values */}
          {(fecha || isEdit) && (
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span className="capitalize">{fechaPreviewLabel}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>{horaPreviewLabel || "—"}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
          {loadingData ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Cargando datos...</p>
            </div>
          ) : (
            <>
              {/* ── Paciente ── */}
              <div>
                <SectionLabel icon={User} label="Paciente" />
                <PacienteBuscador
                  pacientes={pacientes}
                  selectedId={pacienteId}
                  onSelect={setPacienteId}
                  disabled={loading}
                />
              </div>

              <Separator />

              {/* ── Médico ── */}
              <div>
                <SectionLabel icon={Stethoscope} label="Médico" />
                <Select
                  value={medicoId}
                  onValueChange={setMedicoId}
                  disabled={loading}
                >
                  <SelectTrigger
                    className={cn(
                      "h-10",
                      medicoId &&
                        "border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/20"
                    )}
                  >
                    <SelectValue placeholder="Seleccionar médico..." />
                  </SelectTrigger>
                  <SelectContent>
                    {medicos.length === 0 ? (
                      <div className="flex items-center justify-center py-4">
                        <p className="text-sm text-muted-foreground">
                          No hay médicos disponibles
                        </p>
                      </div>
                    ) : (
                      medicos.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          <div className="flex items-center gap-2">
                            <span>
                              Dr/a. {m.apellido}, {m.nombre}
                            </span>
                            {m.especialidad && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] h-4 px-1.5"
                              >
                                {m.especialidad}
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>

                {selectedMedico && (
                  <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    {selectedMedico.especialidad
                      ? `Especialidad: ${selectedMedico.especialidad}`
                      : "Médico seleccionado"}
                  </p>
                )}
              </div>

              <Separator />

              {/* ── Fecha y Hora (editables) ── */}
              <div>
                <SectionLabel icon={Calendar} label="Fecha y hora" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-medium">
                      Fecha
                    </label>
                    <Input
                      type="date"
                      value={fechaInput}
                      onChange={(e) => setFechaInput(e.target.value)}
                      disabled={loading}
                      className={cn(
                        "h-10 cursor-pointer",
                        !fechaInput && "text-muted-foreground"
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-medium">
                      Hora
                    </label>
                    <Input
                      type="time"
                      value={horaInput}
                      onChange={(e) => setHoraInput(e.target.value)}
                      disabled={loading}
                      className={cn(
                        "h-10 cursor-pointer",
                        !horaInput && "text-muted-foreground"
                      )}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* ── Práctica y Motivo ── */}
              <div>
                <SectionLabel icon={FileText} label="Detalle del turno" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-medium">
                      Práctica
                    </label>
                    <Input
                      placeholder="Ej: Consulta clínica"
                      value={practica}
                      onChange={(e) => setPractica(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-medium">
                      Motivo
                    </label>
                    <Input
                      placeholder="Ej: Control anual"
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* ── Obra Social ── */}
              <div>
                <SectionLabel icon={Heart} label="Cobertura médica" />
                <Input
                  placeholder="Obra social o prepaga"
                  value={obraSocial}
                  onChange={(e) => setObraSocial(e.target.value)}
                  disabled={loading}
                />
                {obraSocial && (
                  <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    El coseguro se registra en el check-in
                  </p>
                )}
              </div>

              {/* ── Observaciones ── */}
              <div>
                <SectionLabel icon={MessageSquare} label="Observaciones" />
                <Textarea
                  placeholder="Indicaciones previas, alergias, notas del turno..."
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  disabled={loading}
                  className="resize-none"
                  rows={3}
                />
              </div>
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="border-t bg-muted/20 px-6 py-4 flex items-center justify-between gap-3">
          {isEdit ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={loading}
              className="gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Eliminar turno
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={isEdit ? handleUpdate : handleSubmit}
              disabled={loading || loadingData}
              className="gap-1.5 min-w-[100px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {isEdit ? "Guardando..." : "Creando..."}
                </>
              ) : isEdit ? (
                "Guardar cambios"
              ) : (
                "Confirmar turno"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
