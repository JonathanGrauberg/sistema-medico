'use client';

import { Plus, X, Ruler } from 'lucide-react'
import { Measurement } from '@/lib/reportes/report-types'

interface MeasurementsSectionProps {
  measurements: Measurement[]
  onChange: (measurements: Measurement[]) => void
}

const genId = () => `m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

export default function MeasurementsSection({
  measurements,
  onChange
}: MeasurementsSectionProps) {

  const addField = () => {
    onChange([...measurements, { id: genId(), label: '', value: '' }])
  }

  const updateField = (id: string, key: 'label' | 'value', val: string) => {
    onChange(
      measurements.map((m) =>
        m.id === id ? { ...m, [key]: val } : m
      )
    )
  }

  const removeField = (id: string) => {
    onChange(measurements.filter((m) => m.id !== id))
  }

  return (
    <div className="space-y-3">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ruler size={15} className="text-teal-500" />
          <span className="text-sm font-semibold text-slate-700">
            Measurements
          </span>
          <span className="text-xs text-slate-400">
            (empty fields are hidden in report)
          </span>
        </div>

        <button
          type="button"
          onClick={addField}
          className="flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-all"
        >
          <Plus size={13} /> Add Field
        </button>
      </div>

      {/* EMPTY STATE */}
      {measurements.length === 0 && (
        <div className="text-center py-4 rounded-xl border border-dashed border-teal-200 bg-teal-50/40">
          <p className="text-xs text-slate-400">
            No measurements added yet
          </p>
        </div>
      )}

      {/* LISTA */}
      <div className="space-y-2">
        {measurements.map((m, index) => (
          <div
            key={m.id}
            className="flex items-center gap-2 p-2 rounded-lg bg-white border border-teal-100 group hover:border-teal-300 transition-all"
          >
            <span className="text-xs text-slate-400 w-5 text-center font-mono">
              {index + 1}
            </span>

            <input
              type="text"
              placeholder="Label (e.g. Lesion size)"
              value={m.label}
              onChange={(e) =>
                updateField(m.id, 'label', e.target.value)
              }
              className="flex-1 text-sm border-0 outline-none bg-transparent placeholder-slate-300 text-slate-700"
            />

            <div className="w-px h-4 bg-teal-100" />

            <input
              type="text"
              placeholder="Value (e.g. 1.2 cm)"
              value={m.value}
              onChange={(e) =>
                updateField(m.id, 'value', e.target.value)
              }
              className="w-32 text-sm border-0 outline-none bg-transparent placeholder-slate-300 text-slate-700 text-right"
            />

            <button
              type="button"
              onClick={() => removeField(m.id)}
              className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-400 transition-all ml-1"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}