import type { User, FileRecord, HistoriaClinica, HistoriaClinicaEntry } from "./types"

// Pacientes mockeados
export const mockUsers: User[] = [
  {
    id: "user-1",
    nombre: "Maria",
    apellido: "Garcia",
    dni: "30456789",
    username: "mgarcia",
    password: "temp1234",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-03-01"),
  },
  {
    id: "user-2",
    nombre: "Juan",
    apellido: "Martinez",
    dni: "28123456",
    username: "jmartinez",
    password: "temp5678",
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-03-10"),
  },
  {
    id: "user-3",
    nombre: "Ana",
    apellido: "Lopez",
    dni: "35789012",
    username: "alopez",
    password: "temp9012",
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-03-15"),
  },
]

// Archivos mockeados
export const mockFiles: FileRecord[] = [
  {
    id: "file-1",
    nombre: "Hemograma Completo",
    tipo: "ESTUDIO",
    url: "/mock/hemograma-2024-01.pdf",
    size: 245760,
    mimeType: "application/pdf",
    userId: "user-1",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "file-2",
    nombre: "Radiografia Torax",
    tipo: "ESTUDIO",
    url: "/mock/rx-torax-2024-02.pdf",
    size: 1048576,
    mimeType: "application/pdf",
    userId: "user-1",
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
  },
  {
    id: "file-3",
    nombre: "Informe Cardiologico",
    tipo: "INFORME",
    url: "/mock/informe-cardio-2024-03.pdf",
    size: 156000,
    mimeType: "application/pdf",
    userId: "user-1",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
  {
    id: "file-4",
    nombre: "Ecografia Abdominal",
    tipo: "ESTUDIO",
    url: "/mock/eco-abdominal-2024-02.pdf",
    size: 524288,
    mimeType: "application/pdf",
    userId: "user-2",
    createdAt: new Date("2024-02-25"),
    updatedAt: new Date("2024-02-25"),
  },
  {
    id: "file-5",
    nombre: "Analisis de Orina",
    tipo: "ESTUDIO",
    url: "/mock/orina-2024-03.pdf",
    size: 102400,
    mimeType: "application/pdf",
    userId: "user-2",
    createdAt: new Date("2024-03-08"),
    updatedAt: new Date("2024-03-08"),
  },
  {
    id: "file-6",
    nombre: "Informe Traumatologico",
    tipo: "INFORME",
    url: "/mock/informe-trauma-2024-03.pdf",
    size: 204800,
    mimeType: "application/pdf",
    userId: "user-2",
    createdAt: new Date("2024-03-12"),
    updatedAt: new Date("2024-03-12"),
  },
  {
    id: "file-7",
    nombre: "Tomografia Cerebral",
    tipo: "ESTUDIO",
    url: "/mock/tac-cerebral-2024-03.pdf",
    size: 2097152,
    mimeType: "application/pdf",
    userId: "user-3",
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-10"),
  },
  {
    id: "file-8",
    nombre: "Informe Neurologico",
    tipo: "INFORME",
    url: "/mock/informe-neuro-2024-03.pdf",
    size: 178000,
    mimeType: "application/pdf",
    userId: "user-3",
    createdAt: new Date("2024-03-14"),
    updatedAt: new Date("2024-03-14"),
  },
]

// Historias clinicas mockeadas
export const mockHistoriasClinicas: HistoriaClinica[] = [
  {
    id: "hc-1",
    userId: "user-1",
    entries: [
      {
        id: "entry-1",
        fecha: new Date("2024-01-20"),
        medicoNombre: "Dr. Roberto Sanchez",
        motivo: "Control anual de rutina",
        diagnostico: "Paciente sano, sin alteraciones significativas",
        tratamiento: "Continuar habitos saludables, dieta balanceada",
        observaciones: "Se solicita hemograma de control",
      },
      {
        id: "entry-2",
        fecha: new Date("2024-02-15"),
        medicoNombre: "Dra. Patricia Fernandez",
        motivo: "Consulta por dolor toracico leve",
        diagnostico: "Dolor muscular intercostal",
        tratamiento: "Ibuprofeno 400mg cada 8 horas por 5 dias",
        observaciones: "Radiografia de torax sin particularidades. Control en 2 semanas si persiste.",
      },
      {
        id: "entry-3",
        fecha: new Date("2024-03-01"),
        medicoNombre: "Dr. Carlos Mendez",
        motivo: "Evaluacion cardiologica preventiva",
        diagnostico: "Corazon estructuralmente normal, ritmo sinusal",
        tratamiento: "No requiere tratamiento",
        observaciones: "ECG y ecocardiograma normales. Proximo control en 1 año.",
      },
    ],
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-03-01"),
  },
  {
    id: "hc-2",
    userId: "user-2",
    entries: [
      {
        id: "entry-4",
        fecha: new Date("2024-02-25"),
        medicoNombre: "Dra. Laura Gomez",
        motivo: "Dolor abdominal recurrente",
        diagnostico: "Gastritis cronica leve",
        tratamiento: "Omeprazol 20mg en ayunas por 30 dias",
        observaciones: "Ecografia abdominal sin alteraciones. Dieta sin irritantes.",
      },
      {
        id: "entry-5",
        fecha: new Date("2024-03-12"),
        medicoNombre: "Dr. Miguel Torres",
        motivo: "Dolor en rodilla derecha post ejercicio",
        diagnostico: "Tendinitis rotuliana leve",
        tratamiento: "Reposo deportivo 2 semanas, hielo local, antiinflamatorios",
        observaciones: "Indicada fisioterapia si no mejora. Evitar impacto.",
      },
    ],
    createdAt: new Date("2024-02-25"),
    updatedAt: new Date("2024-03-12"),
  },
  {
    id: "hc-3",
    userId: "user-3",
    entries: [
      {
        id: "entry-6",
        fecha: new Date("2024-03-10"),
        medicoNombre: "Dr. Andres Ruiz",
        motivo: "Cefaleas frecuentes",
        diagnostico: "Cefalea tensional",
        tratamiento: "Paracetamol 1g SOS, tecnicas de relajacion",
        observaciones: "TAC cerebral normal. Se descarta patologia organica. Control de estres.",
      },
    ],
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-14"),
  },
]

// Estado mutable para el mockup (simula base de datos)
export const mockState = {
  users: [...mockUsers],
  files: [...mockFiles],
  historiasClinicas: [...mockHistoriasClinicas],
}

// Funciones helper para el mock
export function getMockUserById(id: string): User | undefined {
  return mockState.users.find(u => u.id === id)
}

export function getMockUserByDni(dni: string): User | undefined {
  return mockState.users.find(u => u.dni === dni)
}

export function getMockFilesByUserId(userId: string): FileRecord[] {
  return mockState.files.filter(f => f.userId === userId)
}

export function getMockHistoriaByUserId(userId: string): HistoriaClinica | undefined {
  return mockState.historiasClinicas.find(hc => hc.userId === userId)
}

export function addMockHistoriaEntry(userId: string, entry: Omit<HistoriaClinicaEntry, "id">): HistoriaClinicaEntry {
  let historia = mockState.historiasClinicas.find(hc => hc.userId === userId)
  
  const newEntry: HistoriaClinicaEntry = {
    ...entry,
    id: `entry-${Date.now()}`,
  }

  if (!historia) {
    historia = {
      id: `hc-${Date.now()}`,
      userId,
      entries: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockState.historiasClinicas.push(historia)
  }

  historia.entries.push(newEntry)
  historia.updatedAt = new Date()

  return newEntry
}

export function updateMockHistoriaEntry(
  userId: string,
  entryId: string,
  data: Partial<Omit<HistoriaClinicaEntry, "id">>
): HistoriaClinicaEntry | null {
  const historia = mockState.historiasClinicas.find(hc => hc.userId === userId)
  if (!historia) return null

  const entryIndex = historia.entries.findIndex(e => e.id === entryId)
  if (entryIndex === -1) return null

  historia.entries[entryIndex] = {
    ...historia.entries[entryIndex],
    ...data,
  }
  historia.updatedAt = new Date()

  return historia.entries[entryIndex]
}

export function addMockUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): User {
  const newUser: User = {
    ...user,
    id: `user-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  mockState.users.push(newUser)
  return newUser
}

export function addMockFile(file: Omit<FileRecord, "id" | "createdAt" | "updatedAt">): FileRecord {
  const newFile: FileRecord = {
    ...file,
    id: `file-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  mockState.files.push(newFile)
  return newFile
}
