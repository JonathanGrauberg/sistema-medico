"use client"

import { useEffect, useState } from "react"

type Props = {
  open: boolean
  onClose: () => void
}

export function SalaModal({ open, onClose }: Props) {
  const [turnos, setTurnos] = useState<any[]>([])

  useEffect(() => {
    if (!open) return

    fetch("/api/turnos")
      .then(res => res.json())
      .then(data => {
        const hoy = new Date()

        const hoyStr = `${hoy.getFullYear()}-${String(
          hoy.getMonth() + 1
        ).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`

        const enSala = data
          .filter((t: any) => {
            const d = new Date(t.fecha)

            const fechaStr = `${d.getFullYear()}-${String(
              d.getMonth() + 1
            ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

            return t.estado === "EN_SALA" && fechaStr === hoyStr
          })
          .sort((a: any, b: any) => {
            return new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
          })

        setTurnos(enSala)
      })
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

      <div className="bg-white w-full max-w-md rounded-xl shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-lg">Sala de espera</h2>
          <button onClick={onClose}>✖</button>
        </div>

        {/* LISTA */}
        <div className="max-h-[400px] overflow-y-auto divide-y">

          {turnos.length === 0 && (
            <div className="p-6 text-center text-muted-foreground">
              No hay pacientes en sala
            </div>
          )}

          {turnos.map((t) => {
            const fecha = new Date(t.fecha)

            return (
              <div key={t.id} className="p-4 flex justify-between items-center">

                <div>
                  <p className="font-medium">
                    {t.paciente?.apellido}, {t.paciente?.nombre}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fecha.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>

                <div className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                  En sala
                </div>

              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}