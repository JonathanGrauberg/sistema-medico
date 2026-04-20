"use client"

import { useEffect, useState } from "react"
import {
  Users,
  Calendar,
  Clock,
  Search
} from "lucide-react"

interface Turno {
  id: string
  pacienteNombre: string
  medicoNombre: string
  hora: string
  estado: "PENDIENTE" | "EN_SALA" | "EN_ATENCION" | "FINALIZADO"
}

export default function SecretariaDashboard() {
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const res = await fetch("/api/turnos/hoy")
        const data = await res.json()
        setTurnos(data || [])
      } catch (err) {
        console.error(err)
      }
    }

    fetchTurnos()
  }, [])

  const now = new Date()

  const getEstadoVisual = (turno: Turno) => {
    if (turno.estado === "EN_SALA") return "🟢 En sala"
    if (turno.estado === "FINALIZADO") return "⚫ Atendido"

    const [h, m] = turno.hora.split(":").map(Number)
    const turnoDate = new Date()
    turnoDate.setHours(h, m, 0)

    const diff = (turnoDate.getTime() - now.getTime()) / 60000

    if (diff <= 60 && diff > 0) return "🟠 Turno pronto"
    if (diff <= 0) return "🔴 Atrasado"

    return "🔵 Turno hoy"
  }

  const filtered = turnos.filter((t) =>
    t.pacienteNombre.toLowerCase().includes(search.toLowerCase())
  )

  const enSala = turnos.filter((t) => t.estado === "EN_SALA")

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="glass-card p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard Secretaría
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#1e5e5e] font-bold opacity-70">
            Control diario de pacientes
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="glass-card p-4 flex items-center gap-3">
          <Users className="text-teal-500" />
          <div>
            <p className="text-xs text-slate-500">En sala</p>
            <p className="text-xl font-bold">{enSala.length}</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <Calendar className="text-teal-500" />
          <div>
            <p className="text-xs text-slate-500">Turnos hoy</p>
            <p className="text-xl font-bold">{turnos.length}</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <Clock className="text-teal-500" />
          <div>
            <p className="text-xs text-slate-500">Próximos (&lt;1h)</p>
            <p className="text-xl font-bold">
              {
                turnos.filter((t) => {
                  const [h, m] = t.hora.split(":").map(Number)
                  const turnoDate = new Date()
                  turnoDate.setHours(h, m, 0)
                  const diff =
                    (turnoDate.getTime() - now.getTime()) / 60000
                  return diff <= 60 && diff > 0
                }).length
              }
            </p>
          </div>
        </div>
      </div>

      {/* BUSCADOR */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar paciente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>
      </div>

      {/* PACIENTES EN SALA */}
      <div className="glass-card p-4">
        <h2 className="font-bold mb-3 text-slate-700">
          Pacientes en sala
        </h2>

        {enSala.length === 0 ? (
          <p className="text-sm text-slate-400">
            No hay pacientes en sala
          </p>
        ) : (
          <div className="space-y-2">
            {enSala.map((t) => (
              <div
                key={t.id}
                className="p-3 rounded-xl bg-teal-50 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-sm">
                    {t.pacienteNombre}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t.medicoNombre} • {t.hora}
                  </p>
                </div>

                <span className="text-xs font-bold text-teal-600">
                  EN SALA
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TURNOS DEL DÍA */}
      <div className="glass-card p-4">
        <h2 className="font-bold mb-3 text-slate-700">
          Turnos del día
        </h2>

        <div className="space-y-2">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="p-3 rounded-xl bg-white border flex justify-between items-center hover:bg-slate-50"
            >
              <div>
                <p className="font-semibold text-sm">
                  {t.pacienteNombre}
                </p>
                <p className="text-xs text-slate-500">
                  {t.medicoNombre} • {t.hora}
                </p>
              </div>

              <div className="flex items-center gap-2">

                <span className="text-xs font-medium">
                  {getEstadoVisual(t)}
                </span>

                {t.estado === "PENDIENTE" && (
                  <button
                    onClick={async () => {
                      await fetch(`/api/turnos/${t.id}`, {
                        method: "PATCH",
                        body: JSON.stringify({ estado: "EN_SALA" })
                      })

                      setTurnos((prev) =>
                        prev.map((x) =>
                          x.id === t.id ? { ...x, estado: "EN_SALA" } : x
                        )
                      )
                    }}
                    className="text-xs px-2 py-1 rounded-lg bg-teal-500 text-white font-bold hover:bg-teal-600"
                  >
                    En sala
                  </button>
                )}

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}