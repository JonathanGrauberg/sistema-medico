"use client"

import { useEffect, useState } from "react"
import { Timer, UserCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

type Props = {
  open: boolean
  onClose: () => void
}

export function SalaSheet({ open, onClose }: Props) {
  const [turnos, setTurnos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch("/api/turnos")
      .then(res => res.json())
      .then(data => {
        const hoyStr = new Date().toISOString().split('T')[0]
        const enSala = data
          .filter((t: any) => {
            const fechaStr = new Date(t.fecha).toISOString().split('T')[0]
            return t.estado === "EN_SALA" && fechaStr === hoyStr
          })
          .sort((a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
        setTurnos(enSala)
      })
      .finally(() => setLoading(false))
  }, [open])

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="bg-white/60 backdrop-blur-3xl border-l border-white/40 rounded-l-[3rem] w-[400px] shadow-2xl p-0 overflow-hidden flex flex-col border-none">
        
        {/* HEADER */}
        <SheetHeader className="p-8 border-b border-[#39B5B5]/10 bg-white/20">
          <div className="flex items-center gap-4">
            <div className={`p-3 bg-[#39B5B5]/20 rounded-2xl ${loading ? 'animate-pulse' : ''}`}>
              <Timer className="w-6 h-6 text-[#2a8686]" />
            </div>
            <div>
              <SheetTitle className="text-2xl font-black text-slate-900 leading-none">Sala de Espera</SheetTitle>
              <p className="text-[10px] uppercase font-black text-[#39B5B5] tracking-widest mt-2">Pacientes en recepción</p>
            </div>
          </div>
        </SheetHeader>

        {/* LISTA DE PACIENTES */}
        <div className="flex-1 p-8 space-y-4 overflow-y-auto custom-scrollbar">
          {turnos.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
              <UserCheck className="w-12 h-12 text-slate-400 mb-2" />
              <p className="text-sm font-bold text-slate-500 italic">No hay pacientes esperando en este momento.</p>
            </div>
          ) : (
            turnos.map((t) => (
              <div key={t.id} className="bg-white/40 border border-white/60 p-5 rounded-[2rem] shadow-sm flex items-center justify-between hover:bg-white/70 transition-all group">
                <div>
                  <p className="font-bold text-slate-900 group-hover:text-black">
                    {t.paciente?.apellido}, {t.paciente?.nombre}
                  </p>
                  <p className="text-[10px] font-black text-slate-500 uppercase">
                    Llegada: <span className="text-[#39B5B5]">
                      {new Date(t.fecha).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </p>
                </div>
                <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
              </div>
            ))
          )}
        </div>

        {/* FOOTER ACCIÓN */}
        <div className="p-8 bg-white/20 border-t border-white/40">
          <button 
            onClick={() => { onClose(); router.push('/sala'); }}
            className="w-full py-4 bg-[#39B5B5] text-white rounded-[1.5rem] font-bold text-sm shadow-xl shadow-[#39B5B5]/30 hover:bg-[#2a8686] hover:scale-[1.02] transition-all"
          >
            GESTIONAR SALA COMPLETA
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}