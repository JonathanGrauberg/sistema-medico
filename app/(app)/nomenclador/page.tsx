"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, BookOpen, Hash, Activity } from "lucide-react"

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
    }, 300)

    return () => clearTimeout(delay)
  }, [search])

  return (
    <div className="space-y-8 h-full flex flex-col">

      {/* 🔝 HEADER GLASS */}
      <header className="flex-none p-8 bg-white/40 backdrop-blur-md border border-white/40 rounded-[2.5rem] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#39B5B5]/20 rounded-2xl">
            <BookOpen className="w-8 h-8 text-[#39B5B5]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              Nomenclador Nacional
            </h1>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#1e5e5e] font-extrabold opacity-70">
              Vademécum de Prácticas Médicas
            </p>
          </div>
        </div>
      </header>

      {/* 🔍 BUSCADOR GLASS */}
      <div className="flex-none relative group max-w-2xl mx-auto w-full px-4">
        <div className="absolute inset-y-0 left-9 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-[#39B5B5] group-focus-within:scale-110 transition-transform" />
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Escribí un código o una descripción..."
          className="w-full rounded-[2rem] pl-14 pr-6 py-5 bg-white/30 backdrop-blur-md border border-white/40 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#39B5B5]/50 focus:bg-white/50 transition-all text-slate-700 font-medium placeholder:text-slate-400"
        />
        
        {/* INDICADOR DE RESULTADOS */}
        {search.length >= 2 && (
          <div className="absolute -bottom-8 left-10 flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : 'bg-[#39B5B5]'}`} />
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {loading ? "Buscando..." : `${data.length} coincidencias encontradas`}
             </span>
          </div>
        )}
      </div>

      {/* 📋 RESULTADOS (Scroll Independiente) */}
      <div className="flex-1 min-h-0 pt-4 px-2">
        <div className="h-full overflow-y-auto custom-scrollbar pr-4 space-y-4">
          
          {data.map((item, index) => (
            <div
              key={item.id}
              className="group relative bg-white/30 backdrop-blur-md border border-white/40 rounded-[1.8rem] p-6 shadow-sm hover:shadow-xl hover:bg-white/50 hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                
                {/* BLOQUE CÓDIGO */}
                <div className="flex-none flex items-center gap-3 bg-white/40 px-5 py-3 rounded-2xl border border-white/60">
                  <Hash className="w-4 h-4 text-[#39B5B5] opacity-50" />
                  <div>
                    <span className="block text-[9px] uppercase font-black text-[#1e5e5e] opacity-60 leading-none mb-1">CÓDIGO</span>
                    <p className="text-xl font-black text-slate-800 tracking-tight">
                      {item.codigo}
                    </p>
                  </div>
                </div>

                {/* BLOQUE PRÁCTICA */}
                <div className="flex-1">
                   <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-3 h-3 text-[#39B5B5]" />
                      <span className="text-[9px] uppercase font-black text-[#1e5e5e] opacity-60">DESCRIPCIÓN DE LA PRÁCTICA</span>
                   </div>
                   <p className="text-slate-700 font-semibold text-lg leading-tight group-hover:text-black transition-colors">
                     {item.practica}
                   </p>
                </div>

                {/* BOTÓN ACCIÓN (Sutil) */}
                <button className="flex-none opacity-0 group-hover:opacity-100 bg-[#39B5B5] text-white text-[10px] font-bold py-2 px-4 rounded-full transition-all duration-300 shadow-lg shadow-[#39B5B5]/20">
                  VER DETALLE
                </button>
              </div>
            </div>
          ))}

          {/* ESTADO VACÍO O INICIAL */}
          {search.length < 2 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
               <BookOpen className="w-16 h-16 text-slate-400" />
               <p className="max-w-[250px] text-sm font-medium text-slate-500 italic">
                 Ingresá al menos dos caracteres para iniciar la búsqueda en el nomenclador...
               </p>
            </div>
          )}

          {!loading && data.length === 0 && search.length > 1 && (
            <div className="bg-rose-500/5 border border-rose-500/10 rounded-[2rem] p-12 text-center">
              <p className="text-rose-500 font-bold">No se encontraron resultados para "{search}"</p>
              <p className="text-slate-500 text-xs mt-1">Intentá con otros términos o verificá el código.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(57, 181, 181, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(57, 181, 181, 0.4);
        }
      `}</style>
    </div>
  )
}