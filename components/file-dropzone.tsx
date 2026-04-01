"use client"

import { useCallback, useState } from "react"
import { Upload, X, FileText, Image, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatFileSize } from "@/lib/credentials"

interface FileDropzoneProps {
  accept?: string
  multiple?: boolean
  maxFiles?: number
  label: string
  onFilesChange: (files: File[]) => void
  disabled?: boolean
}

export function FileDropzone({
  accept = ".pdf,.docx,.avi,.bmp,.dcm,.dcim,image/*",
  multiple = true,
  maxFiles = 10,
  label,
  onFilesChange,
  disabled = false
}: FileDropzoneProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return
    
    const fileArray = Array.from(newFiles)
    const combinedFiles = multiple 
      ? [...files, ...fileArray].slice(0, maxFiles)
      : fileArray.slice(0, 1)
    
    setFiles(combinedFiles)
    onFilesChange(combinedFiles)
  }, [files, maxFiles, multiple, onFilesChange])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (!disabled) handleFiles(e.dataTransfer.files)
  }, [disabled, handleFiles])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }, [handleFiles])

  const removeFile = useCallback((index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onFilesChange(newFiles)
  }, [files, onFilesChange])

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <Image className="h-4 w-4" />
    if (file.type.startsWith("video/")) return <Video className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>
      
      <div
        className={cn(
          "relative rounded-lg border-2 border-dashed p-6 transition-colors",
          isDragging && "border-primary bg-primary/5",
          disabled && "opacity-50 cursor-not-allowed",
          !isDragging && !disabled && "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        
        <div className="flex flex-col items-center gap-2 text-center">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm">
            <span className="font-medium text-primary">Click para seleccionar</span>
            <span className="text-muted-foreground"> o arrastra archivos aquí</span>
          </div>
          <p className="text-xs text-muted-foreground">
            PDF, DOCX, AVI, BMP, DCM, imágenes (máx. {maxFiles} archivos)
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                {getFileIcon(file)}
                <span className="truncate text-sm">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({formatFileSize(file.size)})
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Eliminar archivo</span>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
