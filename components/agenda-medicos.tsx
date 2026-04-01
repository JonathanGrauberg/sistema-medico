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

  const cambiarEstado = async (id: string, estado: string) => {
    await fetch(`/api/turnos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ estado })
    })

    // refrescar turnos
    fetch("/api/turnos")
      .then(res => res.json())
      .then(setTurnos)
  }

  return (
    <div className="mt-6 border rounded-lg overflow-auto">

      {/* HEADER */}
      <div
        className="grid border-b bg-muted"
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
          className="grid border-b min-h-[80px]"
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
                  <div className="space-y-2 bg-primary/10 border border-primary rounded-md p-2">

                    {/* Nombre paciente */}
                    <p className="font-medium text-sm">
                      {turno.paciente.nombre} {turno.paciente.apellido}
                    </p>

                    {/* Estado */}
                    <p className="text-xs text-muted-foreground">
                      {turno.estado}
                    </p>

                    {/* Botones */}
                    <div className="flex gap-1 flex-wrap">
                      <button
                        onClick={() => cambiarEstado(turno.id, "PENDIENTE")}
                        className="text-xs px-2 py-1 border rounded hover:bg-muted"
                      >
                        ⏳
                      </button>

                      <button
                        onClick={() => cambiarEstado(turno.id, "EN_SALA")}
                        className="text-xs px-2 py-1 border rounded hover:bg-muted"
                      >
                        🪑
                      </button>

                      <button
                        onClick={() => cambiarEstado(turno.id, "ATENDIDO")}
                        className="text-xs px-2 py-1 border rounded hover:bg-muted"
                      >
                        ✅
                      </button>
                    </div>

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