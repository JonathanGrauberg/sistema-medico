"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// 🔥 TIPADO
type NomencladorItem = {
  codigo: string
  detalle: string
}

export default function NomencladorPage() {
  const [data, setData] = useState<NomencladorItem[]>([])
  const [search, setSearch] = useState("")

  // 🔥 MOCK (después lo conectamos a API)
  useEffect(() => {
    setData([
      {
        codigo: "019001",
        detalle: "Biopsia de nervio o músculo"
      },
      {
        codigo: "019002",
        detalle: "Punciones de reservorios"
      },
      {
        codigo: "019003",
        detalle: "Bloqueos por dolor"
      },
      {
        codigo: "019101",
        detalle: "Drenajes lumbares externos"
      }
    ])
  }, [])

  // 🔍 FILTRO
  const filtered = data.filter(item => {
    const q = search.toLowerCase()
    return (
      item.codigo.toLowerCase().includes(q) ||
      item.detalle.toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-background p-6">

      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">
            Nomenclador
          </h1>
          <p className="text-muted-foreground text-sm">
            Listado de prácticas médicas
          </p>
        </div>

        {/* BUSCADOR */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código o práctica..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* TABLA */}
        <Card>
          <CardHeader>
            <CardTitle>
              Resultados ({filtered.length})
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="border rounded-lg overflow-hidden">

              {/* HEADER TABLA */}
              <div className="grid grid-cols-3 bg-muted/50 p-3 text-sm font-medium">
                <div>Código</div>
                <div className="col-span-2">Detalle</div>
              </div>

              {/* BODY */}
              <div className="max-h-[500px] overflow-y-auto divide-y">

                {filtered.map((item, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-3 p-3 text-sm hover:bg-muted/40 transition"
                  >
                    <div className="font-medium">
                      {item.codigo}
                    </div>

                    <div className="col-span-2 text-muted-foreground">
                      {item.detalle}
                    </div>
                  </div>
                ))}

                {filtered.length === 0 && (
                  <div className="p-6 text-center text-muted-foreground">
                    No se encontraron resultados
                  </div>
                )}

              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}