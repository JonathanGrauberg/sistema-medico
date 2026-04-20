"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Search, Plus, Users } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { UserDetails } from "@/components/user-details"
import { UserForm } from "@/components/user-form"

import type { User } from "@/lib/types"

type Role = "MEDICO" | "SECRETARIA"

export default function PacientesPage() {
  const pathname = usePathname()

  const role: Role = pathname.startsWith("/secretaria")
    ? "SECRETARIA"
    : "MEDICO"

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState("pacientes")
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetch("/api/pacientes")
      .then(res => res.json())
      .then(setUsers)
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
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-[#39B5B5]" />
          Pacientes
        </h1>
        <p className="text-muted-foreground">
          Gestión de pacientes
        </p>
      </div>

      {selectedUser ? (
        <UserDetails
          user={selectedUser}
          role={role}
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

            {/* 🔥 SECRETARIA TAMBIÉN PUEDE CREAR PACIENTE */}
            <TabsTrigger value="crear">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo
            </TabsTrigger>

          </TabsList>

          <TabsContent value="pacientes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Lista de pacientes</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar paciente..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

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

    </div>
  )
}