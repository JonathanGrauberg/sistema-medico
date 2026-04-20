"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard,
  Users,
  Calendar,
  Activity,
  LogOut
} from "lucide-react"

import { SalaSheet } from "@/components/sala-sheet"

const menu = [
  {
    label: "Dashboard",
    href: "/secretaria",
    icon: LayoutDashboard
  },
  {
    label: "Pacientes",
    href: "secretaria/pacientes",
    icon: Users
  },
  {
    label: "Agenda",
    href: "secretaria/agenda",
    icon: Calendar
  },
  {
    label: "Sala de espera",
    href: "#",
    icon: Activity,
    isModal: true
  }
]

export default function SecretariaLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [openSala, setOpenSala] = useState(false)

  return (
    <div className="flex h-screen bg-slate-50">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r flex flex-col">

        <div className="h-16 flex items-center px-6 border-b">
          <h1 className="font-bold text-lg text-[#1e5e5e]">
            Secretaría
          </h1>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href

            if ((item as any).isModal) {
              return (
                <div
                  key={item.label}
                  onClick={() => setOpenSala(true)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm cursor-pointer text-slate-600 hover:bg-slate-100"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </div>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all
                  ${
                    active
                      ? "bg-[#39B5B5] text-white font-semibold"
                      : "text-slate-600 hover:bg-slate-100"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t">
          <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-500">
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>

      {/* 🔥 MODAL SALA */}
      <SalaSheet open={openSala} onClose={() => setOpenSala(false)} />
    </div>
  )
}