// components/EstadoBadge.tsx

import { ESTADO_CONFIG, EstadoTurno } from "@/components/agenda/types"

export function EstadoBadge({ estado }: { estado: EstadoTurno }) {
  const cfg = ESTADO_CONFIG[estado]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${cfg.bg} ${cfg.border} ${cfg.color}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}
