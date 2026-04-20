"use client"

import { useEffect, useState } from "react"
import {
  Calendar,
  User,
  CheckCircle,
  X
} from "lucide-react"

interface Doctor {
  id: string
  nombre: string
}

type EstadoTurno = "PENDIENTE" | "EN_SALA" | "ATENDIDO"

interface Turno {
  id: string
  paciente: string
  hora: string
  estado: EstadoTurno
}

export default function SecretariaAgendaPage() {
  const [doctores, setDoctores] = useState<Doctor[]>([])
  const [doctorId, setDoctorId] = useState<string>("")
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null)
  const [coseguro, setCoseguro] = useState("")

  // 🔥 MOCK médicos (después API real)
  useEffect(() => {
    setDoctores([
      { id: "1", nombre: "Dr. Pérez" },
      { id: "2", nombre: "Dra. Gómez" }
    ])
  }, [])

  // 🔥 MOCK turnos (después API real)
  useEffect(() => {
    if (!doctorId) return

    setTurnos([
      { id: "t1", paciente: "Juan Pérez", hora: "09:00", estado: "PENDIENTE" },
      { id: "t2", paciente: "María López", hora: "09:30", estado: "PENDIENTE" }
    ])
  }, [doctorId])

  // 🟢 MARCAR EN SALA (clave para SalaSheet)
  const marcarEnSala = async (id: string) => {
    // 🔥 después: PATCH /api/turnos/:id
    setTurnos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, estado: "EN_SALA" } : t
      )
    )
  }

  // ⚫ MARCAR ATENDIDO (con coseguro)
  const marcarAtendido = async () => {
    if (!selectedTurno) return

    // 🔥 después: guardar coseguro + estado en backend
    console.log("💰 Coseguro cobrado:", coseguro)

    setTurnos((prev) =>
      prev.map((t) =>
        t.id === selectedTurno.id
          ? { ...t, estado: "ATENDIDO" }
          : t
      )
    )

    setSelectedTurno(null)
    setCoseguro("")
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="glass-card p-6">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Agenda de Turnos
        </h1>

        <select
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          className="mt-4 px-4 py-2 rounded-xl border w-full max-w-sm"
        >
          <option value="">Seleccionar médico...</option>
          {doctores.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* TURNOS */}
      <div className="glass-card p-6 space-y-3">
        {turnos.length === 0 ? (
          <p className="text-sm text-slate-400">
            Seleccioná un médico para ver la agenda
          </p>
        ) : (
          turnos.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white/60 border hover:bg-white/80 transition cursor-pointer"
              onClick={() => setSelectedTurno(t)}
            >
              <div className="flex items-center gap-4">
                <User className="w-4 h-4 text-teal-600" />
                <div>
                  <p className="font-semibold">{t.paciente}</p>
                  <p className="text-xs text-slate-400">{t.hora}</p>
                </div>
              </div>

              <div>
                {t.estado === "PENDIENTE" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      marcarEnSala(t.id)
                    }}
                    className="px-3 py-1 text-xs bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                  >
                    En sala
                  </button>
                )}

                {t.estado === "EN_SALA" && (
                  <span className="text-xs text-amber-500 font-bold">
                    EN SALA
                  </span>
                )}

                {t.estado === "ATENDIDO" && (
                  <CheckCircle className="text-green-500 w-4 h-4" />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {selectedTurno && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">

            {/* HEADER */}
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg">Turno</h2>
              <button onClick={() => setSelectedTurno(null)}>
                <X />
              </button>
            </div>

            {/* INFO */}
            <div className="space-y-2 text-sm">
              <p><b>Paciente:</b> {selectedTurno.paciente}</p>
              <p><b>Hora:</b> {selectedTurno.hora}</p>
              <p><b>Estado:</b> {selectedTurno.estado}</p>
            </div>

            {/* COSEGURO */}
            <div>
              <label className="text-xs text-slate-500">
                Coseguro ($)
              </label>
              <input
                type="number"
                value={coseguro}
                onChange={(e) => setCoseguro(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>

            {/* ACTIONS */}
            <div className="flex justify-between gap-2 pt-2">
              <button
                onClick={() => setSelectedTurno(null)}
                className="px-4 py-2 rounded-lg bg-slate-100"
              >
                Cancelar
              </button>

              <button
                onClick={marcarAtendido}
                className="px-4 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600"
              >
                Finalizar + cobrar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}