"use client"

import { useEffect, useState } from "react"

type Props = {
  fechaBase: Date
  search: string
  onSlotClick?: (dia: any, hora: string, turno: any) => void
  onTurnoClick?: (turno: any) => void
}

export function AgendaMedicos({
  fechaBase,
  search,
  onSlotClick,
  onTurnoClick
}: Props) {
  const [turnos, setTurnos] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/turnos")
      .then(res => res.json())
      .then(setTurnos)
  }, [])

  const turnosFiltrados = turnos.filter(t =>
    `${t.paciente?.nombre} ${t.paciente?.apellido}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const getSemana = (baseDate: Date) => {
    const dia = baseDate.getDay()
    const lunes = new Date(baseDate)
    lunes.setDate(baseDate.getDate() - (dia === 0 ? 6 : dia - 1))
    const dias = []
    const nombres = ["Lun", "Mar", "Mié", "Jue", "Vie"] // Nombres más cortos

    for (let i = 0; i < 5; i++) {
      const fecha = new Date(lunes)
      fecha.setDate(lunes.getDate() + i)
      const year = fecha.getFullYear()
      const month = String(fecha.getMonth() + 1).padStart(2, "0")
      const day = String(fecha.getDate()).padStart(2, "0")

      dias.push({
        nombre: nombres[i],
        numero: fecha.getDate(),
        fechaStr: fecha.toLocaleDateString(),
        dateKey: `${year}-${month}-${day}`
      })
    }
    return dias
  }

  const diasSemana = getSemana(fechaBase)

  const horarios: string[] = []
  for (let h = 8; h <= 18; h++) {
    for (let m = 0; m < 60; m += 15) {
      horarios.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`)
    }
  }

  const getTurno = (dateKey: string, time: string) => {
    return turnosFiltrados.find(t => {
      const d = new Date(t.fecha)
      const localDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
      const localTime = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
      return localDate === dateKey && localTime === time
    })
  }

  const getColor = (estado: string) => {
    switch (estado) {
      case "CONFIRMADO": return "bg-[#39B5B5]"
      case "PENDIENTE": return "bg-amber-400"
      case "EN_SALA": return "bg-sky-500"
      case "ATENDIDO": return "bg-emerald-600"
      case "CANCELADO": return "bg-rose-500"
      default: return "bg-slate-400"
    }
  }

  return (
    // Reducimos gap a 2 y padding lateral para que entren las 5 columnas
    <div className="flex h-full gap-2 pb-2 overflow-x-hidden">
      {diasSemana.map(dia => (
        <div
          key={dia.dateKey}
          // Bajamos min-w a 180px para asegurar que entren los 5 días en pantallas estándar
          className="flex-1 min-w-[180px] bg-white/20 backdrop-blur-md border border-white/40 rounded-[2rem] flex flex-col overflow-hidden shadow-sm"
        >
          {/* HEADER DÍA */}
          <div className="p-3 border-b border-white/10 bg-white/30 text-center">
            <p className="text-[9px] uppercase tracking-tighter font-black text-[#1e5e5e] opacity-70">{dia.nombre}</p>
            <p className="text-xl font-black text-slate-800 leading-none">{dia.numero}</p>
          </div>

          {/* HORAS CON SCROLL INTERNO */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1.5">
            {horarios.map(hora => {
              const turno = getTurno(dia.dateKey, hora)

              return (
                <div key={hora} className="flex gap-1.5 min-h-[40px]">
                  {/* Hora miniatura - ACTUALIZADA PARA VISIBILIDAD */}
                  <div className="w-10 text-[10px] font-bold text-black opacity-50 flex items-start pt-1.5 antialiased">
                    {hora}
                  </div>

                  <div
                    className="flex-1 rounded-xl relative"
                    onClick={() => onSlotClick?.(dia, hora, turno)}
                  >
                    {turno ? (
                      <div
                        onClick={(e) => {
                          e.stopPropagation()
                          onTurnoClick?.(turno)
                        }}
                        className={`absolute inset-0 rounded-lg p-1.5 text-white shadow-sm cursor-pointer ${getColor(turno.estado)}`}
                      >
                        <p className="font-bold text-[10px] leading-tight truncate">
                          {turno.paciente?.apellido}
                        </p>
                        <p className="text-[8px] opacity-90 truncate">
                          {hora}
                        </p>
                      </div>
                    ) : (
                      <div className="h-full w-full border border-dashed border-white/30 rounded-lg bg-white/5 hover:bg-white/20 transition-colors" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(57, 181, 181, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}