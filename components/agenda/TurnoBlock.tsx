// components/TurnoBlock.tsx
"use client"

import { useState } from "react"
import {
  Check,
  Clock3,
  UserCheck,
  X,
  MoreVertical,
  User,
} from "lucide-react"
import { Turno, ESTADO_CONFIG, EstadoTurno } from "@/components/agenda/types"
import { EstadoBadge } from "./EstadoBadge"

interface TurnoBlockProps {
  turno: Turno
  hora: string
  onUpdateEstado: (id: string, estado: string) => Promise<void>
  onClick: (turno: Turno) => void
}

export function TurnoBlock({ turno, hora, onUpdateEstado, onClick }: TurnoBlockProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [updating, setUpdating] = useState(false)

  const cfg = ESTADO_CONFIG[turno.estado]

  async function handleUpdate(estado: string, e: React.MouseEvent) {
    e.stopPropagation()
    setUpdating(true)
    setMenuOpen(false)
    try {
      await onUpdateEstado(turno.id, estado)
    } finally {
      setUpdating(false)
    }
  }

  // Accent color left border per estado
  const accentBorder: Record<EstadoTurno, string> = {
    PENDIENTE: "border-l-slate-300",
    CONFIRMADO: "border-l-blue-500",
    EN_SALA: "border-l-amber-500",
    ATENDIDO: "border-l-emerald-500",
    CANCELADO: "border-l-rose-400",
  }

  const accentGlow: Record<EstadoTurno, string> = {
    PENDIENTE: "",
    CONFIRMADO: "",
    EN_SALA: "ring-1 ring-amber-200",
    ATENDIDO: "",
    CANCELADO: "opacity-60",
  }

  return (
    <div
      onClick={() => onClick(turno)}
      className={`
        relative group flex flex-col gap-1 rounded-lg border border-l-[3px] px-3 py-2.5 cursor-pointer
        bg-white shadow-sm hover:shadow-md transition-all duration-150
        ${cfg.border} ${accentBorder[turno.estado]} ${accentGlow[turno.estado]}
        hover:-translate-y-0.5 hover:scale-[1.01]
        ${updating ? "opacity-50 pointer-events-none" : ""}
      `}
      style={{ minHeight: "68px" }}
    >
      {/* Paciente en sala pulse */}
      {turno.estado === "EN_SALA" && (
        <span className="absolute top-2 right-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
        </span>
      )}

      {/* Hora + badge */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold tabular-nums text-slate-500 leading-none">
          {hora}
        </span>
        <EstadoBadge estado={turno.estado} />
      </div>

      {/* Nombre */}
      <p className="text-[13px] font-semibold text-slate-800 leading-tight truncate">
        {turno.paciente.nombre} {turno.paciente.apellido}
      </p>

      {/* DNI */}
      <p className="text-[11px] text-slate-400 leading-none flex items-center gap-1">
        <User className="h-3 w-3" />
        DNI {turno.paciente.dni}
      </p>

      {/* Acciones rápidas — aparecen en hover */}
      <div
        className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-1 rounded-b-lg
          bg-gradient-to-t from-white/95 to-transparent px-2.5 pb-2 pt-5
          opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {turno.estado === "PENDIENTE" && (
          <>
            <ActionButton
              icon={<Check className="h-3 w-3" />}
              label="Confirmar"
              color="blue"
              onClick={(e) => handleUpdate("CONFIRMADO", e)}
            />
            <ActionButton
              icon={<X className="h-3 w-3" />}
              label="Cancelar"
              color="rose"
              onClick={(e) => handleUpdate("CANCELADO", e)}
            />
          </>
        )}

        {turno.estado === "CONFIRMADO" && (
          <>
            <ActionButton
              icon={<Clock3 className="h-3 w-3" />}
              label="A sala"
              color="amber"
              onClick={(e) => handleUpdate("EN_SALA", e)}
            />
            <ActionButton
              icon={<X className="h-3 w-3" />}
              label="Cancelar"
              color="rose"
              onClick={(e) => handleUpdate("CANCELADO", e)}
            />
          </>
        )}

        {turno.estado === "EN_SALA" && (
          <ActionButton
            icon={<UserCheck className="h-3 w-3" />}
            label="Atendido"
            color="emerald"
            onClick={(e) => handleUpdate("ATENDIDO", e)}
          />
        )}
      </div>
    </div>
  )
}

function ActionButton({
  icon,
  label,
  color,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  color: "blue" | "rose" | "amber" | "emerald"
  onClick: (e: React.MouseEvent) => void
}) {
  const colors = {
    blue: "bg-blue-500 hover:bg-blue-600 text-white",
    rose: "bg-rose-500 hover:bg-rose-600 text-white",
    amber: "bg-amber-500 hover:bg-amber-600 text-white",
    emerald: "bg-emerald-500 hover:bg-emerald-600 text-white",
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors shadow-sm ${colors[color]}`}
    >
      {icon}
      {label}
    </button>
  )
}
