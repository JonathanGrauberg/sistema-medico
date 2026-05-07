"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Trash2,
 Loader2,
  Upload,
  User,
  Stethoscope
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { FileTable } from "@/components/file-table"
import { FileDropzone } from "@/components/file-dropzone"

import { HistoriaClinicaView } from "@/components/historia-clinica-form"

import { toast } from "sonner"

import type {
  User as UserType,
  FileRecord,
  HistoriaClinicaEntry
} from "@/lib/types"

type Role = "MEDICO" | "SECRETARIA"

interface UserDetailsProps {
  user: UserType
  role: Role
  onBack?: () => void
  onUserDeleted?: () => void
}

export function UserDetails({
  user,
  role,
  onBack,
  onUserDeleted
}: UserDetailsProps) {

  const [files, setFiles] = useState<FileRecord[]>([])
  const [historiaEntries, setHistoriaEntries] = useState<HistoriaClinicaEntry[]>([])

  const [isDeleting, setIsDeleting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [newEstudios, setNewEstudios] = useState<File[]>([])
  const [newInformes, setNewInformes] = useState<File[]>([])

  // 🔥 DATOS ADMINISTRATIVOS
  const [telefono, setTelefono] = useState(user.telefono || "")
  const [email, setEmail] = useState(user.email || "")
  const [localidad, setLocalidad] = useState(user.localidad || "")
  const [obraSocial, setObraSocial] = useState(user.obraSocial || "")
  const [observaciones, setObservaciones] = useState(
    user.observaciones || ""
  )

  // ─────────────────────────────────────────────
  // ARCHIVOS
  // ─────────────────────────────────────────────
  const fetchFiles = async () => {
    try {
      const res = await fetch(`/api/paciente/${user.id}`)
      const data = await res.json()

      setFiles(data.archivos || [])
    } catch {
      toast.error("Error cargando archivos")
    }
  }

  // ─────────────────────────────────────────────
  // HISTORIA CLÍNICA
  // ─────────────────────────────────────────────
  const fetchHistorias = async () => {
    try {
      const res = await fetch(
        `/api/historias?pacienteId=${user.id}`
      )

      const data = await res.json()

      setHistoriaEntries(data || [])
    } catch {
      toast.error("Error cargando historia clínica")
    }
  }

  useEffect(() => {
    fetchFiles()
    fetchHistorias()
  }, [user.id])

  // ─────────────────────────────────────────────
  // DELETE FILE
  // ─────────────────────────────────────────────
  const handleFileDeleted = (fileId: string) => {
    setFiles(prev =>
      prev.filter(f => f.id !== fileId)
    )
  }

  // ─────────────────────────────────────────────
  // DELETE USER
  // ─────────────────────────────────────────────
  const handleDeleteUser = async () => {
    setIsDeleting(true)

    try {
      await fetch(`/api/paciente/${user.id}`, {
        method: "DELETE",
      })

      toast.success("Paciente eliminado")

      onUserDeleted?.()
    } catch {
      toast.error("Error eliminando paciente")
    } finally {
      setIsDeleting(false)
    }
  }

  // ─────────────────────────────────────────────
  // SUBIR ARCHIVOS
  // ─────────────────────────────────────────────
  const subirArchivos = async (
    files: File[],
    tipo: "ESTUDIO" | "INFORME"
  ) => {
    for (const file of files) {
      const formData = new FormData()

      formData.append("file", file)
      formData.append("pacienteId", user.id)
      formData.append("tipo", tipo)

      await fetch("/api/upload", {
        method: "POST",
        body: formData
      })
    }
  }

  const handleUploadFiles = async () => {
    if (
      newEstudios.length === 0 &&
      newInformes.length === 0
    ) {
      toast.error("Selecciona archivos")
      return
    }

    setIsUploading(true)

    try {
      await subirArchivos(
        newEstudios,
        "ESTUDIO"
      )

      await subirArchivos(
        newInformes,
        "INFORME"
      )

      toast.success(
        "Archivos subidos correctamente"
      )

      setNewEstudios([])
      setNewInformes([])

      await fetchFiles()
    } catch {
      toast.error("Error al subir archivos")
    } finally {
      setIsUploading(false)
    }
  }

  // ─────────────────────────────────────────────
  // SAVE PACIENTE
  // ─────────────────────────────────────────────
  const handleSavePaciente = async () => {
    try {
      setIsSaving(true)

      const res = await fetch(
        `/api/paciente/${user.id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            telefono,
            email,
            localidad,
            obraSocial,
            observaciones,
          }),
        }
      )

      if (!res.ok) {
        throw new Error()
      }

      toast.success(
        "Paciente actualizado"
      )
    } catch {
      toast.error(
        "Error actualizando paciente"
      )
    } finally {
      setIsSaving(false)
    }
  }

  const estudios = files.filter(
    f => f.tipo === "ESTUDIO"
  )

  const informes = files.filter(
    f => f.tipo === "INFORME"
  )

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}

            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />

                {user.nombre} {user.apellido}
              </CardTitle>

              <CardDescription>
                DNI: {user.dni}
              </CardDescription>
            </div>
          </div>

          <AlertDialog>

            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
              >
                {isDeleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}

                Eliminar
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>

              <AlertDialogHeader>
                <AlertDialogTitle>
                  Eliminar paciente
                </AlertDialogTitle>

                <AlertDialogDescription>
                  Esta acción eliminará al
                  paciente y todos sus
                  archivos.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>

                <AlertDialogCancel>
                  Cancelar
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={handleDeleteUser}
                >
                  Eliminar
                </AlertDialogAction>

              </AlertDialogFooter>

            </AlertDialogContent>

          </AlertDialog>

        </div>
      </CardHeader>

      <CardContent>

        <Tabs defaultValue="estudios">

          <TabsList className="grid w-full grid-cols-5">

            <TabsTrigger value="estudios">
              Estudios ({estudios.length})
            </TabsTrigger>

            <TabsTrigger value="informes">
              Informes ({informes.length})
            </TabsTrigger>

            <TabsTrigger value="historia">
              <Stethoscope className="mr-1 h-3 w-3" />
              Historia
            </TabsTrigger>

            <TabsTrigger value="datos">
              Datos
            </TabsTrigger>

            <TabsTrigger value="subir">
              Subir
            </TabsTrigger>

          </TabsList>

          {/* ───────────────────── */}
          {/* ESTUDIOS */}
          {/* ───────────────────── */}

          <TabsContent
            value="estudios"
            className="mt-4"
          >
            <FileTable
              files={estudios}
              onFileDeleted={
                handleFileDeleted
              }
            />
          </TabsContent>

          {/* ───────────────────── */}
          {/* INFORMES */}
          {/* ───────────────────── */}

          <TabsContent
            value="informes"
            className="mt-4"
          >
            <FileTable
              files={informes}
              onFileDeleted={
                handleFileDeleted
              }
            />
          </TabsContent>

          {/* ───────────────────── */}
          {/* HISTORIA */}
          {/* ───────────────────── */}

          <TabsContent
            value="historia"
            className="mt-4"
          >
            <HistoriaClinicaView
              userId={user.id}
            />
          </TabsContent>

          {/* ───────────────────── */}
          {/* DATOS */}
          {/* ───────────────────── */}

          <TabsContent
            value="datos"
            className="mt-4"
          >

            <div className="space-y-4">

              <div className="grid gap-4 md:grid-cols-2">

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Teléfono
                  </label>

                  <Input
                    value={telefono}
                    onChange={(e) =>
                      setTelefono(
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Mail
                  </label>

                  <Input
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                  />
                </div>

              </div>

              <div className="grid gap-4 md:grid-cols-2">

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Localidad
                  </label>

                  <Input
                    value={localidad}
                    onChange={(e) =>
                      setLocalidad(
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Obra social
                  </label>

                  <Input
                    value={obraSocial}
                    onChange={(e) =>
                      setObraSocial(
                        e.target.value
                      )
                    }
                  />
                </div>

              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Observaciones
                </label>

                <Textarea
                  rows={5}
                  value={observaciones}
                  onChange={(e) =>
                    setObservaciones(
                      e.target.value
                    )
                  }
                />
              </div>

              <Button
                onClick={
                  handleSavePaciente
                }
                disabled={isSaving}
              >
                {isSaving && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}

                Guardar cambios
              </Button>

            </div>

          </TabsContent>

          {/* ───────────────────── */}
          {/* SUBIR */}
          {/* ───────────────────── */}

          <TabsContent
            value="subir"
            className="mt-4 space-y-4"
          >

            <div className="grid gap-4 lg:grid-cols-2">

              <FileDropzone
                label="Nuevos Estudios"
                onFilesChange={
                  setNewEstudios
                }
              />

              <FileDropzone
                label="Nuevos Informes"
                onFilesChange={
                  setNewInformes
                }
              />

            </div>

            <Button
              onClick={
                handleUploadFiles
              }
              disabled={
                isUploading ||
                (
                  newEstudios.length === 0 &&
                  newInformes.length === 0
                )
              }
              className="w-full"
            >

              {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}

              Subir Archivos

            </Button>

          </TabsContent>

        </Tabs>

      </CardContent>
    </Card>
  )
}