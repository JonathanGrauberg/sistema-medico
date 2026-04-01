"use client"

import { useEffect, useState } from "react"

export default function TurnosPage() {
  const [turnos, setTurnos] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/turnos")
      .then(res => res.json())
      .then(data => setTurnos(data))
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Turnos</h1>

      {turnos.length === 0 ? (
        <p>No hay turnos</p>
      ) : (
        <div className="space-y-4">
          {turnos.map((turno) => (
            <div key={turno.id} className="border p-4 rounded-lg">
              <p><strong>Paciente:</strong> {turno.paciente.nombre} {turno.paciente.apellido}</p>
              <p><strong>Médico:</strong> {turno.medico.nombre}</p>
              <p><strong>Fecha:</strong> {new Date(turno.fecha).toLocaleString()}</p>
              <p><strong>Estado:</strong> {turno.estado}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}