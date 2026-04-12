"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
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

  useEffect(() => {
    setStats({
      atendidos: 12,
      enSala: 4,
      cancelados: 2
    })
  }, [])

  const data = [
    { name: "Atendidos", value: stats.atendidos, color: "#39B5B5" },
    { name: "En sala", value: stats.enSala, color: "#1e5e5e" },
    { name: "Cancelados", value: stats.cancelados, color: "#fb7185" } // rose-400
  ]

  return (
    <div className="space-y-8 mt-4">

      {/* HEADER INTEGRADO */}
      <div className="px-2">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          Análisis de Productividad
        </h2>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#1e5e5e] font-bold opacity-60">
          Métricas de desempeño en tiempo real
        </p>
      </div>

      {/* GRAFICO CON ESTILO GLASS */}
      <div className="h-[350px] w-full rounded-[2.5rem] border border-white/40 bg-white/30 backdrop-blur-xl p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#39B5B5" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#39B5B5" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              allowDecimals={false} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#475569', fontSize: 12 }}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.2)' }}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.7)', 
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                padding: '12px'
              }}
            />
            <Bar 
              dataKey="value" 
              radius={[10, 10, 10, 10]} 
              barSize={60}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}