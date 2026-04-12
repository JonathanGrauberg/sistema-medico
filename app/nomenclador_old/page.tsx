"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

type NomencladorItem = {
  id: string
  codigo: string
  practica: string
}

export default function NomencladorPage() {
  const [search, setSearch] = useState("")
  const [data, setData] = useState<NomencladorItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.length < 2) {
        setData([])
        return
      }

      setLoading(true)

      fetch(`/api/nomenclador?search=${search}`)
        .then(res => res.json())
        .then(setData)
        .finally(() => setLoading(false))
    }, 300) // debounce

    return () => clearTimeout(delay)
  }, [search])

  return (
    <div className="min-h-screen bg-background">

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">
            Nomenclador Nacional
          </h1>
          <p className="text-muted-foreground text-sm">
            Buscá prácticas por código o descripción
          </p>
        </div>

        {/* 🔍 BUSCADOR PILL */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder="Buscar código o práctica..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-6 rounded-full shadow-sm"
          />
        </div>

        {/* INFO */}
        {search.length >= 2 && (
          <div className="text-sm text-muted-foreground">
            {loading
              ? "Buscando..."
              : `${data.length} resultado${data.length !== 1 ? "s" : ""}`}
          </div>
        )}

        {/* RESULTADOS */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">

          {data.map(item => (
            <div
              key={item.id}
              className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start gap-4">

                {/* CODIGO */}
                <div className="min-w-[100px]">
                  <span className="text-xs text-muted-foreground">
                    Código
                  </span>
                  <p className="font-semibold text-[#39B5B5]">
                    {item.codigo}
                  </p>
                </div>

                {/* PRACTICA */}
                <div className="flex-1">
                  <span className="text-xs text-muted-foreground">
                    Práctica
                  </span>
                  <p className="text-sm leading-snug">
                    {item.practica}
                  </p>
                </div>

              </div>
            </div>
          ))}

          {/* EMPTY */}
          {!loading && data.length === 0 && search.length > 1 && (
            <div className="text-center py-10 text-muted-foreground">
              No se encontraron resultados
            </div>
          )}
        </div>

      </main>
    </div>
  )
}