"use client"

import { useEffect, useState } from "react"

import {
  Search,
  Users,
  Plus,
} from "lucide-react"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"

import { SecretariaUserForm } from "@/components/secretaria-user-form"

import { SecretariaPatientDetails } from "@/components/secretaria-patient-details"

import type { User } from "@/lib/types"

export default function SecretariaPacientesPage() {
  const [users, setUsers] =
    useState<User[]>([])

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null)

  const [search, setSearch] =
    useState("")

  const [tab, setTab] =
    useState("pacientes")

  // ─────────────────────────────────────────────
  // Fetch
  // ─────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/pacientes")
      .then((res) => res.json())
      .then(setUsers)
  }, [])

  // ─────────────────────────────────────────────
  // Filter
  // ─────────────────────────────────────────────
  const filtered = users.filter((u) => {
    const q = search.toLowerCase()

    return (
      `${u.nombre} ${u.apellido}`
        .toLowerCase()
        .includes(q) ||
      u.dni.includes(q)
    )
  })

  // ─────────────────────────────────────────────
  // Details
  // ─────────────────────────────────────────────
  if (selectedUser) {
    return (
      <SecretariaPatientDetails
        user={selectedUser}
        onBack={() =>
          setSelectedUser(null)
        }
        onUpdated={(updated) => {
          setUsers((prev) =>
            prev.map((u) =>
              u.id === updated.id
                ? updated
                : u
            )
          )

          setSelectedUser(updated)
        }}
      />
    )
  }

  // ─────────────────────────────────────────────
  // Page
  // ─────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-[#39B5B5]" />

          Pacientes
        </h1>

        <p className="text-muted-foreground">
          Gestión administrativa de pacientes
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        value={tab}
        onValueChange={setTab}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pacientes">
            <Users className="mr-2 h-4 w-4" />

            Pacientes
          </TabsTrigger>

          <TabsTrigger value="nuevo">
            <Plus className="mr-2 h-4 w-4" />

            Nuevo
          </TabsTrigger>
        </TabsList>

        {/* Lista */}
        <TabsContent
          value="pacientes"
          className="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>
                Lista de pacientes
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  placeholder="Buscar paciente..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  className="pl-9"
                />
              </div>

              {/* List */}
              {filtered.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  Sin resultados
                </div>
              ) : (
                <div className="divide-y border rounded-lg">
                  {filtered.map((user) => (
                    <button
                      key={user.id}
                      onClick={() =>
                        setSelectedUser(
                          user
                        )
                      }
                      className="w-full p-4 text-left hover:bg-muted/50 flex justify-between"
                    >
                      <div>
                        <p className="font-medium">
                          {user.nombre}{" "}
                          {user.apellido}
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

        {/* Nuevo */}
        <TabsContent
          value="nuevo"
          className="mt-6"
        >
          <SecretariaUserForm
            onUserCreated={(newUser) => {
              setUsers((prev) => [
                ...prev,
                newUser,
              ])

              setTab("pacientes")
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}