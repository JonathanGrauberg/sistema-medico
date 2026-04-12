"use client"

import { useEffect, useState } from "react"
import { X, UserCheck } from "lucide-react" // Añadimos iconos para mejor look

type Props = {
  open: boolean
  onClose: () => void
}

export function SalaModal({ open, onClose }: Props) {
  const [turnos, setTurnos] = useState<any[]>([])

  useEffect(() => {
    if (!open) return
    fetch("/api/turnos")
      .then(res => res.json())
      .then(data => {
        const hoy = new Date()
        const hoyStr = hoy.toISOString().split('T')[0] // Forma más limpia de obtener fecha

        const enSala = data
          .filter((t: any) => {
            const fechaStr = new Date(t.fecha).toISOString().split('T')[0]
            return t.estado === "EN_SALA" && fechaStr === hoyStr
          })
          .sort((a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())

        setTurnos(enSala)
      })
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* OVERLAY OSCURO TRASLÚCIDO */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* CONTENEDOR MODAL GLASS */}
      <div className="relative w-full max-w-md bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/40 overflow-hidden transition-all animate-in fade-in zoom-in duration-300">
        
        {/* HEADER */}
        <div className="p-6 border-b border-white/20 flex justify-between items-center bg-white/20">
          <div>
            <h2 className="font-bold text-xl text-slate-800">Sala de espera</h2>
            <p className="text-[10px] uppercase tracking-widest text-[#1e5e5e] font-bold">Pacientes hoy</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LISTA */}
        <div className="max-h-[450px] overflow-y-auto p-4 custom-scrollbar">
          {turnos.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <div className="bg-[#39B5B5]/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-[#39B5B5]">
                <UserCheck className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-600">No hay pacientes en espera</p>
            </div>
          ) : (
            <div className="space-y-3">
              {turnos.map((t) => {
                const fecha = new Date(t.fecha)
                return (
                  <div 
                    key={t.id} 
                    className="p-4 bg-white/40 border border-white/50 rounded-2xl flex justify-between items-center hover:bg-white/60 transition-colors shadow-sm"
                  >
                    <div>
                      <p className="font-bold text-slate-800">
                        {t.paciente?.apellido}, {t.paciente?.nombre}
                      </p>
                      <p className="text-[11px] font-semibold text-[#39B5B5]">
                        Llegada: {fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>

                    <div className="text-[10px] font-bold uppercase tracking-wider bg-[#39B5B5] text-white px-3 py-1.5 rounded-full shadow-lg shadow-[#39B5B5]/20">
                      En sala
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* FOOTER OPCIONAL */}
        <div className="p-4 bg-white/20 text-center">
           <button 
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-[#39B5B5] transition-colors"
           >
             Cerrar ventana
           </button>
        </div>
      </div>
    </div>
  )
}