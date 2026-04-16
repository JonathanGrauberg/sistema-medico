import { ReportData } from "./report-types"

const KEY = "medical-report"

export const saveReport = (data: ReportData) => {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export const loadReport = (): ReportData | null => {
  const raw = localStorage.getItem(KEY)
  return raw ? JSON.parse(raw) : null
}

export const clearReport = () => {
  localStorage.removeItem(KEY)
}