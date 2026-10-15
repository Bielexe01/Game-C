import { NavLink } from 'react-router-dom'
import { House, Map, Trophy, User } from 'lucide-react'

const LINKS = [
  { to: '/', label: 'Início', icon: House, end: true },
  { to: '/mapa', label: 'Mapa', icon: Map },
  { to: '/conquistas', label: 'Prêmios', icon: Trophy },
  { to: '/perfil', label: 'Perfil', icon: User },
]

/** Navegação inferior fixa — versão mobile da Sidebar. */
export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-line bg-ink/95 backdrop-blur">
      <div className="grid grid-cols-4">
        {LINKS.map(({ to, label, icon: ItemIcon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors ${
                isActive ? 'text-brand-bright' : 'text-faint'
              }`
            }
          >
            <ItemIcon size={19} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
