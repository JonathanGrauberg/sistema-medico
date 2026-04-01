"use client"

import { useState } from "react"
import { ArrowLeft, Trash2, Loader2, Upload, User, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { FileTable } from "@/components/file-table"
import { FileDropzone } from "@/components/file-dropzone"
import { HistoriaClinicaView } from "@/components/historia-clinica-form"
import { toast } from "sonner"
import { getMockFilesByUserId, getMockHistoriaByUserId, addMockFile } from "@/lib/mock-data"
import type { User as UserType, FileRecord, HistoriaClinicaEntry } from "@/lib/types"

interface UserDetailsProps {
  user: UserType
  onBack?: () => void
  onUserDeleted?: () => void
}

export function UserDetails({ user, onBack, onUserDeleted }: UserDetailsProps) {
  const [files, setFiles] = useState<FileRecord[]>(getMockFilesByUserId(user.id))
  const [historiaEntries, setHistoriaEntries] = useState<HistoriaClinicaEntry[]>(
    getMockHistoriaByUserId(user.id)?.entries || []
  )
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [newEstudios, setNewEstudios] = useState<File[]>([])
  const [newInformes, setNewInformes] = useState<File[]>([])

  const handleFileDeleted = (fileId: string) => {
    setFiles(files.filter(f => f.id !== fileId))
  }

  const handleDeleteUser = async () => {
    setIsDeleting(true)
    // Simulamos eliminacion
    setTimeout(() => {
      toast.success("Usuario eliminado")
      onUserDeleted?.()
      setIsDeleting(false)
    }, 500)
  }

  const handleUploadFiles = async () => {
    if (newEstudios.length === 0 && newInformes.length === 0) {
      toast.error("Selecciona archivos para subir")
      return
    }

    setIsUploading(true)

    try {
      // Agregar estudios
      for (const file of newEstudios) {
        const newFile = addMockFile({
          nombre: file.name,
          tipo: "ESTUDIO",
          url: `/mock/${file.name}`,
          size: file.size,
          mimeType: file.type,
          userId: user.id,
        })
        setFiles(prev => [...prev, newFile])
      }

      // Agregar informes
      for (const file of newInformes) {
        const newFile = addMockFile({
          nombre: file.name,
          tipo: "INFORME",
          url: `/mock/${file.name}`,
          size: file.size,
          mimeType: file.type,
          userId: user.id,
        })
        setFiles(prev => [...prev, newFile])
      }

      toast.success("Archivos subidos correctamente")
      setNewEstudios([])
      setNewInformes([])
    } catch {
      toast.error("Error al subir archivos")
    } finally {
      setIsUploading(false)
    }
  }

  const handleHistoriaEntryAdded = (entry: HistoriaClinicaEntry) => {
    setHistoriaEntries(prev => [...prev, entry])
  }

  const handleHistoriaEntryUpdated = (updatedEntry: HistoriaClinicaEntry) => {
    setHistoriaEntries(prev => 
      prev.map(e => e.id === updatedEntry.id ? updatedEntry : e)
    )
  }

  const estudios = files.filter(f => f.tipo === "ESTUDIO")
  const informes = files.filter(f => f.tipo === "INFORME")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Volver</span>
              </Button>
            )}
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {user.nombre} {user.apellido}
              </CardTitle>
              <CardDescription>
                DNI: {user.dni} | Usuario: {user.username}
              </CardDescription>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
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
                <AlertDialogTitle>Eliminar usuario</AlertDialogTitle>
                <AlertDialogDescription>
                  Estas seguro de que deseas eliminar a {user.nombre} {user.apellido}?
                  Se eliminaran tambien todos sus archivos. Esta accion no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteUser}>
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="estudios">
          <TabsList className="grid w-full grid-cols-4">
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
            <TabsTrigger value="subir">
              Subir
            </TabsTrigger>
          </TabsList>

          <TabsContent value="estudios" className="mt-4">
            <FileTable files={estudios} onFileDeleted={handleFileDeleted} />
          </TabsContent>

          <TabsContent value="informes" className="mt-4">
            <FileTable files={informes} onFileDeleted={handleFileDeleted} />
          </TabsContent>

          <TabsContent value="historia" className="mt-4">
            <HistoriaClinicaView 
              entries={historiaEntries} 
              userId={user.id}
              onEntryAdded={handleHistoriaEntryAdded}
            />
          </TabsContent>

          <TabsContent value="subir" className="mt-4 space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <FileDropzone
                label="Nuevos Estudios"
                onFilesChange={setNewEstudios}
              />
              <FileDropzone
                label="Nuevos Informes"
                onFilesChange={setNewInformes}
              />
            </div>

            <Button
              onClick={handleUploadFiles}
              disabled={isUploading || (newEstudios.length === 0 && newInformes.length === 0)}
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
