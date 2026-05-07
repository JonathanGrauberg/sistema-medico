export type FileType = "ESTUDIO" | "INFORME"

export interface User {
  id: string

  nombre: string
  apellido: string
  dni: string

  telefono?: string
  email?: string

  localidad?: string
  obraSocial?: string
  observaciones?: string

  username?: string
  password?: string

  createdAt: Date
  updatedAt: Date

  files?: FileRecord[]
}

export interface FileRecord {
  id: string
  nombre: string
  tipo: FileType
  url: string
  size: number
  mimeType: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserInput {
  nombre: string
  apellido: string
  dni: string
  username: string
  password: string
}

export interface UploadFileInput {
  nombre: string
  tipo: FileType
  url: string
  size: number
  mimeType: string
  userId: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface GeneratedCredentials {
  nombreApellido: string
  username: string
  password: string
}

export interface HistoriaClinicaEntry {
  id: string
  fecha: Date
  medicoNombre: string
  motivo: string
  diagnostico: string
  tratamiento: string
  observaciones: string
}

export interface HistoriaClinica {
  id: string
  userId: string
  entries: HistoriaClinicaEntry[]
  createdAt: Date
  updatedAt: Date
}

