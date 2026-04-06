"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Trash2 } from "lucide-react"

export function TurnoModal({
  open,
  onClose,
  fecha,
  turno,
  onCreated,
  onDeleted
}: any) {
  const [pacientes, setPacientes] = useState<any[]>([])
  const [pacienteId, setPacienteId] = useState("")
  const [loading, setLoading] = useState(false)

  const isEdit = !!turno

  useEffect(() => {
    if (open) {
      fetch("/api/pacientes")
        .then(res => res.json())
        .then(setPacientes)
    }
  }, [open])

  useEffect(() => {
    if (turno) {
      setPacienteId(turno.pacienteId)
    }
  }, [turno])

  const handleSubmit = async () => {
    setLoading(true)

    await fetch("/api/turnos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pacienteId,
        medicoId: "cmng7ckur0001v5moeku7lwi8", // TEMP
        fecha
      })
    })

    setLoading(false)
    onCreated()
    onClose()
  }

  const handleDelete = async () => {
    if (!turno) return

    setLoading(true)

    await fetch(`/api/turnos/${turno.id}`, {
      method: "DELETE"
    })

    setLoading(false)
    onDeleted()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">

        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Turno" : "Nuevo Turno"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <div className="text-sm text-muted-foreground">
            {fecha && new Date(fecha).toLocaleString()}
          </div>

          <Select
            value={pacienteId}
            onValueChange={setPacienteId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar paciente" />
            </SelectTrigger>

            <SelectContent>
              {pacientes.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.nombre} {p.apellido}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        </div>

        <DialogFooter className="flex justify-between">

          {isEdit && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          )}

          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>

            {!isEdit && (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Crear
              </Button>
            )}
          </div>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}