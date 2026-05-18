// components/AgendaToolbar.tsx
"use client"

import { Search, SlidersHorizontal, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EstadoTurno, Medico, ESTADO_CONFIG } from "@/components/agenda/types"

interface AgendaToolbarProps {
  search: string
  onSearchChange: (v: string) => void
  medicoId: string
  onMedicoChange: (v: string) => void
  estado: string
  onEstadoChange: (v: string) => void
  soloPendientes: boolean
  onSoloPendientesChange: (v: boolean) => void
  medicos: Medico[]
  totalFiltrados: number
  totalTotal: number
}

export function AgendaToolbar({
  search,
  onSearchChange,
  medicoId,
  onMedicoChange,
  estado,
  onEstadoChange,
  soloPendientes,
  onSoloPendientesChange,
  medicos,
  totalFiltrados,
  totalTotal,
}: AgendaToolbarProps) {
  const hayFiltros =
    search !== "" ||
    medicoId !== "todos" ||
    estado !== "todos" ||
    soloPendientes

  return (
    <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
        {/* Buscador */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Paciente, DNI, médico..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-8 h-8 text-sm bg-white border-slate-200 rounded-lg focus-visible:ring-blue-500/20 focus-visible:border-blue-400"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filtro médico */}
          <Select value={medicoId} onValueChange={onMedicoChange}>
            <SelectTrigger className="h-8 w-auto min-w-[150px] text-xs border-slate-200 bg-white rounded-lg focus:ring-blue-500/20">
              <SelectValue placeholder="Médico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos" className="text-xs">
                Todos los médicos
              </SelectItem>
              {medicos.map((m) => (
                <SelectItem key={m.id} value={m.id} className="text-xs">
                  Dr/a. {m.nombre} {m.apellido}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filtro estado */}
          <Select value={estado} onValueChange={onEstadoChange}>
            <SelectTrigger className="h-8 w-auto min-w-[130px] text-xs border-slate-200 bg-white rounded-lg focus:ring-blue-500/20">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos" className="text-xs">
                Todos los estados
              </SelectItem>
              {(Object.keys(ESTADO_CONFIG) as EstadoTurno[]).map((e) => (
                <SelectItem key={e} value={e} className="text-xs">
                  {ESTADO_CONFIG[e].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Checkbox solo pendientes */}
          <label className="flex items-center gap-2 cursor-pointer group">
            <div
              onClick={() => onSoloPendientesChange(!soloPendientes)}
              className={`relative h-4 w-7 rounded-full transition-colors duration-200 cursor-pointer ${
                soloPendientes ? "bg-blue-500" : "bg-slate-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  soloPendientes ? "translate-x-3" : "translate-x-0"
                }`}
              />
            </div>
            <span className="text-xs text-slate-600 group-hover:text-slate-900 transition-colors select-none">
              Solo pendientes
            </span>
          </label>

          {/* Limpiar filtros */}
          {hayFiltros && (
            <button
              onClick={() => {
                onSearchChange("")
                onMedicoChange("todos")
                onEstadoChange("todos")
                onSoloPendientesChange(false)
              }}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-3 w-3" />
              Limpiar
            </button>
          )}
        </div>

        {/* Contador */}
        <div className="lg:ml-auto text-xs text-slate-400 whitespace-nowrap">
          {totalFiltrados === totalTotal ? (
            <span>{totalTotal} turno{totalTotal !== 1 ? "s" : ""}</span>
          ) : (
            <span>
              {totalFiltrados} de {totalTotal} turno{totalTotal !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
