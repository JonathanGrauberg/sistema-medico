"use client"

import { useState } from "react"

export default function KioscoPage() {
  const [dni, setDni] = useState("")
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState("")

  const buscar = async () => {
    setError("")
    setData(null)

    const res = await fetch("/api/kiosco", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ dni })
    })

    const json = await res.json()

    if (!res.ok) {
      setError(json.error)
      return
    }

    setData(json)
  }

  const confirmar = async () => {
    await fetch("/api/kiosco/confirmar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        turnoId: data.turno.id
      })
    })

    setData(null)
    setDni("")
    alert("Ya estás en la lista de espera 👍")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-6">

      <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-xl shadow">

        <h1 className="text-2xl font-bold text-center">
          Check-in Paciente
        </h1>

        {!data ? (
          <>
            <input
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="Ingresá tu DNI"
              className="w-full border p-3 rounded text-lg"
            />

            <button
              onClick={buscar}
              className="w-full bg-black text-white p-3 rounded"
            >
              Buscar turno
            </button>

            {error && (
              <p className="text-red-500 text-center">
                {error}
              </p>
            )}
          </>
        ) : (
          <>
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">
                {data.paciente.nombre} {data.paciente.apellido}
              </p>

              <p className="text-sm text-muted-foreground">
                Turno con {data.turno.medico.nombre}
              </p>
            </div>

            <button
              onClick={confirmar}
              className="w-full bg-green-600 text-white p-3 rounded"
            >
              Confirmar llegada
            </button>
          </>
        )}

      </div>

    </div>
  )
}