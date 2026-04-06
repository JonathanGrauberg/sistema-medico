"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"

export default function SecretariaPage() {
  const [turnos, setTurnos] = useState<any[]>([])
  const [search, setSearch] = useState("")

  const fetchTurnos = () => {
    fetch("/api/turnos")
      .then(res => res.json())
      .then(setTurnos)
  }

  useEffect(() => {
    fetchTurnos()
  }, [])

  const hoy = new Date().toISOString().split("T")[0]

  const turnosHoy = turnos.filter(t =>
    t.fecha.startsWith(hoy)
  )

  const filtrados = turnosHoy.filter(t =>
    `${t.paciente.nombre} ${t.paciente.apellido} ${t.paciente.dni}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const pasarASala = async (turno: any) => {
    await fetch(`/api/turnos/${turno.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        estado: "EN_SALA",
        ordenLlegada: Date.now()
      })
    })

    fetchTurnos()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6 space-y-6">

        <h1 className="text-2xl font-bold">
          Panel Secretaria
        </h1>

        {/* 🔍 BUSCADOR */}
        <Input
          placeholder="Buscar por nombre o DNI..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* LISTA */}
        <div className="space-y-2">
          {filtrados.map(turno => (
            <div
              key={turno.id}
              className="flex justify-between items-center p-4 border rounded-lg bg-white"
            >
              <div>
                <p className="font-medium">
                  {turno.paciente.nombre} {turno.paciente.apellido}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(turno.fecha).toLocaleTimeString()} - {turno.medico.nombre}
                </p>
              </div>

              <div className="flex gap-2">

                {turno.estado !== "EN_SALA" && (
                  <Button onClick={() => pasarASala(turno)}>
                    🪑 En sala
                  </Button>
                )}

                {turno.estado === "EN_SALA" && (
                  <span className="text-sm text-green-600 font-medium">
                    En sala
                  </span>
                )}

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}