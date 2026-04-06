"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

type Stats = {
  atendidos: number
  enSala: number
  cancelados: number
}

export function ReporteMedico() {
  const [stats, setStats] = useState<Stats>({
    atendidos: 0,
    enSala: 0,
    cancelados: 0
  })

  // 🔥 MOCK (después lo conectamos a /api/turnos)
  useEffect(() => {
    setStats({
      atendidos: 12,
      enSala: 4,
      cancelados: 2
    })
  }, [])

  // 🔥 DATA PARA GRÁFICO
  const data = [
    { name: "Atendidos", value: stats.atendidos },
    { name: "En sala", value: stats.enSala },
    { name: "Cancelados", value: stats.cancelados }
  ]

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold">
          Resumen del día
        </h2>
        <p className="text-sm text-muted-foreground">
          Estado actual de la jornada
        </p>
      </div>

      {/* CARDS NUMERICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <StatCard title="Atendidos" value={stats.atendidos} />
        <StatCard title="En sala" value={stats.enSala} />
        <StatCard title="Cancelados" value={stats.cancelados} />

      </div>

      {/* GRAFICO */}
      <div className="h-[250px] w-full rounded-xl border bg-white p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ================= CARD =================

function StatCard({ title, value }: any) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-muted-foreground">
        {title}
      </p>
      <p className="text-2xl font-bold">
        {value}
      </p>
    </div>
  )
}