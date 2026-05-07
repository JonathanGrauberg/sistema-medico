"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  CalendarDays,
  Users,
  Timer,
  Plus,
  ClipboardList,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import {SalaSheet} from "@/components/sala-sheet"

// ─── Tipos ────────────────────────────────────────────────
type ResumenDia = {
  pendientes: number
  enSala: number
  atendidos: number
  cancelados: number
}

// ─── Componente principal ─────────────────────────────────
export default function SecretariaDashboardPage() {
  const router = useRouter()

  const [isSalaOpen, setIsSalaOpen] = useState(false)

  const [resumen, setResumen] = useState<ResumenDia>({
    pendientes: 0,
    enSala: 0,
    atendidos: 0,
    cancelados: 0,
  })

  const [loading, setLoading] = useState(true)

  // Fecha de hoy formateada
  const hoy = new Date()

  const fechaLabel = hoy.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  useEffect(() => {
    const fechaISO = hoy.toISOString().split("T")[0]

    fetch(`/api/turnos?fecha=${fechaISO}`)
      .then((res) => res.json())
      .then((turnos: { estado: string }[]) => {
        setResumen({
          pendientes: turnos.filter(
            (t) =>
              t.estado === "PENDIENTE" ||
              t.estado === "CONFIRMADO"
          ).length,

          enSala: turnos.filter(
            (t) => t.estado === "EN_SALA"
          ).length,

          atendidos: turnos.filter(
            (t) => t.estado === "ATENDIDO"
          ).length,

          cancelados: turnos.filter(
            (t) => t.estado === "CANCELADO"
          ).length,
        })
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-10">
      {/* ── HEADER ─────────────────────────────────────── */}
      <div className="space-y-1">
        <h1 className="text-4xl font-light tracking-tight text-slate-800">
          Panel de{" "}
          <span className="font-semibold">
            Secretaría
          </span>
        </h1>

        <p className="text-sm uppercase tracking-[0.3em] text-[#1e5e5e] font-bold opacity-70 capitalize">
          {fechaLabel}
        </p>
      </div>

      {/* ── MÓDULOS ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        <QuickCard
          icon={CalendarDays}
          title="Agenda del día"
          desc="Turnos de hoy"
          onClick={() => router.push("/agenda")}
        />

        <QuickCard
          icon={Users}
          title="Pacientes"
          desc="Buscar / crear"
          onClick={() => router.push("/pacientes")}
        />

        <QuickCard
          icon={Timer}
          title="Sala de espera"
          desc="Ver quién espera"
          onClick={() => setIsSalaOpen(true)}
        />

        <QuickCard
          icon={Plus}
          title="Nuevo turno"
          desc="Registrar turno"
          onClick={() => router.push("/agenda?nuevo=1")}
        />
      </div>

      {/* ── RESUMEN DEL DÍA ────────────────────────────── */}
      <div>
        <h2 className="text-xs uppercase tracking-widest text-[#1e5e5e] font-bold opacity-60 mb-4">
          Resumen del día
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Pendientes"
            value={resumen.pendientes}
            icon={ClipboardList}
            color="text-slate-700"
            loading={loading}
          />

          <StatCard
            label="En sala"
            value={resumen.enSala}
            icon={Clock}
            color="text-[#39B5B5]"
            loading={loading}
          />

          <StatCard
            label="Atendidos"
            value={resumen.atendidos}
            icon={CheckCircle2}
            color="text-emerald-500"
            loading={loading}
          />

          <StatCard
            label="Cancelados"
            value={resumen.cancelados}
            icon={XCircle}
            color="text-rose-400"
            loading={loading}
          />
        </div>
      </div>

      {/* ── SALA SHEET ─────────────────────────────────── */}
      <SalaSheet
        open={isSalaOpen}
        onClose={() => setIsSalaOpen(false)}
      />
    </div>
  )
}

// ─── QuickCard ────────────────────────────────────────────
function QuickCard({
  icon: Icon,
  title,
  desc,
  onClick,
}: {
  icon: React.ElementType
  title: string
  desc: string
  onClick: () => void
}) {
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
          <p className="font-bold text-white/60 group-hover:text-white transition-colors duration-500">
            {title}
          </p>

          <p className="text-[11px] text-white/40 group-hover:text-white transition-colors duration-500">
            {desc}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── StatCard ─────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  color,
  loading,
}: {
  label: string
  value: number
  icon: React.ElementType
  color: string
  loading: boolean
}) {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${color}`} />

          <p className="text-xs uppercase tracking-widest text-[#1e5e5e] font-bold opacity-70">
            {label}
          </p>
        </div>

        {loading ? (
          <div className="h-10 w-12 bg-slate-100 animate-pulse rounded-lg" />
        ) : (
          <p className={`text-5xl font-light ${color}`}>
            {String(value).padStart(2, "0")}
          </p>
        )}
      </CardContent>
    </Card>
  )
}