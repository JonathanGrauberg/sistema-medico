"use client"

import { ReactNode, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Calendar, Users, FileText, BarChart3, Timer } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { SalaSheet } from "@/components/sala-sheet" // 🔥 Importamos el nuevo componente

const menu = [
  { label: "Dashboard", icon: BarChart3, href: "/dashboard" },
  { label: "Turnos", icon: Calendar, href: "/turnos" },
  { label: "Pacientes", icon: Users, href: "/pacientes" },
  { label: "Nomenclador", icon: FileText, href: "/nomenclador" },
  { label: "Sala", icon: Timer, href: "/sala", isModal: true },
]

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSalaOpen, setIsSalaOpen] = useState(false)

  return (
    <div className="min-h-screen relative overflow-hidden font-sans">
      <div className="fixed inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('/fondoblur.png')", transform: "scale(1.05)" }} />
      <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-[1px] z-0" />

      <div className="relative z-10 flex flex-col h-screen p-6 gap-6">
        <div className="flex flex-1 overflow-hidden gap-6">
          
          {/* SIDEBAR */}
          <aside className="w-[260px] flex flex-col rounded-[2.5rem] bg-[#39B5B5]/20 backdrop-blur-2xl border border-white/20 overflow-hidden shadow-xl">
            <div className="p-8 pt-10">
              <p className="text-slate-900 font-black text-lg">Dr. Usuario</p>
              <p className="text-[11px] uppercase tracking-widest text-[#1e5e5e] font-black opacity-80">Profesional</p>
            </div>
            <nav className="flex-1 px-4">
              <ul className="space-y-3">
                {menu.map((item) => {
                  const Icon = item.icon
                  const active = pathname.startsWith(item.href)
                  return (
                    <li
                      key={item.label}
                      onClick={() => item.isModal ? setIsSalaOpen(true) : router.push(item.href)}
                      className={`flex items-center gap-4 px-6 py-4 rounded-[1.5rem] cursor-pointer text-sm font-bold transition-all duration-500 group ${active && !item.isModal ? "bg-[#39B5B5] text-white shadow-lg shadow-[#39B5B5]/40 scale-[1.03]" : "text-[#1e5e5e] hover:bg-white/40 hover:text-slate-900"}`}
                    >
                      <Icon className={`w-5 h-5 ${active && !item.isModal ? "text-white" : "text-[#39B5B5]"}`} />
                      {item.label}
                    </li>
                  )
                })}
              </ul>
            </nav>
          </aside>

          {/* CONTENT AREA */}
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            <header className="w-full"><Navbar /></header>
            <main className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
              <div className="max-w-7xl mx-auto pb-10">{children}</div>
            </main>
          </div>
        </div>
      </div>

      {/* 🔥 UNIFICADO: Llamamos al mismo componente aquí */}
      <SalaSheet open={isSalaOpen} onClose={() => setIsSalaOpen(false)} />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(57, 181, 181, 0.3); border-radius: 10px; }
      `}</style>
    </div>
  )
}