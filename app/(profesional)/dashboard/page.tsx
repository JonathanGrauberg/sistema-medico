"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  Users,
  FileText,
  BarChart3,
  Timer
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { ReporteMedico } from "@/components/reporte-medico"
import { SalaSheet } from "@/components/sala-sheet" // 🔥 Usamos el nuevo Sheet lateral

const session = {
  user: { nombre: "Juan", apellido: "Gómez" }
}

export default function DashboardPage() {
  const router = useRouter()
  const [isSalaOpen, setIsSalaOpen] = useState(false) 

  return (
    <div className="space-y-10">
      {/* HEADER - Estética original */}
      <div className="space-y-1">
        <h1 className="text-4xl font-light tracking-tight text-slate-800">
          Dr. <span className="font-semibold">{session.user.nombre} {session.user.apellido}</span>
        </h1>
        <p className="text-sm uppercase tracking-[0.3em] text-[#1e5e5e] font-bold opacity-70">
          Panel de Gestión Profesional
        </p>
      </div>

      {/* CARDS DE MÓDULOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5">
        <QuickCard icon={Calendar} title="Turnos" desc="Ver agenda" onClick={() => router.push("/turnos")} />
        <QuickCard icon={Users} title="Pacientes" desc="Gestionar pacientes" onClick={() => router.push("/pacientes")} />
        <QuickCard icon={FileText} title="Nomenclador" desc="Ver prácticas" onClick={() => router.push("/nomenclador")} />
        <QuickCard icon={BarChart3} title="Reportes" desc="Estadísticas" onClick={() => {}} />
        
        {/* 🔥 Único cambio funcional: abre SalaSheet */}
        <QuickCard 
          icon={Timer} 
          title="Sala" 
          desc="Sala de espera" 
          onClick={() => setIsSalaOpen(true)} 
        />
      </div>

      {/* RESUMEN - Volvemos a font-light como estaba originalmente */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-8">
              <p className="text-xs uppercase tracking-widest text-[#1e5e5e] font-bold">Atendidos</p>
              <p className="text-5xl font-light mt-4 text-slate-800">12</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-8">
              <p className="text-xs uppercase tracking-widest text-[#1e5e5e] font-bold">En sala</p>
              <p className="text-5xl font-light mt-4 text-[#39B5B5]">04</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-8">
              <p className="text-xs uppercase tracking-widest text-[#1e5e5e] font-bold">Cancelados</p>
              <p className="text-5xl font-light mt-4 text-rose-400/80">02</p>
            </CardContent>
          </Card>
      </div>

      <div className="pt-4">
        <ReporteMedico />
      </div>

      {/* 🔥 Componente lateral unificado */}
      <SalaSheet open={isSalaOpen} onClose={() => setIsSalaOpen(false)} />
    </div>
  )
}

function QuickCard({ icon: Icon, title, desc, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-[2rem] border border-white/40 bg-primary/80 backdrop-blur-md p-5 shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] hover:bg-[#39B5B5] hover:shadow-[#39B5B5]/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
    >
      <div className="flex flex-col gap-4">
        <div className="w-10 h-10 rounded-2xl bg-white/50 flex items-center justify-center shadow-sm group-hover:bg-white transition-colors duration-500">
          <Icon className="w-5 h-5 text-[#39B5B5]" />
        </div>
        <div>
          <p className="font-bold text-white/60 group-hover:text-white transition-colors duration-500">{title}</p>
          <p className="text-[11px] text-white/40 group-hover:text-white transition-colors duration-500">{desc}</p>
        </div>
      </div>
    </div>
  )
}