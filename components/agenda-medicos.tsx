"use client"

import { useEffect, useState } from "react"

type Props = {
  fechaBase: Date
  search: string
}

export function AgendaMedicos({ fechaBase, search }: Props) {
  const [turnos, setTurnos] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/turnos")
      .then(res => res.json())
      .then(setTurnos)
  }, [])

  // ================= FILTRO =================

  const turnosFiltrados = turnos.filter(t =>
    `${t.paciente?.nombre} ${t.paciente?.apellido}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  // ================= SEMANA =================

  const getSemana = (baseDate: Date) => {
    const dia = baseDate.getDay()
    const lunes = new Date(baseDate)

    lunes.setDate(baseDate.getDate() - (dia === 0 ? 6 : dia - 1))

    const dias = []

    for (let i = 0; i < 5; i++) {
      const fecha = new Date(lunes)
      fecha.setDate(lunes.getDate() + i)

      const year = fecha.getFullYear()
      const month = String(fecha.getMonth() + 1).padStart(2, "0")
      const day = String(fecha.getDate()).padStart(2, "0")

      dias.push({
        nombre: ["Lun", "Mar", "Mié", "Jue", "Vie"][i],
        fechaStr: fecha.toLocaleDateString(),
        dateKey: `${year}-${month}-${day}`
      })
    }

    return dias
  }

  const diasSemana = getSemana(fechaBase)

  // ================= HORARIOS =================

  const horarios = []
  for (let h = 8; h <= 18; h++) {
    for (let m = 0; m < 60; m += 15) {
      horarios.push(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
      )
    }
  }

  // ================= BUSCAR TURNO =================

  const getTurno = (dateKey: string, time: string) => {
    return turnosFiltrados.find(t => {
      const d = new Date(t.fecha)

      const localDate = `${d.getFullYear()}-${String(
        d.getMonth() + 1
      ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

      const localTime = `${String(d.getHours()).padStart(2, "0")}:${String(
        d.getMinutes()
      ).padStart(2, "0")}`

      return localDate === dateKey && localTime === time
    })
  }

  // ================= COLOR =================

  const getColor = (estado: string) => {
    switch (estado) {
      case "CONFIRMADO":
        return "bg-[#39B5B5]"
      case "PENDIENTE":
        return "bg-yellow-500"
      case "EN_SALA":
        return "bg-blue-500"
      case "ATENDIDO":
        return "bg-green-600"
      case "CANCELADO":
        return "bg-red-500"
      default:
        return "bg-gray-300"
    }
  }

  return (
    <div className="flex-1 flex overflow-x-auto p-4 gap-4">

      {diasSemana.map(dia => (
        <div
          key={dia.dateKey}
          className="flex-1 min-w-[220px] bg-white rounded border flex flex-col"
        >
          {/* HEADER */}
          <div className="p-3 border-b font-medium text-sm">
            {dia.nombre} {dia.fechaStr}
          </div>

          {/* HORAS */}
          <div className="flex-1 overflow-y-auto">
            {horarios.map(hora => {
              const turno = getTurno(dia.dateKey, hora)

              return (
                <div key={hora} className="flex border-b min-h-[45px]">

                  <div className="w-14 text-xs text-gray-500 flex items-center justify-center">
                    {hora}
                  </div>

                  <div className="flex-1 p-1">
                    {turno ? (
                      <div
                        onClick={() => alert(`Turno ID: ${turno.id}`)}
                        className={`h-full rounded px-2 py-1 text-white text-xs cursor-pointer ${getColor(
                          turno.estado
                        )}`}
                      >
                        <div className="font-semibold truncate">
                          {turno.paciente?.apellido},{" "}
                          {turno.paciente?.nombre}
                        </div>
                        <div className="text-[10px] opacity-80">
                          {turno.medico?.nombre}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full bg-gray-100 rounded opacity-40"></div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}