"use client"

import React, { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Plus
} from "lucide-react"

import { AgendaMedicos } from "@/components/agenda-medicos"
import { TurnoModal } from "@/components/turno-modal"

export default function TurnosPage() {
  const [fechaBase, setFechaBase] = useState(new Date())
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedFecha, setSelectedFecha] = useState<string | null>(null)
  const [turnos, setTurnos] = useState<any[]>([])

  const cambiarSemana = (dias: number) => {
    const d = new Date(fechaBase)
    d.setDate(d.getDate() + dias)
    setFechaBase(d)
  }

  return (
    // h-[calc(100vh-140px)] asegura que el contenedor no se pase del alto de la pantalla
    <div className="flex flex-col h-[calc(100vh-120px)] space-y-4 overflow-hidden">

      {/* 🔝 HEADER GLASS (FIJO Arriba) */}
      <header className="flex-none h-20 bg-white/40 backdrop-blur-md border border-white/40 rounded-[2rem] flex justify-between items-center px-8 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Agenda</h1>
          <p className="text-[10px] uppercase tracking-widest text-[#1e5e5e] font-bold opacity-60">Gestión de Turnos Semanal</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => cambiarSemana(-7)}
            className="p-3 bg-white/50 border border-white/40 rounded-2xl hover:bg-[#39B5B5] hover:text-white transition-all duration-300 shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => cambiarSemana(7)}
            className="p-3 bg-white/50 border border-white/40 rounded-2xl hover:bg-[#39B5B5] hover:text-white transition-all duration-300 shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 🔍 BUSCADOR (FIJO Arriba) */}
      <div className="flex-none relative group max-w-2xl mx-auto w-full px-4 sm:px-0">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-[#39B5B5]" />
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar paciente o médico..."
          className="w-full rounded-2xl pl-14 pr-6 py-3 bg-white/30 backdrop-blur-md border border-white/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#39B5B5]/50 transition-all font-medium"
        />
      </div>

      {/* 📅 CONTENEDOR DE AGENDA (Ocupa el resto del espacio) */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <AgendaMedicos
          fechaBase={fechaBase}
          search={search}
          onSlotClick={(dia: any, hora: string, turno: any) => {
            if (!turno) {
              const fechaCompleta = `${dia.dateKey}T${hora}:00`
              setSelectedFecha(fechaCompleta)
              setModalOpen(true)
            }
          }}
          onTurnoClick={async (turno: any) => {
            if (confirm("¿Eliminar este turno?")) {
              await fetch(`/api/turnos/${turno.id}`, { method: "DELETE" })
              // Recargar datos (la lógica de fetch está dentro del componente AgendaMedicos también)
              window.location.reload(); 
            }
          }}
        />
      </div>

      {/* ➕ BOTÓN FLOTANTE */}
      <button
        onClick={() => {
          setSelectedFecha(null)
          setModalOpen(true)
        }}
        className="fixed bottom-10 right-10 w-16 h-16 rounded-2xl bg-[#39B5B5] text-white shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-50"
      >
        <Plus className="w-8 h-8" />
      </button>

      <TurnoModal
        open={modalOpen}
        fecha={selectedFecha}
        onClose={() => setModalOpen(false)}
        onCreated={() => window.location.reload()}
      />
    </div>
  )
}