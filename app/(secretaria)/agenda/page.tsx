"use client"

// app/(secretaria)/agenda/page.tsx
//
// Agenda médica profesional — vista de día por médico
// Mantiene: fetch /api/turnos, updateEstado(), TurnoModal

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"

import { TurnoModal } from "@/components/turno-modal"

import { AgendaHeader }    from "@/components/agenda/AgendaHeader"
import { AgendaToolbar }   from "@/components/agenda/AgendaToolbar"
import { AgendaGrid }      from "@/components/agenda/AgendaGrid"
import { AgendaMobileList } from "@/components/agenda/AgendaMobileList"

import { Turno, Medico, fechaLocalISO, extraerHora } from "@/components/agenda/types"

// ─────────────────────────────────────────────────────────────────────────────

export default function AgendaSecretariaPage() {
  const searchParams = useSearchParams()

  // ── Estado base ──────────────────────────────────────────────────────────
  const [turnos,  setTurnos]  = useState<Turno[]>([])
  const [loading, setLoading] = useState(true)
  const [fecha,   setFecha]   = useState(new Date())
  const [vista,   setVista]   = useState<"dia" | "semana">("dia")

  // ── Filtros ───────────────────────────────────────────────────────────────
  const [search,         setSearch]         = useState("")
  const [medicoFiltro,   setMedicoFiltro]   = useState("todos")
  const [estadoFiltro,   setEstadoFiltro]   = useState("todos")
  const [soloPendientes, setSoloPendientes] = useState(false)

  // ── Modal ─────────────────────────────────────────────────────────────────
  const [openModal,       setOpenModal]       = useState(false)
  const [modalFechaHora,  setModalFechaHora]  = useState<Date | undefined>()
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<Turno | null>(null)

  // ── Abrir modal automático ?nuevo=1 ───────────────────────────────────────
  useEffect(() => {
    if (searchParams.get("nuevo") === "1") setOpenModal(true)
  }, [searchParams])

  // ── Fetch turnos ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fechaISO = fechaLocalISO(fecha)
    setLoading(true)

    fetch(`/api/turnos?fecha=${fechaISO}`)
      .then((res) => res.json())
      .then((data) => setTurnos(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [fecha])

  // ── Médicos únicos (del día) ──────────────────────────────────────────────
  const medicos = useMemo<Medico[]>(() => {
    const map = new Map<string, Medico>()
    turnos.forEach((t) => {
      if (!map.has(t.medico.id)) map.set(t.medico.id, t.medico)
    })
    return Array.from(map.values())
  }, [turnos])

  // ── Filtrado ──────────────────────────────────────────────────────────────
  const turnosFiltrados = useMemo(() => {
    return turnos.filter((t) => {
      const txt = search.toLowerCase()

      const matchSearch =
        !txt ||
        `${t.paciente.nombre} ${t.paciente.apellido}`.toLowerCase().includes(txt) ||
        t.paciente.dni.includes(txt) ||
        `${t.medico.nombre} ${t.medico.apellido}`.toLowerCase().includes(txt)

      const matchMedico =
        medicoFiltro === "todos" || t.medico.id === medicoFiltro

      const matchEstado =
        estadoFiltro === "todos" || t.estado === estadoFiltro

      const matchPendientes =
        !soloPendientes || t.estado === "PENDIENTE"

      return matchSearch && matchMedico && matchEstado && matchPendientes
    })
  }, [turnos, search, medicoFiltro, estadoFiltro, soloPendientes])

  // Médicos filtrados (para mostrar solo columnas relevantes)
  const medicosFiltrados = useMemo<Medico[]>(() => {
    if (medicoFiltro === "todos") return medicos
    return medicos.filter((m) => m.id === medicoFiltro)
  }, [medicos, medicoFiltro])

  // ── updateEstado ──────────────────────────────────────────────────────────
  const updateEstado = useCallback(async (turnoId: string, estado: string) => {
    try {
      await fetch(`/api/turnos/${turnoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      })
      setTurnos((prev) =>
        prev.map((t) =>
          t.id === turnoId ? { ...t, estado: estado as any } : t
        )
      )
    } catch (err) {
      console.error(err)
    }
  }, [])

  // ── Handlers de fecha ─────────────────────────────────────────────────────
  const irAnterior = () =>
    setFecha((prev) => { const d = new Date(prev); d.setDate(d.getDate() - 1); return d })

  const irSiguiente = () =>
    setFecha((prev) => { const d = new Date(prev); d.setDate(d.getDate() + 1); return d })

  // ── Click en turno (abrir modal con detalle) ──────────────────────────────
  const handleTurnoClick = useCallback((turno: Turno) => {
    setTurnoSeleccionado(turno)
    setModalFechaHora(undefined)
    setOpenModal(true)
  }, [])

  // ── Click en slot vacío (nuevo turno con hora precargada) ─────────────────
  const handleSlotClick = useCallback((medicoId: string, hora: string) => {
    // Construir un Date con la fecha actual + hora del slot
    const [h, m] = hora.split(":").map(Number)
    const d = new Date(fecha)
    d.setHours(h, m, 0, 0)
    setModalFechaHora(d)
    setTurnoSeleccionado(null)
    setOpenModal(true)
  }, [fecha])

  // ── Nuevo turno (botón header) ────────────────────────────────────────────
  const handleNuevoTurno = () => {
    setTurnoSeleccionado(null)
    setModalFechaHora(undefined)
    setOpenModal(true)
  }

  // ── Cerrar modal y refrescar ──────────────────────────────────────────────
  const handleCloseModal = (open: boolean) => {
    setOpenModal(open)
    if (!open) {
      // Re-fetch al cerrar para mostrar turnos nuevos
      const fechaISO = fechaLocalISO(fecha)
      setLoading(true)
      fetch(`/api/turnos?fecha=${fechaISO}`)
        .then((r) => r.json())
        .then((data) => setTurnos(Array.isArray(data) ? data : []))
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      {/* ── Header sticky ── */}
      <AgendaHeader
        fecha={fecha}
        onPrev={irAnterior}
        onNext={irSiguiente}
        onHoy={() => setFecha(new Date())}
        onNuevoTurno={handleNuevoTurno}
        vista={vista}
        onVistaChange={setVista}
        totalPacientes={turnos.length}
      />

      {/* ── Toolbar filtros ── */}
      <AgendaToolbar
        search={search}
        onSearchChange={setSearch}
        medicoId={medicoFiltro}
        onMedicoChange={setMedicoFiltro}
        estado={estadoFiltro}
        onEstadoChange={setEstadoFiltro}
        soloPendientes={soloPendientes}
        onSoloPendientesChange={setSoloPendientes}
        medicos={medicos}
        totalFiltrados={turnosFiltrados.length}
        totalTotal={turnos.length}
      />

      {/* ── Grid desktop (oculto en mobile) ── */}
      <div className="hidden lg:flex flex-1 overflow-hidden flex-col">
        <AgendaGrid
          turnos={turnosFiltrados}
          medicos={medicosFiltrados}
          loading={loading}
          onUpdateEstado={updateEstado}
          onTurnoClick={handleTurnoClick}
          onSlotClick={handleSlotClick}
        />
      </div>

      {/* ── Lista mobile (oculta en desktop) ── */}
      <div className="flex lg:hidden flex-1 overflow-auto flex-col">
        <AgendaMobileList
          turnos={turnosFiltrados}
          loading={loading}
          onUpdateEstado={updateEstado}
          onTurnoClick={handleTurnoClick}
        />
      </div>

      {/* ── Modal ── */}
      <TurnoModal
        open={openModal}
        onOpenChange={handleCloseModal}
        fecha={modalFechaHora ?? fecha}
      />
    </div>
  )
}
