import { NavLink } from 'react-router-dom'
import { House, Map, Trophy, User, Terminal } from 'lucide-react'

const LINKS = [
  { to: '/', label: 'Dashboard', icon: House, end: true },
  { to: '/mapa', label: 'Mapa de fases', icon: Map },
  { to: '/conquistas', label: 'Conquistas', icon: Trophy },
  { to: '/perfil', label: 'Perfil', icon: User },
]

/**
 * Sidebar — navegação principal (desktop).
 * No mobile ela sai de cena e o BottomNav assume (ver AppLayout).
 */
export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-line bg-surface/60 backdrop-blur">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-line">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand/15 text-brand-bright">
          <Terminal size={18} />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold text-text">C Adventure</p>
          <p className="text-[11px] text-faint">Aprenda C jogando</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {LINKS.map(({ to, label, icon: ItemIcon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-brand/12 text-brand-bright font-medium'
                  : 'text-muted hover:text-text hover:bg-surface-2'
              }`
            }
          >
            <ItemIcon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 text-[11px] text-faint border-t border-line">
        Material baseado nas aulas 2 a 7 de Programação Estruturada em C.
      </div>
    </aside>
  )
}
