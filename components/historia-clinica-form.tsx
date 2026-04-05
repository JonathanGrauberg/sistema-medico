"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Plus, Save, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import type { HistoriaClinicaEntry } from "@/lib/types"

interface HistoriaClinicaFormProps {
  userId: string
  onEntryAdded: (entry: HistoriaClinicaEntry | null) => void
  editingEntry?: HistoriaClinicaEntry
  onEntryUpdated?: (entry: HistoriaClinicaEntry) => void
}

export function HistoriaClinicaForm({
  userId,
  onEntryAdded,
  editingEntry,
  onEntryUpdated
}: HistoriaClinicaFormProps) {

  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    motivo: editingEntry?.motivo || "",
    diagnostico: editingEntry?.diagnostico || "",
    tratamiento: editingEntry?.tratamiento || "",
    observaciones: editingEntry?.observaciones || "",
  })

  const isEditing = !!editingEntry

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({
      motivo: "",
      diagnostico: "",
      tratamiento: "",
      observaciones: "",
    })
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)

    if (isOpen && editingEntry) {
      setFormData({
        motivo: editingEntry.motivo,
        diagnostico: editingEntry.diagnostico,
        tratamiento: editingEntry.tratamiento,
        observaciones: editingEntry.observaciones,
      })
    } else if (!isOpen && !editingEntry) {
      resetForm()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.motivo || !formData.diagnostico || !formData.tratamiento) {
      toast.error("Completa los campos requeridos")
      return
    }

    setIsSubmitting(true)

    try {
      if (isEditing && editingEntry) {
        toast.success("Edición pendiente de implementación API")
        onEntryUpdated?.(editingEntry)
      } else {
        await fetch("/api/historias", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            pacienteId: userId,
            medicoId: "cmng7ckur0001v5moeku7lwi8",
            motivo: formData.motivo,
            diagnostico: formData.diagnostico,
            tratamiento: formData.tratamiento,
            observaciones: formData.observaciones
          })
        })

        toast.success("Entrada agregada a la historia clínica")

        // 🔥 refetch real
        onEntryAdded(null)

        resetForm()
      }

      setOpen(false)

    } catch (error) {
      console.error(error)
      toast.error("Error al guardar")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="ghost" size="sm">
            <Pencil className="mr-1 h-3 w-3" />
            Editar
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Entrada
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Entrada" : "Nueva Entrada de Historia Clinica"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos de esta consulta"
              : "Agrega una nueva consulta o registro al historial del paciente"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Médico</Label>
            <p className="text-sm text-muted-foreground">
              (se asigna automáticamente)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo de Consulta *</Label>
            <Input
              id="motivo"
              value={formData.motivo}
              onChange={(e) => handleChange("motivo", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnostico">Diagnostico *</Label>
            <Textarea
              id="diagnostico"
              value={formData.diagnostico}
              onChange={(e) => handleChange("diagnostico", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tratamiento">Tratamiento *</Label>
            <Textarea
              id="tratamiento"
              value={formData.tratamiento}
              onChange={(e) => handleChange("tratamiento", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => handleChange("observaciones", e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface HistoriaClinicaViewProps {
  userId: string
  readOnly?: boolean
}

export function HistoriaClinicaView({ userId, readOnly = false }: HistoriaClinicaViewProps) {
  const [localEntries, setLocalEntries] = useState<HistoriaClinicaEntry[]>([])

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  }

  const fetchHistorias = async () => {
    try {
      const res = await fetch(`/api/historias?pacienteId=${userId}`)
      const data = await res.json()
      setLocalEntries(data || [])
    } catch {
      toast.error("Error cargando historia clínica")
    }
  }

  useEffect(() => {
  if (userId) {
    fetchHistorias()
  }
}, [userId])

  const handleEntryAdded = async () => {
    await fetchHistorias()
  }

  const handleEntryUpdated = async () => {
    await fetchHistorias()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Historia Clinica</h3>
          <p className="text-sm text-muted-foreground">
            {localEntries.length} registro{localEntries.length !== 1 ? "s" : ""}
          </p>
        </div>
        {!readOnly && (
          <HistoriaClinicaForm userId={userId} onEntryAdded={handleEntryAdded} />
        )}
      </div>

      {localEntries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarIcon className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">
              No hay registros en la historia clinica
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 border-l pl-4">
          {localEntries
            .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
            .map((entry) => (
              <Card
                key={entry.id}
                className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">
                      {entry.motivo}
                    </CardTitle>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarIcon className="h-3 w-3" />
                        {formatDate(entry.fecha)}
                      </div>

                      {!readOnly && (
                        <HistoriaClinicaForm
                          userId={userId}
                          onEntryAdded={handleEntryAdded}
                          editingEntry={entry}
                          onEntryUpdated={handleEntryUpdated}
                        />
                      )}
                    </div>
                  </div>

                  <CardDescription className="text-xs">
                    👨‍⚕️ {entry.medicoNombre || "Médico"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 text-sm">
                  <div>
                    <p className="font-medium">Diagnóstico</p>
                    <p className="text-muted-foreground">{entry.diagnostico}</p>
                  </div>

                  <div>
                    <p className="font-medium">Tratamiento</p>
                    <p className="text-muted-foreground">{entry.tratamiento}</p>
                  </div>

                  {entry.observaciones && (
                    <div>
                      <p className="font-medium">Observaciones</p>
                      <p className="text-muted-foreground">{entry.observaciones}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  )
}