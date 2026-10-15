import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

import Button from '../components/ui/Button.jsx'

export default function NotFound() {
  return (
    <div className="anim-rise flex flex-col items-center justify-center py-24 text-center gap-4">
      <Compass size={40} className="text-brand" />
      <h1 className="text-2xl font-bold">Rota não encontrada</h1>
      <p className="text-sm text-muted max-w-sm">
        Essa página não existe no jogo. Volte ao dashboard e siga a trilha das
        fases.
      </p>
      <Link to="/">
        <Button>Voltar ao início</Button>
      </Link>
    </div>
  )
}
