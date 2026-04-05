"use client"

import React, { useState } from "react"
import {
  Calendar,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

import { AgendaMedicos } from "@/components/agenda-medicos"

const SidebarItem = ({ icon: Icon, text, active = false, onClick }: any) => (
  <li
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-3 cursor-pointer text-sm transition-colors border-b border-gray-100
    ${active ? "bg-[#39B5B5] text-white" : "text-gray-600 hover:bg-gray-50"}`}
  >
    <Icon className="w-4 h-4" />
    <span className={active ? "font-medium" : ""}>{text}</span>
  </li>
)

export default function TurnosPage() {
  const [fechaBase, setFechaBase] = useState(new Date())
  const [search, setSearch] = useState("")

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-[260px] bg-white border-r flex flex-col">

        {/* Perfil */}
        <div className="p-6">
          <h2 className="font-semibold text-sm">
            Dr. Juan Pérez
          </h2>
          <p className="text-xs text-gray-500">
            Médico
          </p>
        </div>

        {/* Navegación */}
        <ul>
          <SidebarItem icon={Calendar} text="AGENDA" active />
          <SidebarItem icon={Users} text="PACIENTES" />
          <SidebarItem icon={FileText} text="ESTUDIOS" />
          <SidebarItem icon={FileText} text="NOMENCLADOR" />
          <SidebarItem icon={Settings} text="CONFIGURACIÓN" />
          <SidebarItem
            icon={LogOut}
            text="SALIR"
            onClick={() => (window.location.href = "/profesional")}
          />
        </ul>

        {/* Calendario */}
        <MiniCalendar fechaBase={fechaBase} setFechaBase={setFechaBase} />
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col">

        {/* Header */}
        <header className="h-14 bg-white border-b flex justify-between items-center px-4">
          <h1 className="font-semibold">Agenda</h1>

          <div className="flex gap-2">
            <button
              onClick={() => {
                const d = new Date(fechaBase)
                d.setDate(d.getDate() - 7)
                setFechaBase(d)
              }}
              className="p-2 border rounded"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                const d = new Date(fechaBase)
                d.setDate(d.getDate() + 7)
                setFechaBase(d)
              }}
              className="p-2 border rounded"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* 🔍 Buscador */}
        <div className="p-4">
          <div className="max-w-xl mx-auto">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar paciente..."
              className="w-full rounded-full px-5 py-3 bg-white border shadow-sm focus:outline-none focus:ring-2 focus:ring-[#39B5B5]"
            />
          </div>
        </div>

        {/* Agenda */}
        <AgendaMedicos fechaBase={fechaBase} search={search} />
      </main>

      {/* ➕ Botón flotante */}
      <button
        onClick={() => alert("Crear turno (próximo paso)")}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#39B5B5] text-white text-2xl shadow-lg hover:scale-105 transition"
      >
        +
      </button>
    </div>
  )
}

// ================= MINI CALENDAR =================

function MiniCalendar({ fechaBase, setFechaBase }: any) {
  const meses = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ]

  const generarMes = (fecha: Date) => {
    const dias = []
    const fin = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0)

    for (let i = 1; i <= fin.getDate(); i++) {
      dias.push(new Date(fecha.getFullYear(), fecha.getMonth(), i))
    }

    return dias
  }

  const dias = generarMes(fechaBase)

  return (
    <div className="p-4 border-t mt-auto">
      <div className="text-center text-sm font-semibold mb-2">
        {meses[fechaBase.getMonth()]} {fechaBase.getFullYear()}
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs text-center">
        {dias.map((d, i) => {
          const esHoy =
            d.toDateString() === new Date().toDateString()

          return (
            <button
              key={i}
              onClick={() => setFechaBase(d)}
              className={`p-1 rounded
                ${esHoy ? "bg-[#39B5B5] text-white" : "hover:bg-gray-200"}
              `}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}