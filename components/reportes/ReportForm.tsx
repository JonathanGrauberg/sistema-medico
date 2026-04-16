"use client"

import { useEffect, useState } from "react"
import {
  User,
  Stethoscope,
  Calendar,
  FlaskConical,
  FileText,
  ClipboardList,
  SquarePen as PenSquare
} from "lucide-react"

import { ReportData, STUDY_TYPES } from "@/lib/reportes/report-types"
import MeasurementsSection from "./MeasurementsSection"
import SignatureComponent from "./SignatureComponent"

interface Patient {
  id: string
  nombre: string
  apellido: string
}

interface ReportFormProps {
  data: ReportData
  onChange: (data: ReportData) => void
}

function FieldLabel({
  icon: Icon,
  label,
  optional
}: {
  icon: React.ElementType
  label: string
  optional?: boolean
}) {
  return (
    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
      <Icon size={13} className="text-teal-500" />
      {label}
      {optional && (
        <span className="text-slate-300">(optional)</span>
      )}
    </label>
  )
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800"

const textareaClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm resize-none text-slate-800"

export default function ReportForm({ data, onChange }: ReportFormProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [query, setQuery] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)

  // 🔥 traer pacientes
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("/api/pacientes")
        const json = await res.json()
        setPatients(json || [])
      } catch (err) {
        console.error(err)
      }
    }

    fetchPatients()
  }, [])

  // 🔥 sync visual con data
  useEffect(() => {
    setQuery(data.patientName || "")
  }, [data.patientName])

  const filtered = patients.filter((p) =>
    `${p.nombre} ${p.apellido}`
      .toLowerCase()
      .includes(query.toLowerCase())
  )

  const set = (field: keyof ReportData, value: any) =>
    onChange({ ...data, [field]: value })

  return (
    <div className="space-y-5">

      {/* 🧠 PACIENTE HÍBRIDO */}
      <div className="relative">
        <FieldLabel icon={User} label="Paciente" />

        <input
          type="text"
          placeholder="Buscar o escribir paciente..."
          value={query}
          onChange={(e) => {
            const val = e.target.value
            setQuery(val)
            set("patientName", val)
            set("patientId", undefined)
            setShowDropdown(true)
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          className={inputClass}
        />

        {showDropdown && query && filtered.length > 0 && (
          <div className="absolute z-20 mt-1 w-full bg-white border rounded-xl shadow-lg max-h-48 overflow-auto">
            {filtered.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  const fullName = `${p.nombre} ${p.apellido}`

                  set("patientId", p.id)
                  set("patientName", fullName)
                  setQuery(fullName)
                  setShowDropdown(false)
                }}
                className="px-3 py-2 text-sm hover:bg-teal-50 cursor-pointer"
              >
                {p.nombre} {p.apellido}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MÉDICO + FECHA */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel icon={Stethoscope} label="Doctor Name" />
          <input
            type="text"
            value={data.doctorName}
            onChange={(e) => set("doctorName", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <FieldLabel icon={Calendar} label="Date" />
          <input
            type="date"
            value={data.date}
            onChange={(e) => set("date", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* ESTUDIO */}
      <div>
        <FieldLabel icon={FlaskConical} label="Study Type" />
        <select
          value={data.studyType}
          onChange={(e) => set("studyType", e.target.value)}
          className={inputClass}
        >
          <option value="">Seleccionar...</option>
          {STUDY_TYPES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* MOTIVO */}
      <div>
        <FieldLabel icon={FileText} label="Motivo" optional />
        <textarea
          rows={2}
          value={data.reason}
          onChange={(e) => set("reason", e.target.value)}
          className={textareaClass}
        />
      </div>

      {/* DESCRIPCIÓN */}
      <div>
        <FieldLabel icon={ClipboardList} label="Descripción" />
        <textarea
          rows={4}
          value={data.description}
          onChange={(e) => set("description", e.target.value)}
          className={textareaClass}
        />
      </div>

      {/* MEDICIONES */}
      <MeasurementsSection
        measurements={data.measurements}
        onChange={(m) => set("measurements", m)}
      />

      {/* CONCLUSIÓN */}
      <div>
        <FieldLabel icon={PenSquare} label="Conclusión" optional />
        <textarea
          rows={3}
          value={data.conclusion}
          onChange={(e) => set("conclusion", e.target.value)}
          className={textareaClass}
        />
      </div>

      {/* FIRMA */}
      <div>
        <FieldLabel icon={PenSquare} label="Firma" optional />
        <SignatureComponent
          value={data.signatureDataUrl}
          onChange={(v) => set("signatureDataUrl", v)}
        />
      </div>
    </div>
  )
}