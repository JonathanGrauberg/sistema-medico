"use client"

import { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import {
  FileDown,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  FileText
} from "lucide-react"

import ReportForm from "@/components/reportes/ReportForm"
import ReportPreview from "@/components/reportes/ReportPreview"
import { defaultReportData, ReportData } from "@/lib/reportes/report-types"

type PdfStatus = "idle" | "generating" | "done" | "error"

export default function ReportesPage() {
  const [data, setData] = useState<ReportData>(defaultReportData)
  const [pdfStatus, setPdfStatus] = useState<PdfStatus>("idle")
  const previewRef = useRef<HTMLDivElement>(null)

  // 🔥 NUEVO: leer patientId desde URL
  const searchParams = useSearchParams()
  const patientId = searchParams.get("patientId")

  // 🔥 NUEVO: autocompletar paciente si viene desde /pacientes
  useEffect(() => {
    if (!patientId) return

    const fetchPatient = async () => {
      try {
        const res = await fetch(`/api/pacientes/${patientId}`)
        if (!res.ok) return

        const patient = await res.json()

        setData((prev) => ({
          ...prev,
          patientId: patient.id,
          patientName: `${patient.nombre} ${patient.apellido}`,
        }))
      } catch (err) {
        console.error("Error cargando paciente:", err)
      }
    }

    fetchPatient()
  }, [patientId])

  const generatePDF = async () => {
    if (typeof window === "undefined") return
    if (!previewRef.current) return

    setPdfStatus("generating")

    try {
      const html2canvas = (await import("html2canvas")).default
      const { jsPDF } = await import("jspdf")

      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: "#ffffff"
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF()

      pdf.addImage(imgData, "PNG", 0, 0, 210, 297)

      const patientSlug =
        data.patientName?.replace(/\s+/g, "-").toLowerCase() || "paciente"

      const dateSlug = data.date || "reporte"

      pdf.save(`reporte-${patientSlug}-${dateSlug}.pdf`)

      setPdfStatus("done")
      setTimeout(() => setPdfStatus("idle"), 2000)
    } catch (err) {
      console.error("PDF ERROR:", err)
      setPdfStatus("error")
      setTimeout(() => setPdfStatus("idle"), 2000)
    }
  }

  const PdfIcon =
    pdfStatus === "generating"
      ? Loader2
      : pdfStatus === "done"
      ? CheckCircle
      : pdfStatus === "error"
      ? AlertCircle
      : FileDown

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="glass-card p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Generador de Informes
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#1e5e5e] font-bold opacity-70">
            Reportes médicos con PDF
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setData(defaultReportData)}
            className="px-4 py-2 text-sm rounded-xl bg-white/40 hover:bg-white/60"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={generatePDF}
            disabled={pdfStatus === "generating"}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#39B5B5] text-white font-bold disabled:opacity-60"
          >
            <PdfIcon
              className={`w-4 h-4 ${
                pdfStatus === "generating" ? "animate-spin" : ""
              }`}
            />
            Generar PDF
          </button>
        </div>
      </div>

      {/* 🔥 INDICADOR SI VIENE DE PACIENTE */}
      {data.patientName && (
        <div className="glass-card p-3 text-sm text-teal-700 flex items-center justify-between">
          <span>
            Generando informe para: <b>{data.patientName}</b>
          </span>

          <button
            onClick={() =>
              setData((prev) => ({
                ...prev,
                patientId: undefined,
                patientName: ""
              }))
            }
            className="text-xs text-red-500 hover:underline"
          >
            Cambiar paciente
          </button>
        </div>
      )}

      {/* LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* FORM */}
        <div className="glass-card p-6">
          <h2 className="font-bold mb-4 text-slate-700 flex gap-2 items-center">
            <FileText className="w-4 h-4" />
            Datos del informe
          </h2>

          <ReportForm data={data} onChange={setData} />
        </div>

        {/* PREVIEW */}
        <div className="glass-card p-6 overflow-auto">
          <h2 className="font-bold mb-4 text-slate-700 flex gap-2 items-center">
            <Eye className="w-4 h-4" />
            Vista previa
          </h2>

          <div className="bg-white rounded-lg shadow p-4">
            <ReportPreview ref={previewRef} data={data} />
          </div>
        </div>
      </div>
    </div>
  )
}