"use client"

import { useEffect, useState } from "react"

const MEDICO_ID = "cmng7ckur0001v5moeku7lwi8" // 👈 tu ID real

export default function MedicoPage() {
  const [turnos, setTurnos] = useState<any[]>([])

  useEffect(() => {
    fetch(`/api/turnos/medico/${MEDICO_ID}`)
      .then(res => res.json())
      .then(setTurnos)
  }, [])

  const enSala = turnos.filter(t => t.estado === "EN_SALA")
  const pendientes = turnos.filter(t => t.estado === "PENDIENTE")
  const atendidos = turnos.filter(t => t.estado === "ATENDIDO")

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        Panel del Médico
      </h1>

      {/* EN SALA */}
      <div>
        <h2 className="font-semibold mb-2">🪑 En Sala</h2>
        {enSala.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nadie en sala</p>
        ) : (
          enSala.map(t => (
            <div key={t.id} className="border p-3 rounded mb-2 bg-blue-50">
              <p className="font-medium">
                {t.paciente.nombre} {t.paciente.apellido}
              </p>
            </div>
          ))
        )}
      </div>

      {/* PENDIENTES */}
      <div>
        <h2 className="font-semibold mb-2">⏳ Próximos</h2>
        {pendientes.map(t => (
          <div key={t.id} className="border p-3 rounded mb-2">
            <p>
              {t.paciente.nombre} {t.paciente.apellido}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(t.fecha).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>

      {/* ATENDIDOS */}
      <div>
        <h2 className="font-semibold mb-2">✅ Atendidos</h2>
        {atendidos.map(t => (
          <div key={t.id} className="border p-3 rounded mb-2 bg-green-50">
            <p>
              {t.paciente.nombre} {t.paciente.apellido}
            </p>
          </div>
        ))}
      </div>

    </div>
  )
}