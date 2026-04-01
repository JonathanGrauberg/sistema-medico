"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { UserDetails } from "@/components/user-details"
import { UserForm } from "@/components/user-form"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/sonner"
import type { User } from "@/lib/types"

export default function ProfesionalPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState("pacientes")
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])

  // 🔥 TRAER PACIENTES REALES
  useEffect(() => {
    fetch("/api/pacientes")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Error cargando pacientes:", err))
  }, [])

  // 🔥 CUANDO SE CREA UN PACIENTE
  const handleUserCreated = (newUser: User) => {
    setUsers(prev => [...prev, newUser])
    setActiveTab("pacientes")
  }

  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
  }

  const handleBack = () => {
    setSelectedUser(null)
  }

  const handleUserDeleted = () => {
    if (selectedUser) {
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id))
    }
    setSelectedUser(null)
  }

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase()
    return (
      user.nombre.toLowerCase().includes(query) ||
      user.apellido.toLowerCase().includes(query) ||
      user.dni.includes(query)
    )
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Toaster position="top-right" richColors />

      <main className="container mx-auto max-w-5xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Panel Profesional
          </h1>
          <p className="mt-2 text-muted-foreground">
            Administra pacientes, archivos médicos e historias clínicas
          </p>
        </header>

        {selectedUser ? (
          <UserDetails
            user={selectedUser}
            onBack={handleBack}
            onUserDeleted={handleUserDeleted}
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
                Nuevo Paciente
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pacientes" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Pacientes</CardTitle>
                  <CardDescription>
                    {users.length} paciente{users.length !== 1 ? "s" : ""} registrado{users.length !== 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre o DNI..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {filteredUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Users className="h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">
                        {searchQuery ? "No se encontraron pacientes" : "No hay pacientes registrados"}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y rounded-lg border">
                      {filteredUsers.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleUserSelect(user)}
                          className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50"
                        >
                          <div>
                            <p className="font-medium">
                              {user.nombre} {user.apellido}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              DNI: {user.dni}
                            </p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Ver detalle
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="crear" className="mt-6">
              <UserForm onUserCreated={handleUserCreated} />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}