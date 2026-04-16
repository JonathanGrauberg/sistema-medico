export interface Measurement {
  id: string
  label: string
  value: string
}

export interface ReportData {
  patientId?: string // 🔥 ESTE ES EL FIX
  patientName: string
  doctorName: string
  date: string
  studyType: string
  reason: string
  description: string
  measurements: Measurement[]
  conclusion: string
  signatureDataUrl: string | null
}

export const STUDY_TYPES = [
  "X-Ray",
  "MRI",
  "CT Scan",
  "Ultrasound",
  "Blood Test",
  "Other",
]

export const defaultReportData: ReportData = {
  patientId: undefined, // 🔥 importante
  patientName: "",
  doctorName: "",
  date: new Date().toISOString().split("T")[0],
  studyType: "",
  reason: "",
  description: "",
  measurements: [],
  conclusion: "",
  signatureDataUrl: null,
}