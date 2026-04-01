"use client"

import { useEffect, useState } from "react"

const HORAS = Array.from({ length: 13 }, (_, i) => i + 8) // 8 a 20

export function AgendaDia() {
  const [turnos, setTurnos] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/turnos")
      .then(res => res.json())
      .then(setTurnos)
  }, [])

  const getTurnoPorHora = (hora: number) => {
    return turnos.find(t => {
      const date = new Date(t.fecha)
      return date.getHours() === hora
    })
  }

  return (
    <div className="mt-6 border rounded-lg overflow-hidden">

      {HORAS.map(hora => {
        const turno = getTurnoPorHora(hora)

        return (
          <div
            key={hora}
            className="grid grid-cols-[80px_1fr] border-b min-h-[70px]"
          >
            {/* Hora */}
            <div className="border-r p-2 text-sm text-muted-foreground">
              {hora}:00
            </div>

            {/* Contenido */}
            <div className="p-2">
              {turno ? (
                <div className="bg-primary/10 border border-primary rounded-md p-2">
                  <p className="font-medium">
                    {turno.paciente.nombre} {turno.paciente.apellido}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {turno.medico.nombre}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Libre
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}