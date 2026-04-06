"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Plus,
  Users,
  Calendar,
  FileText,
  BarChart3
} from "lucide-react"

import { useRouter } from "next/navigation"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { UserDetails } from "@/components/user-details"
import { UserForm } from "@/components/user-form"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/sonner"

import type { User } from "@/lib/types"

export default function ProfesionalPage() {
  const router = useRouter()

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState("pacientes")
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetch("/api/pacientes")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err))
  }, [])

  const filteredUsers = users.filter(user => {
    const q = searchQuery.toLowerCase()
    return (
      user.nombre.toLowerCase().includes(q) ||
      user.apellido.toLowerCase().includes(q) ||
      user.dni.includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Toaster position="top-right" richColors />

      <main className="container mx-auto max-w-6xl px-4 py-8 space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">
            Panel Profesional
          </h1>
          <p className="text-muted-foreground">
            Gestioná tu clínica de forma simple
          </p>
        </div>

        {/* 🔥 CARDS RÁPIDAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

          <QuickCard
            icon={Calendar}
            title="Turnos"
            desc="Ver agenda"
            onClick={() => router.push("/turnos")}
          />

          <QuickCard
            icon={Users}
            title="Pacientes"
            desc="Gestionar pacientes"
            onClick={() => setActiveTab("pacientes")}
          />

          <QuickCard
            icon={FileText}
            title="Nomenclador"
            desc="Próximamente"
          />

          <QuickCard
            icon={BarChart3}
            title="Reportes"
            desc="Próximamente"
          />
        </div>

        {/* CONTENIDO */}
        {selectedUser ? (
          <UserDetails
            user={selectedUser}
            onBack={() => setSelectedUser(null)}
            onUserDeleted={() => {
              setUsers(prev => prev.filter(u => u.id !== selectedUser.id))
              setSelectedUser(null)
            }}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>

            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pacientes">
                <Users className="mr-2 h-4 w-4" />
                Pacientes
              </TabsTrigger>

              <TabsTrigger value="crear">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pacientes" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pacientes</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">

                  {/* 🔍 BUSCADOR */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar paciente..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {/* LISTA */}
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      Sin resultados
                    </div>
                  ) : (
                    <div className="divide-y border rounded-lg">
                      {filteredUsers.map(user => (
                        <button
                          key={user.id}
                          onClick={() => setSelectedUser(user)}
                          className="w-full p-4 text-left hover:bg-muted/50 flex justify-between"
                        >
                          <div>
                            <p className="font-medium">
                              {user.nombre} {user.apellido}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              DNI: {user.dni}
                            </p>
                          </div>

                          <span className="text-sm text-muted-foreground">
                            Ver →
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="crear" className="mt-6">
              <UserForm
                onUserCreated={(newUser) => {
                  setUsers(prev => [...prev, newUser])
                  setActiveTab("pacientes")
                }}
              />
            </TabsContent>

          </Tabs>
        )}
      </main>
    </div>
  )
}

// ================= QUICK CARD =================

function QuickCard({ icon: Icon, title, desc, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded bg-[#39B5B5]/10">
          <Icon className="w-5 h-5 text-[#39B5B5]" />
        </div>

        <div>
          <p className="font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
    </div>
  )
}