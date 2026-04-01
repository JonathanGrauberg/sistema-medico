"use client"

import { useState } from "react"
import { Download, Trash2, FileText, Image, Video, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import { toast } from "sonner"
import { formatFileSize } from "@/lib/credentials"
import type { FileRecord } from "@/lib/types"

interface FileTableProps {
  files: FileRecord[]
  onFileDeleted?: (fileId: string) => void
  showDelete?: boolean
}

export function FileTable({ files, onFileDeleted, showDelete = true }: FileTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <Image className="h-4 w-4" />
    if (mimeType.startsWith("video/")) return <Video className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(date))
  }

  const handleDownload = async (file: FileRecord) => {
    try {
      const response = await fetch(`/api/files/${file.id}`)
      const data = await response.json()

      if (data.success && data.data.downloadUrl) {
        // In a real app, this would trigger an actual download
        window.open(data.data.downloadUrl, "_blank")
        toast.success("Descarga iniciada")
      } else {
        toast.error("Error al obtener el archivo")
      }
    } catch {
      toast.error("Error al descargar el archivo")
    }
  }

  const handleDelete = async (fileId: string) => {
    setDeletingId(fileId)

    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: "DELETE"
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Archivo eliminado")
        onFileDeleted?.(fileId)
      } else {
        toast.error(data.error || "Error al eliminar el archivo")
      }
    } catch {
      toast.error("Error al eliminar el archivo")
    } finally {
      setDeletingId(null)
    }
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <FileText className="h-12 w-12 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">
          No hay archivos para mostrar
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Tamaño</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getFileIcon(file.mimeType)}
                  <span className="truncate max-w-[200px]">{file.nombre}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={file.tipo === "ESTUDIO" ? "default" : "secondary"}>
                  {file.tipo === "ESTUDIO" ? "Estudio" : "Informe"}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatFileSize(file.size)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(file.createdAt)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(file)}
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Descargar</span>
                  </Button>

                  {showDelete && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          {deletingId === file.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Eliminar archivo</AlertDialogTitle>
                          <AlertDialogDescription>
                            Estas seguro de que deseas eliminar &quot;{file.nombre}&quot;?
                            Esta accion no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(file.id)}>
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
