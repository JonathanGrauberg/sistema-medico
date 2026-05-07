"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarDays,
  LayoutDashboard,
  Users,
} from "lucide-react"

const navItems = [
  {
    href: "/agenda",
    label: "Agenda",
    icon: CalendarDays,
  },
  {
    href: "/secretaria",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/pacientes",
    label: "Pacientes",
    icon: Users,
  },
]

export default function SecretariaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-muted/30">
      {/* HEADER */}
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-semibold">
              Panel Secretaría
            </h1>

            <p className="text-sm text-muted-foreground">
              Gestión diaria de turnos y pacientes
            </p>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* SIDEBAR */}
        <aside className="hidden w-64 border-r bg-background md:block">
          <nav className="flex flex-col gap-2 p-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}