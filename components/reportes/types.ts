export type ReportData = {
  // 🔗 FUTURO DB
  id?: string

  // 👤 PACIENTE
  patientId?: string
  patientName: string

  // 👨‍⚕️ MÉDICO
  doctorId?: string
  doctorName?: string

  // 📅 INFO GENERAL
  date: string

  // 🧠 CONTENIDO MÉDICO
  diagnosis: string
  treatment: string
  observations?: string
}

// 🔥 DATA INICIAL
export const defaultReportData: ReportData = {
  patientId: undefined,
  patientName: "",

  doctorId: undefined,
  doctorName: "",

  date: new Date().toISOString().split("T")[0],

  diagnosis: "",
  treatment: "",
  observations: "",
}