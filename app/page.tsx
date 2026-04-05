"use client"

import Link from "next/link"
import {
  Activity,
  FileSearch,
  Settings,
  Shield,
  Clock,
  Users,
  Stethoscope,
  HeartPulse,
  Microscope
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"

const features = [
  {
    icon: Shield,
    title: "Acceso Seguro",
    description: "Protección de datos médicos con estándares profesionales"
  },
  {
    icon: Clock,
    title: "Disponible 24/7",
    description: "Accede a tu información médica en cualquier momento"
  },
  {
    icon: Users,
    title: "Multi Profesional",
    description: "Múltiples médicos y gestión centralizada de pacientes"
  }
]

const services = [
  {
    icon: Stethoscope,
    title: "Consultas Médicas",
    description: "Registro completo de consultas y evolución del paciente"
  },
  {
    icon: Microscope,
    title: "Estudios Clínicos",
    description: "Carga y visualización de estudios médicos digitales"
  },
  {
    icon: HeartPulse,
    title: "Seguimiento",
    description: "Historial clínico completo con trazabilidad médica"
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>

        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background pt-15 pb-20 min-h-[650px] md:min-h-[700px]">

        <div className="container mx-auto px-4 grid md:grid-cols-2 items-center gap-10 md:pl-10 lg:pl-20">

    {/* LEFT */}
    <div className="relative z-10">
      

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
        Gestión médica moderna para un sistema de salud eficiente
      </h1>

      <p className="mt-6 text-lg text-muted-foreground">
        Administra pacientes, estudios e historia clínica en una sola plataforma.
        Acceso rápido, seguro y profesional.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="rounded-full px-6" asChild>
          <Link href="/paciente">
            <FileSearch className="mr-2 h-5 w-5" />
            Ver mis estudios
          </Link>
        </Button>

        <Button size="lg" variant="outline" className="rounded-full px-6" asChild>
          <Link href="/profesional">
            Acceso profesional
          </Link>
        </Button>
      </div>

      {/* STATS */}
      <div className="mt-10 flex gap-8">
        <div>
          <p className="text-2xl font-bold">+500</p>
          <p className="text-xs text-muted-foreground">Pacientes</p>
        </div>
        <div>
          <p className="text-2xl font-bold">+1200</p>
          <p className="text-xs text-muted-foreground">Estudios</p>
        </div>
        <div>
          <p className="text-2xl font-bold">24/7</p>
          <p className="text-xs text-muted-foreground">Disponibilidad</p>
        </div>
      </div>
    </div>

    {/* RIGHT */}
    <div className="relative flex justify-center items-end">

      {/* CIRCULO DE FONDO */}
      <div className="absolute w-[350px] h-[350px] bg-primary/20 rounded-full blur-2xl" />

      {/* IMAGEN DOCTOR */}
      <img
        src="/medica-hero.png" // 👈 poné tu imagen en /public
        alt="Doctor"
        className="relative z-10 w-[480px] md:w-[500px] object-contain"
      />  
    </div>
    </div>

        {/* blur decor */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </section>

        

        {/* FEATURES */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold">Plataforma completa</h2>
            <p className="mt-4 text-muted-foreground">
              Todo lo necesario para digitalizar tu consultorio o clínica
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <Card key={f.title}>
                  <CardHeader>
                    <Icon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{f.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* SERVICES */}
        <section className="bg-muted/40 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold">Servicios del sistema</h2>
              <p className="mt-4 text-muted-foreground">
                Diseñado para flujo médico real
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {services.map((s) => {
                const Icon = s.icon
                return (
                  <Card key={s.title} className="shadow-sm hover:shadow-md transition">
                    <CardHeader>
                      <Icon className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>{s.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{s.description}</CardDescription>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold">
              Empieza a digitalizar tu consultorio
            </h2>
            <p className="mt-4 text-muted-foreground">
              Accede ahora y comienza a gestionar pacientes de forma profesional
            </p>

            <Button size="lg" className="mt-6" asChild>
              <Link href="/profesional">
                Comenzar ahora
              </Link>
            </Button>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>MediFiles - Sistema Médico SaaS</p>
        </div>
      </footer>
    </div>
  )
}