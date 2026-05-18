// components/AgendaHeader.tsx
"use client"

import { ChevronLeft, ChevronRight, CalendarDays, Plus, LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fechaLocalISO } from "@/components/agenda/types"

interface AgendaHeaderProps {
  fecha: Date
  onPrev: () => void
  onNext: () => void
  onHoy: () => void
  onNuevoTurno: () => void
  vista: "dia" | "semana"
  onVistaChange: (v: "dia" | "semana") => void
  totalPacientes: number
}

export function AgendaHeader({
  fecha,
  onPrev,
  onNext,
  onHoy,
  onNuevoTurno,
  vista,
  onVistaChange,
  totalPacientes,
}: AgendaHeaderProps) {
  const esHoy = fechaLocalISO(fecha) === fechaLocalISO(new Date())

  const fechaLabel = fecha.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-3 gap-4">
        {/* LEFT — título + fecha */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm shadow-blue-200">
              <CalendarDays className="h-4.5 w-4.5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-none text-slate-900 tracking-tight">
                Agenda
              </h1>
              <p className="mt-0.5 text-xs text-slate-400 capitalize truncate max-w-xs">
                {fechaLabel}
              </p>
            </div>
          </div>

          {/* Badge contador */}
          {totalPacientes > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              {totalPacientes} paciente{totalPacientes !== 1 ? "s" : ""} hoy
            </span>
          )}
        </div>

        {/* CENTER — navegación de fecha */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            onClick={onPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant={esHoy ? "default" : "outline"}
            size="sm"
            className={`h-8 rounded-lg px-3 text-xs font-medium transition-all ${
              esHoy
                ? "bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200 text-white border-0"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
            onClick={onHoy}
          >
            Hoy
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            onClick={onNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* RIGHT — vista + nuevo turno */}
        <div className="flex items-center gap-2">
          {/* Selector de vista */}
          <div className="hidden md:flex items-center rounded-lg border border-slate-200 p-0.5 bg-slate-50">
            <button
              onClick={() => onVistaChange("dia")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                vista === "dia"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              Día
            </button>
            <button
              onClick={() => onVistaChange("semana")}
              title="Próximamente"
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                vista === "semana"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Semana
              <span className="rounded bg-amber-100 px-1 py-0.5 text-[10px] font-semibold text-amber-700 leading-none">
                Pronto
              </span>
            </button>
          </div>

          <Button
            onClick={onNuevoTurno}
            size="sm"
            className="h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 shadow-sm shadow-blue-200 border-0 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            Nuevo turno
          </Button>
        </div>
      </div>
    </header>
  )
}
