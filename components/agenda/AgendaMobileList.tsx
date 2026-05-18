// components/AgendaMobileList.tsx
"use client"

import { Turno, extraerHora } from "@/components/agenda/types"
import { TurnoBlock } from "./TurnoBlock"
import { generarSlots } from "@/components/agenda/types"

interface AgendaMobileListProps {
  turnos: Turno[]
  loading: boolean
  onUpdateEstado: (id: string, estado: string) => Promise<void>
  onTurnoClick: (turno: Turno) => void
}

export function AgendaMobileList({
  turnos,
  loading,
  onUpdateEstado,
  onTurnoClick,
}: AgendaMobileListProps) {
  if (loading) {
    return (
      <div className="space-y-2 p-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-slate-100 animate-pulse"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    )
  }

  if (turnos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
        <p className="text-sm font-medium">No hay turnos</p>
        <p className="text-xs">Usá el botón "Nuevo turno"</p>
      </div>
    )
  }

  // Agrupar por hora
  const byHora = new Map<string, Turno[]>()
  turnos.forEach((t) => {
    const hora = extraerHora(t.fecha)
    const arr = byHora.get(hora) || []
    arr.push(t)
    byHora.set(hora, arr)
  })

  const horas = Array.from(byHora.entries()).sort(([a], [b]) => a.localeCompare(b))

  return (
    <div className="divide-y divide-slate-100">
      {horas.map(([hora, turnosHora]) => (
        <div key={hora} className="px-4 py-3">
          <p className="mb-2 text-xs font-bold tabular-nums text-slate-400 uppercase tracking-wider">
            {hora}
          </p>
          <div className="space-y-2">
            {turnosHora.map((t) => (
              <TurnoBlock
                key={t.id}
                turno={t}
                hora={hora}
                onUpdateEstado={onUpdateEstado}
                onClick={onTurnoClick}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
