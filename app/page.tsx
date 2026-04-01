import Link from "next/link"
import { Activity, FileSearch, Settings, Shield, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"

const features = [
  {
    icon: Shield,
    title: "Acceso Seguro",
    description: "Consulta tus estudios de forma segura con tu DNI o usuario personal"
  },
  {
    icon: Clock,
    title: "Disponible 24/7",
    description: "Accede a tus resultados en cualquier momento desde cualquier dispositivo"
  },
  {
    icon: Users,
    title: "Gestion Profesional",
    description: "Panel completo para profesionales con herramientas de administracion"
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 py-20 md:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm font-medium">
                <Activity className="h-4 w-4 text-primary" />
                <span>Sistema de Gestion Medica</span>
              </div>
              
              <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Tus estudios medicos en un solo lugar
              </h1>
              
              <p className="mt-6 text-pretty text-lg text-muted-foreground md:text-xl">
                Accede a tus estudios e informes medicos de forma rapida y segura. 
                Consulta tus resultados cuando lo necesites.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <Link href="/paciente">
                    <FileSearch className="mr-2 h-5 w-5" />
                    Ver mis estudios
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                  <Link href="/profesional">
                    <Settings className="mr-2 h-5 w-5" />
                    Acceso profesional
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Decorative background elements */}
          <div className="pointer-events-none absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Todo lo que necesitas
            </h2>
            <p className="mt-4 text-muted-foreground">
              Acceso simple y rapido a toda tu informacion medica
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="border-0 bg-muted/50">
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-muted/30">
          <div className="container mx-auto px-4 py-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight">
                Comienza ahora
              </h2>
              <p className="mt-4 text-muted-foreground">
                Ingresa tu DNI o usuario para consultar tus estudios disponibles
              </p>
              <Button size="lg" className="mt-6" asChild>
                <Link href="/paciente">
                  Consultar estudios
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>MediFiles - Sistema de Gestion de Estudios Medicos</p>
        </div>
      </footer>
    </div>
  )
}
