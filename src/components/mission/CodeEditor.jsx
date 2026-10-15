import { Code2 } from 'lucide-react'

/**
 * CodeEditor — área de edição do código C.
 *
 * Nesta primeira etapa é um textarea monoespaçada com:
 *  · indentação por Tab
 *  · numeração de linhas
 *  · aparência de terminal
 *
 * O componente é um ponto de troca: basta reimplementar este arquivo
 * com CodeMirror/Monaco (mesmas props) para elevar a edição sem
 * tocar na tela da missão.
 */
export default function CodeEditor({ value, onChange, language = 'c' }) {
  const lineCount = value.split('\n').length

  function handleKeyDown(event) {
    if (event.key !== 'Tab') return
    event.preventDefault()
    const el = event.target
    const { selectionStart } = el
    const next = `${value.slice(0, selectionStart)}    ${value.slice(selectionStart)}`
    onChange(next)
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = selectionStart + 4
    })
  }

  return (
    <div className="rounded-2xl border border-line bg-void overflow-hidden">
      <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-2.5">
        <Code2 size={15} className="text-brand" />
        <span className="text-xs font-medium text-muted">main.c</span>
        <span className="ml-auto text-[11px] uppercase tracking-wider text-faint">
          {language}
        </span>
      </div>

      <div className="flex">
        <div
          aria-hidden
          className="select-none border-r border-line-soft bg-surface/40 px-3 py-4 text-right font-mono text-[13px] leading-6 text-faint"
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="code-editor w-full resize-y bg-transparent px-4 py-4 font-mono text-[13px] leading-6 text-text min-h-[320px]"
        />
      </div>
    </div>
  )
}
