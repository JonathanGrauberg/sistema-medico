// components/AgendaGrid.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { Plus } from "lucide-react"
import { Turno, Medico, generarSlots, extraerHora, horaActual, slotIndex } from "@/components/agenda/types"
import { TurnoBlock } from "./TurnoBlock"

const SLOT_HEIGHT = 72     // px por slot de 30 min
const TIME_COL_W = 72      // px columna de tiempo
const DOCTOR_COL_W = 220   // px mínimo por columna de médico

interface AgendaGridProps {
  turnos: Turno[]
  medicos: Medico[]
  loading: boolean
  onUpdateEstado: (id: string, estado: string) => Promise<void>
  onTurnoClick: (turno: Turno) => void
  onSlotClick: (medicoId: string, hora: string) => void
}

export function AgendaGrid({
  turnos,
  medicos,
  loading,
  onUpdateEstado,
  onTurnoClick,
  onSlotClick,
}: AgendaGridProps) {
  const slots = generarSlots(8, 20)
  const gridRef = useRef<HTMLDivElement>(null)
  const [currentSlot, setCurrentSlot] = useState<number | null>(null)

  // Línea de hora actual
  useEffect(() => {
    function updateLine() {
      const hora = horaActual()
      const [h, m] = hora.split(":").map(Number)
      if (h < 8 || h >= 20) {
        setCurrentSlot(null)
        return
      }
      // píxeles desde el top del grid
      const minutosDesde8 = (h - 8) * 60 + m
      setCurrentSlot(Math.round((minutosDesde8 / 30) * SLOT_HEIGHT))
    }

    updateLine()
    const id = setInterval(updateLine, 60_000)
    return () => clearInterval(id)
  }, [])

  // Scroll a hora actual al montar
  useEffect(() => {
    if (gridRef.current && currentSlot !== null) {
      const scrollTo = Math.max(0, currentSlot - SLOT_HEIGHT * 2)
      gridRef.current.scrollTop = scrollTo
    }
  }, []) // solo al montar

  // Map: medicoId → hora → Turno[]
  const turnosByMedicoHora = new Map<string, Map<string, Turno[]>>()
  medicos.forEach((m) => turnosByMedicoHora.set(m.id, new Map()))

  turnos.forEach((t) => {
    const hora = extraerHora(t.fecha)
    // Normaliza a slot más cercano de 30 min
    const [h, min] = hora.split(":").map(Number)
    const slotMin = min < 15 ? "00" : min < 45 ? "30" : "00"
    const slotH = min >= 45 ? (h + 1 < 20 ? h + 1 : h) : h
    const slotKey = `${String(slotH).padStart(2, "0")}:${slotMin}`

    const medicoMap = turnosByMedicoHora.get(t.medico.id)
    if (!medicoMap) return
    const arr = medicoMap.get(slotKey) || []
    arr.push(t)
    medicoMap.set(slotKey, arr)
  })

  if (loading) {
    return <AgendaGridSkeleton slots={slots} medicos={medicos} />
  }

  if (medicos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
        <div className="rounded-full bg-slate-100 p-6">
          <svg className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-sm font-medium">No hay turnos para este día</p>
        <p className="text-xs">Usá el botón "Nuevo turno" para agregar uno</p>
      </div>
    )
  }

  return (
    /* Wrapper scrollable horizontal + vertical */
    <div
      ref={gridRef}
      className="flex-1 overflow-auto"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* Contenedor mínimo */}
      <div
        style={{
          minWidth: TIME_COL_W + medicos.length * DOCTOR_COL_W,
        }}
      >
        {/* ── STICKY HEADER COLUMNAS ───────────────────── */}
        <div
          className="sticky top-0 z-20 flex border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm"
          style={{ height: 52 }}
        >
          {/* Corner vacío */}
          <div style={{ minWidth: TIME_COL_W, width: TIME_COL_W }} className="border-r border-slate-100" />

          {/* Cabeceras médicos */}
          {medicos.map((m, i) => (
            <div
              key={m.id}
              className="flex flex-1 items-center justify-center gap-2 px-4 border-r border-slate-100 last:border-r-0"
              style={{ minWidth: DOCTOR_COL_W }}
            >
              {/* Avatar inicial */}
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white shadow-sm">
                {m.nombre.charAt(0)}{m.apellido.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-slate-800 truncate leading-tight">
                  {m.nombre} {m.apellido}
                </p>
                <p className="text-[11px] text-slate-400 leading-none">
                  {turnosByMedicoHora.get(m.id)?.size ?? 0} turnos
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── GRID HORARIO ─────────────────────────────── */}
        <div className="relative flex">
          {/* Línea de hora actual */}
          {currentSlot !== null && (
            <div
              className="absolute left-0 right-0 z-10 flex items-center pointer-events-none"
              style={{ top: currentSlot }}
            >
              <div
                className="flex items-center"
                style={{ width: TIME_COL_W }}
              >
                <span className="ml-2 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white leading-none shadow-sm">
                  {horaActual()}
                </span>
              </div>
              <div className="flex-1 h-px bg-rose-400 opacity-80 shadow-sm" />
            </div>
          )}

          {/* Columna de horas (sticky left) */}
          <div
            className="sticky left-0 z-10 shrink-0 bg-white border-r border-slate-100"
            style={{ width: TIME_COL_W }}
          >
            {slots.map((slot, i) => (
              <div
                key={slot}
                className="flex items-start justify-end pr-3 pt-2"
                style={{ height: SLOT_HEIGHT }}
              >
                {/* Solo mostrar en la hora en punto */}
                {slot.endsWith(":00") ? (
                  <span className="text-[11px] font-semibold tabular-nums text-slate-400 leading-none">
                    {slot}
                  </span>
                ) : (
                  <span className="text-[10px] tabular-nums text-slate-200 leading-none">
                    {slot}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Columnas por médico */}
          {medicos.map((m) => {
            const medicoMap = turnosByMedicoHora.get(m.id) || new Map()

            return (
              <div
                key={m.id}
                className="flex-1 border-r border-slate-100 last:border-r-0 relative"
                style={{ minWidth: DOCTOR_COL_W }}
              >
                {slots.map((slot, i) => {
                  const turnos = (medicoMap.get(slot) || []) as Turno[]
                  const isHalf = slot.endsWith(":30")

                  return (
                    <div
                      key={slot}
                      className={`relative group/slot px-2 py-1.5 border-b transition-colors
                        ${isHalf ? "border-slate-50" : "border-slate-100"}
                        ${turnos.length === 0 ? "hover:bg-blue-50/40 cursor-pointer" : ""}
                      `}
                      style={{ height: SLOT_HEIGHT }}
                      onClick={() =>
                        turnos.length === 0 && onSlotClick(m.id, slot)
                      }
                    >
                      {/* Turnos en este slot */}
                      {turnos.length > 0 ? (
                        <div className="flex flex-col gap-1 h-full">
                          {turnos.map((t) => (
                            <TurnoBlock
                              key={t.id}
                              turno={t}
                              hora={slot}
                              onUpdateEstado={onUpdateEstado}
                              onClick={onTurnoClick}
                            />
                          ))}
                        </div>
                      ) : (
                        /* Slot vacío — mostrar (+) en hover */
                        <div className="flex h-full items-center justify-center opacity-0 group-hover/slot:opacity-100 transition-opacity duration-150">
                          <div className="flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-1">
                            <Plus className="h-3 w-3 text-blue-500" />
                            <span className="text-[11px] text-blue-600 font-medium">{slot}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ── Skeleton ────────────────────────────────────────────────────────────── */
function AgendaGridSkeleton({
  slots,
  medicos,
}: {
  slots: string[]
  medicos: Medico[]
}) {
  const fakeDocs = medicos.length > 0 ? medicos : [
    { id: "a", nombre: "", apellido: "" },
    { id: "b", nombre: "", apellido: "" },
    { id: "c", nombre: "", apellido: "" },
  ]

  return (
    <div className="flex-1 overflow-hidden" style={{ minWidth: TIME_COL_W + fakeDocs.length * DOCTOR_COL_W }}>
      {/* Header skeleton */}
      <div className="flex border-b border-slate-200 bg-white" style={{ height: 52 }}>
        <div style={{ minWidth: TIME_COL_W }} className="border-r border-slate-100" />
        {fakeDocs.map((m) => (
          <div key={m.id} className="flex flex-1 items-center px-4 gap-3 border-r border-slate-100" style={{ minWidth: DOCTOR_COL_W }}>
            <div className="h-7 w-7 rounded-full bg-slate-200 animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-3 w-24 rounded bg-slate-200 animate-pulse" />
              <div className="h-2 w-12 rounded bg-slate-100 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Rows skeleton */}
      <div className="flex">
        <div style={{ minWidth: TIME_COL_W }} className="border-r border-slate-100">
          {slots.filter((_, i) => i % 2 === 0).slice(0, 8).map((s) => (
            <div key={s} className="flex justify-end pr-3 pt-2" style={{ height: SLOT_HEIGHT * 2 }}>
              <div className="h-2.5 w-8 rounded bg-slate-100 animate-pulse" />
            </div>
          ))}
        </div>

        {fakeDocs.map((m, col) => (
          <div key={m.id} className="flex-1 border-r border-slate-100" style={{ minWidth: DOCTOR_COL_W }}>
            {slots.map((s, i) => (
              <div key={s} style={{ height: SLOT_HEIGHT }} className="px-2 py-1.5 border-b border-slate-50">
                {/* Mostrar algunos bloques skeleton al azar */}
                {(i + col) % 5 === 0 && (
                  <div className="h-full rounded-lg bg-slate-100 animate-pulse" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
