// types.ts  — shared across agenda components

export type EstadoTurno =
  | "PENDIENTE"
  | "CONFIRMADO"
  | "EN_SALA"
  | "ATENDIDO"
  | "CANCELADO"

export type Turno = {
  id: string
  fecha: string
  hora?: string          // "HH:MM" extraído del campo fecha
  estado: EstadoTurno

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

export type Medico = {
  id: string
  nombre: string
  apellido: string
}

export const ESTADO_CONFIG: Record<
  EstadoTurno,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  PENDIENTE: {
    label: "Pendiente",
    color: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
  CONFIRMADO: {
    label: "Confirmado",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  EN_SALA: {
    label: "En sala",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-300",
    dot: "bg-amber-500",
  },
  ATENDIDO: {
    label: "Atendido",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  CANCELADO: {
    label: "Cancelado",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
    dot: "bg-rose-400",
  },
}

// ── Helpers ────────────────────────────────────────────────────────────────

/** Genera slots de 30 min entre startH y endH */
export function generarSlots(
  startH: number = 8,
  endH: number = 20
): string[] {
  const slots: string[] = []
  for (let h = startH; h < endH; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`)
    slots.push(`${String(h).padStart(2, "0")}:30`)
  }
  return slots
}

/** Extrae "HH:MM" de un string datetime local (sin usar toISOString) */
export function extraerHora(fechaStr: string): string {
  // Acepta "2024-05-15T14:30:00", "14:30", etc.
  const match = fechaStr.match(/T(\d{2}:\d{2})/) || fechaStr.match(/^(\d{2}:\d{2})/)
  return match ? match[1] : "00:00"
}

/** Fecha local formato sv-SE (YYYY-MM-DD) sin toISOString */
export function fechaLocalISO(d: Date): string {
  return d.toLocaleDateString("sv-SE")
}

/** Hora actual "HH:MM" */
export function horaActual(): string {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
}

/** Índice de slot (0-based) para una hora "HH:MM", con base en startH */
export function slotIndex(hora: string, startH = 8): number {
  const [h, m] = hora.split(":").map(Number)
  return (h - startH) * 2 + (m >= 30 ? 1 : 0)
}
