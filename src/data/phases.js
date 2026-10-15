/**
 * Fases do curso — espelham EXATAMENTE a ordem das aulas fornecidas.
 * Nenhum conceito futuro entra aqui antes da hora (regra pedagógica).
 *
 * Aula 2  → Condicionais, expressões lógicas e switch-case
 * Aula 3  → Repetições: while, for e do-while
 * Aula 4  → Consolidação, laços aninhados, break e continue
 * Aula 5  → Funções, parâmetros e retorno
 * Aula 6  → Vetores, funções com vetores e strings
 * Aula 7  → Matrizes e arranjos paralelos
 *
 * Regra de desbloqueio: a fase N abre quando o aluno conclui
 * `missionsToUnlock` missões da fase anterior. A fase 1 é sempre livre.
 */
export const PHASES = [
  {
    id: 'aula-2',
    order: 1,
    title: 'Condicionais & Lógica',
    subtitle: 'Aula 2 · if, else, operadores lógicos e switch-case',
    source: 'Aula_2_Programacao_Estruturada_C.pdf',
    pdf: '/aulas/aula-2.pdf',
    icon: 'git-branch',
    color: '#22c55e',
    status: 'ativo',
    missionsToUnlock: 0,
    summary:
      'Seu programa ganha decisões: comparar valores, combinar regras com && || ! e escolher caminhos com if, else if e switch-case.',
    concepts: [
      'Operadores relacionais (== != > < >= <=)',
      'Verdadeiro e falso em C (0 e diferente de 0)',
      'if / if-else',
      'Condições compostas: && || !',
      'else if e a ordem das condições',
      'switch-case, break e default',
    ],
  },
  {
    id: 'aula-3',
    order: 2,
    title: 'Repetições',
    subtitle: 'Aula 3 · while, for e do-while',
    source: 'Aula_3_Programacao_Estruturada_C.pdf',
    pdf: '/aulas/aula-3.pdf',
    icon: 'repeat',
    color: '#10b981',
    status: 'ativo',
    missionsToUnlock: 2,
    summary:
      'Repetir sem copiar e colar: inicializar, testar, executar e atualizar. Contadores, acumuladores e a escolha entre while, for e do-while.',
    concepts: [
      'Anatomia da repetição (iniciar, testar, executar, atualizar)',
      'while',
      'Incremento: ++ e -- (pré e pós)',
      'Atribuições compostas: += -= *= /= %=',
      'for e suas três partes',
      'do-while',
      'Laço infinito e laço vazio',
    ],
  },
  {
    id: 'aula-4',
    order: 3,
    title: 'Laços Aninhados & Fluxo',
    subtitle: 'Aula 4 · consolidação, break e continue',
    source: 'Aula_4_Programacao_Estruturada_C.pdf',
    pdf: '/aulas/aula-4.pdf',
    icon: 'layers',
    color: '#3b82f6',
    status: 'ativo',
    missionsToUnlock: 2,
    summary:
      'Um laço dentro do outro, validação de entrada com scanf e o controle fino do fluxo com break e continue.',
    concepts: [
      'Escolha entre for, while e do-while',
      'Validação de entrada com o retorno do scanf',
      'Limpeza do buffer de entrada',
      'Laços aninhados',
      'break e continue',
      'Cuidados com break/continue em laços aninhados',
    ],
  },
  {
    id: 'aula-5',
    order: 4,
    title: 'Funções',
    subtitle: 'Aula 5 · parâmetros, retorno e escopo',
    source: 'Aula_5_Programacao_Estruturada_C.pdf',
    pdf: '/aulas/aula-5.pdf',
    icon: 'boxes',
    color: '#a855f7',
    status: 'em-breve',
    missionsToUnlock: 2,
    summary:
      'Dividir o problema em responsabilidades: nomear tarefas, trocar informações por parâmetros e retorno, e usar o main() como coordenador.',
    concepts: [
      'Definir e chamar funções',
      'Parâmetros e argumentos',
      'Passagem por valor',
      'return e a diferença entre imprimir e retornar',
      'Protótipos',
      'Escopo local e variáveis globais',
    ],
  },
  {
    id: 'aula-6',
    order: 5,
    title: 'Vetores & Strings',
    subtitle: 'Aula 6 · vetores, funções com vetores e strings',
    source: 'Aula_6_Programacao_Estruturada_C.pdf',
    pdf: '/aulas/aula-6.pdf',
    icon: 'list-ordered',
    color: '#ec4899',
    status: 'em-breve',
    missionsToUnlock: 2,
    summary:
      'Uma estrutura com várias posições, laços que percorrem a coleção e strings como aplicação de vetores de char.',
    concepts: [
      'Declaração e índice do vetor',
      'Percorrer vetores com for',
      'Erros clássicos de índice',
      '#define para tamanhos',
      'Vetores em funções (e por que passar o tamanho)',
      "Strings, '\0', fgets, strcmp e strcspn",
    ],
  },
  {
    id: 'aula-7',
    order: 6,
    title: 'Matrizes & Arranjos',
    subtitle: 'Aula 7 · matrizes e vetores paralelos',
    source: 'Aula_7_Programacao_Estruturada_C.pdf',
    pdf: '/aulas/aula-7.pdf',
    icon: 'table-2',
    color: '#06b6d4',
    status: 'em-breve',
    missionsToUnlock: 2,
    summary:
      'Duas dimensões com [linha][coluna], matrizes em funções, coleções de strings e dados relacionados pelo mesmo índice.',
    concepts: [
      'Matrizes e índices [linha][coluna]',
      'Percorrer matrizes com laços aninhados',
      'Matrizes como parâmetro de função',
      'Coleção de strings',
      'Vetores paralelos',
      'Média, frequência e situação final',
    ],
  },
]

export const getPhaseById = (id) => PHASES.find((p) => p.id === id)

export const getPhaseOrder = (id) => getPhaseById(id)?.order ?? 0
