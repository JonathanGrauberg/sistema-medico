"use client"

import { useEffect, useState } from "react"

const HORAS = Array.from({ length: 13 }, (_, i) => i + 8)

export function AgendaMedicos() {
  const [turnos, setTurnos] = useState<any[]>([])
  const [medicos, setMedicos] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/turnos").then(res => res.json()).then(setTurnos)
    fetch("/api/medicos").then(res => res.json()).then(setMedicos)
  }, [])

  const getTurno = (hora: number, medicoId: string) => {
    return turnos.find(t => {
      const date = new Date(t.fecha)
      return date.getHours() === hora && t.medicoId === medicoId
    })
  }

  return (
    <div className="mt-6 border rounded-lg overflow-auto">

      {/* HEADER */}
      <div className="grid border-b bg-muted"
        style={{ gridTemplateColumns: `80px repeat(${medicos.length}, 1fr)` }}
      >
        <div className="p-2 font-medium border-r">Hora</div>

        {medicos.map(m => (
          <div key={m.id} className="p-2 text-center font-medium border-r">
            {m.nombre}
          </div>
        ))}
      </div>

      {/* FILAS */}
      {HORAS.map(hora => (
        <div
          key={hora}
          className="grid border-b min-h-[70px]"
          style={{ gridTemplateColumns: `80px repeat(${medicos.length}, 1fr)` }}
        >
          {/* Hora */}
          <div className="border-r p-2 text-sm text-muted-foreground">
            {hora}:00
          </div>

          {/* Columnas por médico */}
          {medicos.map(medico => {
            const turno = getTurno(hora, medico.id)

            return (
              <div key={medico.id} className="border-r p-2">
                {turno ? (
                  <div className="bg-primary/10 border border-primary rounded-md p-2">
                    <p className="font-medium text-sm">
                      {turno.paciente.nombre} {turno.paciente.apellido}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {turno.estado}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Libre
                  </p>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}