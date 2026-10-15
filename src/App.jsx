import { Navigate, Route, Routes } from 'react-router-dom'

import AppLayout from './components/layout/AppLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import PhaseMap from './pages/PhaseMap.jsx'
import Mission from './pages/Mission.jsx'
import Achievements from './pages/Achievements.jsx'
import Profile from './pages/Profile.jsx'
import NotFound from './pages/NotFound.jsx'

/**
 * Fluxo de navegação (SPA com React Router):
 *
 *   /                → Dashboard      (nível, XP, progresso, "continuar")
 *   /mapa            → PhaseMap       (trilha de fases desbloqueáveis)
 *   /missao/:id      → Mission        (protegido: redireciona se bloqueada)
 *   /conquistas      → Achievements
 *   /perfil          → Profile
 *   *                → NotFound
 *
 * Todas as rotas ficam dentro do AppLayout (sidebar + topbar).
 */
export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/mapa" element={<PhaseMap />} />
        <Route path="/missao/:missionId" element={<Mission />} />
        <Route path="/conquistas" element={<Achievements />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/inicio" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
