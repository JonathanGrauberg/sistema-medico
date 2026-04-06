"use client"

import { useEffect, useState } from "react"

export function ReporteMedico() {
  const [turnos, setTurnos] = useState<any[]>([])
  const [showMoney, setShowMoney] = useState(false)

  useEffect(() => {
    fetch("/api/turnos")
      .then(res => res.json())
      .then(setTurnos)
  }, [])

  // ================= HOY =================

  const hoy = new Date()

  const esHoy = (fecha: string) => {
    const d = new Date(fecha)
    return (
      d.getDate() === hoy.getDate() &&
      d.getMonth() === hoy.getMonth() &&
      d.getFullYear() === hoy.getFullYear()
    )
  }

  const turnosHoy = turnos.filter(t => esHoy(t.fecha))

  const atendidos = turnosHoy.filter(t => t.estado === "ATENDIDO")
  const enSala = turnosHoy.filter(t => t.estado === "EN_SALA")
  const cancelados = turnosHoy.filter(t => t.estado === "CANCELADO")

  const totalIngresos = atendidos.reduce((acc, t) => {
    return acc + (t.montoPagado || 0)
  }, 0)

  // ================= UI =================

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Resumen del día</h1>
          <p className="text-muted-foreground">
            Actividad e ingresos del consultorio
          </p>
        </div>

        <button
          onClick={() => setShowMoney(prev => !prev)}
          className="px-4 py-2 rounded-full border text-sm hover:bg-muted transition"
        >
          {showMoney ? "Ocultar $" : "Mostrar $"}
        </button>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="p-4 rounded-xl border">
          <p className="text-sm text-muted-foreground">Turnos hoy</p>
          <p className="text-xl font-bold">{turnosHoy.length}</p>
        </div>

        <div className="p-4 rounded-xl border">
          <p className="text-sm text-muted-foreground">En sala</p>
          <p className="text-xl font-bold">{enSala.length}</p>
        </div>

        <div className="p-4 rounded-xl border">
          <p className="text-sm text-muted-foreground">Atendidos</p>
          <p className="text-xl font-bold">{atendidos.length}</p>
        </div>

        <div className="p-4 rounded-xl border">
          <p className="text-sm text-muted-foreground">Ingresos</p>
          <p className="text-xl font-bold">
            {showMoney ? `$${totalIngresos}` : "••••••"}
          </p>
        </div>

      </div>

      {/* DETALLE */}
      <div className="rounded-xl border p-4">
        <h2 className="font-semibold mb-3">Detalle</h2>

        <div className="space-y-2 text-sm">
          <p>✔ Atendidos: {atendidos.length}</p>
          <p>🪑 En sala: {enSala.length}</p>
          <p>❌ Cancelados: {cancelados.length}</p>
        </div>
      </div>

    </div>
  )
}