"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export function TurnoForm({ onCreated }: { onCreated?: () => void }) {
  const [pacientes, setPacientes] = useState<any[]>([])
  const [medicos, setMedicos] = useState<any[]>([])
  const [pacienteId, setPacienteId] = useState("")
  const [medicoId, setMedicoId] = useState("")
  const [fecha, setFecha] = useState("")

  useEffect(() => {
    fetch("/api/pacientes").then(res => res.json()).then(setPacientes)
    fetch("/api/medicos").then(res => res.json()).then(setMedicos)
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (!pacienteId || !medicoId || !fecha) {
      toast.error("Completa todos los campos")
      return
    }

    try {
      await fetch("/api/turnos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          pacienteId,
          medicoId,
          fecha
        })
      })

      toast.success("Turno creado")

      setPacienteId("")
      setMedicoId("")
      setFecha("")

      onCreated?.()
    } catch {
      toast.error("Error al crear turno")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg">
      <h2 className="font-bold">Nuevo Turno</h2>

      <select
        value={pacienteId}
        onChange={(e) => setPacienteId(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="">Seleccionar paciente</option>
        {pacientes.map(p => (
          <option key={p.id} value={p.id}>
            {p.nombre} {p.apellido}
          </option>
        ))}
      </select>

      <select
        value={medicoId}
        onChange={(e) => setMedicoId(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="">Seleccionar médico</option>
        {medicos.map(m => (
          <option key={m.id} value={m.id}>
            {m.nombre} {m.apellido}
          </option>
        ))}
      </select>

      <Input
        type="datetime-local"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />

      <Button type="submit" className="w-full">
        Crear Turno
      </Button>
    </form>
  )
}