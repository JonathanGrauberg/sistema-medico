"use client"

import { useEffect, useState } from "react"
import { FileText, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { FileTable } from "@/components/file-table"
import { Toaster } from "@/components/ui/sonner"

const PACIENTE_ID = "cmng6jvzm0001v5wcp14by9yp"

export default function PacientePage() {
  const [user, setUser] = useState<any>(null)
  const [files, setFiles] = useState<any[]>([])
  const [historia, setHistoria] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

  const fetchPaciente = async () => {
    try {
      const res = await fetch(`/api/paciente/${PACIENTE_ID}`)
      if (!res.ok) throw new Error("Error al cargar paciente")

      const data = await res.json()

      setUser(data)
      setFiles(data.archivos || [])
    } catch (err) {
      console.error(err)
    }
  }

  const fetchHistorias = async () => {
    try {
      const res = await fetch(`/api/historias?pacienteId=${PACIENTE_ID}`)
      const data = await res.json()
      setHistoria(data)
    } catch (err) {
      console.error(err)
    }
  }

  const loadData = async () => {
    await fetchPaciente()
    await fetchHistorias()
    setLoading(false)
  }

  loadData()

}, [])
  const estudios = files.filter(f => f.tipo === "ESTUDIO")
  const informes = files.filter(f => f.tipo === "INFORME")

  if (loading) {
    return <p className="p-6">Cargando...</p>
  }

  if (!user) {
    return <p className="p-6">Paciente no encontrado</p>
  }

  console.log("🧠 HISTORIAS:", historia)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Toaster position="top-right" richColors />

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-6">

          {/* HEADER */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <a href="/">
                <ArrowLeft className="h-4 w-4" />
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

          {/* TABS */}
          <Tabs defaultValue="archivos">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="archivos">
                <FileText className="mr-2 h-4 w-4" />
                Mis Archivos
              </TabsTrigger>
              <TabsTrigger value="historia">
                Historia Clínica
              </TabsTrigger>
            </TabsList>

            {/* ARCHIVOS */}
            <TabsContent value="archivos" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Archivos Médicos</CardTitle>
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

            {/* PLACEHOLDER */}
            <TabsContent value="historia" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historia Clínica</CardTitle>
                  <CardDescription>
                    Registro de consultas médicas
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {historia.length === 0 ? (
                    <p className="text-muted-foreground">
                      No hay registros todavía
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {historia.map((entry: any) => (
                        <Card
                          key={entry.id}
                          className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition"
                        >
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">
                                {entry.motivo}
                              </CardTitle>

                              <span className="text-xs text-muted-foreground">
                                {new Date(entry.fecha).toLocaleDateString("es-AR")}
                              </span>
                            </div>

                            <CardDescription>
                              {entry.medicoNombre || "Médico"}
                              
                            </CardDescription>
                          </CardHeader>

                          <CardContent className="space-y-3 text-sm">
                            <div>
                              <p className="font-medium">Diagnóstico</p>
                              <p className="text-muted-foreground">
                                {entry.diagnostico || "-"}
                              </p>
                            </div>

                            <div>
                              <p className="font-medium">Tratamiento</p>
                              <p className="text-muted-foreground">
                                {entry.tratamiento || "-"}
                              </p>
                            </div>

                            {entry.observaciones && (
                              <div>
                                <p className="font-medium">Observaciones</p>
                                <p className="text-muted-foreground">
                                  {entry.observaciones}
                                </p>
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