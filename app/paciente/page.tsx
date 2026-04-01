"use client"

import { useState } from "react"
import { FileText, ArrowLeft, Calendar, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { FileTable } from "@/components/file-table"
import { Toaster } from "@/components/ui/sonner"
import { mockUsers, getMockFilesByUserId, getMockHistoriaByUserId } from "@/lib/mock-data"
import type { User, FileRecord, HistoriaClinica } from "@/lib/types"

// Usamos el primer paciente mockeado como default
const defaultUser = mockUsers[0]

export default function PacientePage() {
  const [user] = useState<User>(defaultUser)
  const [files] = useState<FileRecord[]>(getMockFilesByUserId(defaultUser.id))
  const [historia] = useState<HistoriaClinica | undefined>(getMockHistoriaByUserId(defaultUser.id))

  const estudios = files.filter(f => f.tipo === "ESTUDIO")
  const informes = files.filter(f => f.tipo === "INFORME")

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Toaster position="top-right" richColors />

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <a href="/">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Volver</span>
              </a>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {user.nombre} {user.apellido}
              </h1>
              <p className="text-muted-foreground">
                DNI: {user.dni}
              </p>
            </div>
          </div>

          <Tabs defaultValue="archivos">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="archivos">
                <FileText className="mr-2 h-4 w-4" />
                Mis Archivos
              </TabsTrigger>
              <TabsTrigger value="historia">
                <Stethoscope className="mr-2 h-4 w-4" />
                Historia Clinica
              </TabsTrigger>
            </TabsList>

            <TabsContent value="archivos" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Archivos Medicos</CardTitle>
                  <CardDescription>
                    {files.length} archivo{files.length !== 1 ? "s" : ""} disponible{files.length !== 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {files.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">
                        No tienes archivos disponibles
                      </p>
                    </div>
                  ) : (
                    <Tabs defaultValue="todos">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="todos">
                          Todos ({files.length})
                        </TabsTrigger>
                        <TabsTrigger value="estudios">
                          Estudios ({estudios.length})
                        </TabsTrigger>
                        <TabsTrigger value="informes">
                          Informes ({informes.length})
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="todos" className="mt-4">
                        <FileTable files={files} showDelete={false} />
                      </TabsContent>

                      <TabsContent value="estudios" className="mt-4">
                        <FileTable files={estudios} showDelete={false} />
                      </TabsContent>

                      <TabsContent value="informes" className="mt-4">
                        <FileTable files={informes} showDelete={false} />
                      </TabsContent>
                    </Tabs>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="historia" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historia Clinica</CardTitle>
                  <CardDescription>
                    Registro de consultas y tratamientos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!historia || historia.entries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Stethoscope className="h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">
                        No hay registros en tu historia clinica
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {historia.entries
                        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                        .map((entry) => (
                          <Card key={entry.id} className="border-l-4 border-l-primary">
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base">{entry.motivo}</CardTitle>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(entry.fecha)}
                                </div>
                              </div>
                              <CardDescription>{entry.medicoNombre}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                              <div>
                                <p className="font-medium text-foreground">Diagnostico</p>
                                <p className="text-muted-foreground">{entry.diagnostico}</p>
                              </div>
                              <div>
                                <p className="font-medium text-foreground">Tratamiento</p>
                                <p className="text-muted-foreground">{entry.tratamiento}</p>
                              </div>
                              {entry.observaciones && (
                                <div>
                                  <p className="font-medium text-foreground">Observaciones</p>
                                  <p className="text-muted-foreground">{entry.observaciones}</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
