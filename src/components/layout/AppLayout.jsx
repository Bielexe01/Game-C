import { Outlet } from 'react-router-dom'

import Sidebar from './Sidebar.jsx'
import TopBar from './TopBar.jsx'
import BottomNav from './BottomNav.jsx'

/**
 * AppLayout — casca comum de todas as rotas:
 * Sidebar (desktop) · TopBar · conteúdo (Outlet) · BottomNav (mobile).
 */
export default function AppLayout() {
  return (
    <div className="flex h-full">
      <Sidebar />

      <div className="flex flex-1 flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-8">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-6 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
