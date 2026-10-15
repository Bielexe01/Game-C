/**
 * Missões do curso.
 *
 * MODELO DE DADO (separado da UI — a interface só consome este formato):
 *
 *  id            identificador único
 *  phaseId       fase dona da missão (referência em phases.js)
 *  order         posição dentro da fase (desbloqueio em sequência)
 *  title         título da missão
 *  difficulty    'iniciante' | 'intermediario' | 'desafio'
 *  boss          true → chefão de fase (combina conceitos da fase)
 *  isDemo        true → missão demonstrativa usada só para validar a estrutura
 *  xp / coins    recompensas na conclusão
 *  objective     objetivo de aprendizagem (1 frase)
 *  instructions  passos concretos do que o aluno deve fazer
 *  concepts      conceitos estudados (exibidos na tela da missão)
 *  starterCode   código inicial no editor (nunca a solução completa)
 *  criteria      critérios de aprovação, verificados na execução real (Judge0)
 *                 · type 'output': compara stdout com expected (stdin opcional)
 *                 · trimEnd: ignora espaços finais antes de comparar
 *  hints         dicas progressivas (dica 1 = leve, dica 3 = quase a solução)
 *  explanation   feedback educativo exibido ao concluir
 */
export const MISSIONS = [
  // ───────────────────────── AULA 2 · CONDICIONAIS ─────────────────────────
  {
    id: 'a2-m1',
    phaseId: 'aula-2',
    order: 1,
    title: 'Aprovado, Recuperação ou Reprovado?',
    difficulty: 'iniciante',
    boss: false,
    isDemo: true,
    xp: 40,
    coins: 10,
    objective: 'Classificar a situação de um aluno usando if, else if e else.',
    instructions: [
      'Leia uma nota (float) já disponibilizada no código inicial.',
      'Se a nota for maior ou igual a 7, imprima Aprovado.',
      'Se estiver entre 5 (inclusive) e 7, imprima Recuperacao.',
      'Abaixo de 5, imprima Reprovado.',
      'Use exatamente essas palavras, sem acento e sem ponto final.',
      'O texto "Nota: " usado para pedir a entrada não conta como resposta.',
    ],
    concepts: ['if', 'else if', 'else', 'operador >=', 'ordem das condições'],
    starterCode: `#include <stdio.h>

int main() {
    float nota;

    printf("Nota: ");
    scanf("%f", &nota);

    // TODO: classifique a nota em Aprovado, Recuperacao ou Reprovado

    return 0;
}
`,
    criteria: [
      { id: 'a2-m1-t1', type: 'output', label: 'nota 8.0 imprime Aprovado', stdin: '8.0', expected: 'Aprovado' },
      { id: 'a2-m1-t2', type: 'output', label: 'nota 6.0 imprime Recuperacao', stdin: '6.0', expected: 'Recuperacao' },
      { id: 'a2-m1-t3', type: 'output', label: 'nota 3.5 imprime Reprovado', stdin: '3.5', expected: 'Reprovado' },
    ],
    hints: [
      'Pense na ordem: primeiro teste o caso "maior", senão os elif ficam inalcançáveis.',
      'Use if (nota >= 7) { ... } else if (nota >= 5) { ... } else { ... }.',
      'Cada caminho precisa de um printf("...\\n") com o texto exato pedido no enunciado.',
    ],
    explanation:
      'As condições são verificadas de cima para baixo: assim que uma delas é verdadeira, o bloco correspondente roda e as demais são ignoradas. Por isso testamos primeiro nota >= 7 e depois nota >= 5.',
  },

  {
    id: 'a2-m2',
    phaseId: 'aula-2',
    order: 2,
    title: 'Menu do banco',
    difficulty: 'intermediario',
    boss: false,
    isDemo: true,
    xp: 60,
    coins: 15,
    objective: 'Escolher o caminho certo com switch-case, break e default.',
    instructions: [
      'Um código inteiro já é lido para a variável opcao.',
      '1 → Consultar saldo · 2 → Depositar · 3 → Sacar · 4 → Sair',
      'Qualquer outro valor → Opcao invalida',
      'Use switch-case com break em cada case e um default.',
    ],
    concepts: ['switch', 'case', 'break', 'default'],
    starterCode: `#include <stdio.h>

int main() {
    int opcao;

    printf("Opcao: ");
    scanf("%d", &opcao);

    // TODO: troque os if/else if por um switch-case

    return 0;
}
`,
    criteria: [
      { id: 'a2-m2-t1', type: 'output', label: 'opção 3 imprime Sacar', stdin: '3', expected: 'Sacar' },
      { id: 'a2-m2-t2', type: 'output', label: 'opção 1 imprime Consultar saldo', stdin: '1', expected: 'Consultar saldo' },
      { id: 'a2-m2-t3', type: 'output', label: 'opção 9 imprime Opcao invalida', stdin: '9', expected: 'Opcao invalida' },
    ],
    hints: [
      'switch (opcao) { case 1: ... break; case 2: ... break; default: ... }',
      'Sem o break, a execução "cai" no próximo case e imprime mensagens a mais.',
      'O default cobre todos os valores que não foram contemplados — é ele que gera "Opcao invalida".',
    ],
    explanation:
      'O switch compara a MESMA variável com valores específicos. O break encerra o caminho escolhido; sem ele ocorre o "fall-through" (execução continua no case seguinte). O default é o caminho para valores fora da tabela.',
  },

  {
    id: 'a2-boss',
    phaseId: 'aula-2',
    order: 3,
    title: 'CHEFÃO: Portaria do evento',
    difficulty: 'desafio',
    boss: true,
    isDemo: true,
    xp: 120,
    coins: 50,
    objective: 'Combinar idade, ingresso e autorização em uma única regra lógica.',
    instructions: [
      'O programa lê três valores: idade, possuiIngresso (0 ou 1) e autorizado (0 ou 1).',
      'Regra: entrada permitida apenas se o aluno tiver 18 anos ou mais E (tiver ingresso OU estiver autorizado).',
      'Imprima Entrada permitida ou Acesso negado.',
      'A desafiar: resolva com UM único if usando &&, || e parênteses.',
    ],
    concepts: ['&&', '||', 'parênteses em condições', 'if-else'],
    starterCode: `#include <stdio.h>

int main() {
    int idade, possuiIngresso, autorizado;

    scanf("%d %d %d", &idade, &possuiIngresso, &autorizado);

    // TODO: aplique a regra com && e ||

    return 0;
}
`,
    criteria: [
      { id: 'a2-boss-t1', type: 'output', label: '20 anos com ingresso → permitida', stdin: '20 1 0', expected: 'Entrada permitida' },
      { id: 'a2-boss-t2', type: 'output', label: '20 anos sem nada → negado', stdin: '20 0 0', expected: 'Acesso negado' },
      { id: 'a2-boss-t3', type: 'output', label: '15 anos com ingresso e autorização → negado', stdin: '15 1 1', expected: 'Acesso negado' },
    ],
    hints: [
      'Separe a regra em partes: "idade suficiente" E ("possui ingresso" OU "está autorizado").',
      'idade >= 18 && (possuiIngresso == 1 || autorizado == 1)',
      'Sem os parênteses, o && tem precedência e a lógica muda — teste por quê.',
    ],
    explanation:
      '&& exige que TODAS as partes sejam verdadeiras; || exige apenas UMA. Os parênteses deixam a intenção explícita e definem a precedência: o grupo do || é avaliado primeiro e o resultado é combinado com a idade.',
  },

  // ───────────────────────── AULA 3 · REPETIÇÕES ───────────────────────────
  {
    id: 'a3-m1',
    phaseId: 'aula-3',
    order: 1,
    title: 'Contador de 1 a 10',
    difficulty: 'iniciante',
    boss: false,
    isDemo: true,
    xp: 40,
    coins: 10,
    objective: 'Escrever um laço for com inicialização, condição e atualização.',
    instructions: [
      'Use um laço for para imprimir os números de 1 até 10.',
      'Um número por linha (use "\\n").',
      'Não repita o printf 10 vezes: deixe a repetição trabalhar por você.',
    ],
    concepts: ['for', 'incremento ++', 'condição de parada'],
    starterCode: `#include <stdio.h>

int main() {
    // TODO: laço for imprimindo 1 a 10, um por linha

    return 0;
}
`,
    criteria: [
      { id: 'a3-m1-t1', type: 'output', label: 'imprime 1 a 10, um por linha', stdin: '', expected: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10' },
    ],
    hints: [
      'As três partes do for: quem começa, até quando e o que muda.',
      'for (int i = 1; i <= 10; i++) { ... }',
      'Dentro do laço: printf("%d\\n", i);',
    ],
    explanation:
      'O for reúne inicialização (int i = 1), condição (i <= 10) e atualização (i++). A última verificação acontece com i = 11 e retorna falso — é assim que o laço termina, sem executar uma iteração extra.',
  },

  {
    id: 'a3-m2',
    phaseId: 'aula-3',
    order: 2,
    title: 'Somatório com acumulador',
    difficulty: 'intermediario',
    boss: false,
    isDemo: true,
    xp: 60,
    coins: 15,
    objective: 'Separar o papel de contador e de acumulador dentro de um laço.',
    instructions: [
      'Leia um número inteiro N.',
      'Calcule a soma de 1 até N e imprima o resultado.',
      'Inicialize o acumulador com 0 ANTES do laço.',
    ],
    concepts: ['acumulador', 'contador', 'soma acumulada', 'while ou for'],
    starterCode: `#include <stdio.h>

int main() {
    int n;

    printf("N: ");
    scanf("%d", &n);

    // TODO: acumule a soma de 1 até n e imprima

    return 0;
}
`,
    criteria: [
      { id: 'a3-m2-t1', type: 'output', label: 'N = 5 → soma 15', stdin: '5', expected: '15' },
      { id: 'a3-m2-t2', type: 'output', label: 'N = 10 → soma 55', stdin: '10', expected: '55' },
      { id: 'a3-m2-t3', type: 'output', label: 'N = 1 → soma 1', stdin: '1', expected: '1' },
    ],
    hints: [
      'São duas variáveis com papéis diferentes: o contador anda, o acumulador preserva o total.',
      'int soma = 0; for (int i = 1; i <= n; i++) { soma = soma + i; }',
      'Depois do laço, imprima soma com printf("%d\\n", soma);',
    ],
    explanation:
      'O acumulador começa em 0 (senão a soma ficaria com lixo) e é atualizado a cada iteração. Esse padrão — percorrer, decidir o que fazer com o valor atual e acumular — reaparece em médias, maiores, menores e contagens.',
  },

  // ───────────────────── AULA 4 · LAÇOS ANINHADOS ──────────────────────────
  {
    id: 'a4-m1',
    phaseId: 'aula-4',
    order: 1,
    title: 'Triângulo de asteriscos',
    difficulty: 'intermediario',
    boss: false,
    isDemo: true,
    xp: 70,
    coins: 20,
    objective: 'Controlar um laço interno pelo valor do laço externo.',
    instructions: [
      'Imprima 4 linhas: a linha 1 tem 1 asterisco, a linha 2 tem 2, e assim até 4.',
      'Use um laço externo para as linhas e um interno para as colunas.',
      'O número de colunas deve depender da linha atual.',
    ],
    concepts: ['laços aninhados', 'laço interno limitado pelo externo', 'printf sem quebra + \\n no fim da linha'],
    starterCode: `#include <stdio.h>

int main() {
    // TODO: laço externo (linhas) + laço interno (colunas)

    return 0;
}
`,
    criteria: [
      { id: 'a4-m1-t1', type: 'output', label: 'gera o triângulo de 4 linhas', stdin: '', expected: '*\n**\n***\n****', trimEnd: true },
    ],
    hints: [
      'O interno deve executar 1 vez na primeira linha, 2 na segunda...',
      'for (int linha = 1; linha <= 4; linha++) { for (int coluna = 1; coluna <= linha; coluna++) printf("*"); printf("\\n"); }',
      'O printf("*") fica DENTRO do laço interno; o printf("\\n") só depois dele, ainda no externo.',
    ],
    explanation:
      'Em laços aninhados, o interno completo roda para cada passo do externo. Aqui o limite do interno (coluna <= linha) é variável: é o que faz cada linha crescer em relação à anterior.',
  },

  {
    id: 'a4-boss',
    phaseId: 'aula-4',
    order: 2,
    title: 'CHEFÃO: Melhor tentativa',
    difficulty: 'desafio',
    boss: true,
    isDemo: true,
    xp: 130,
    coins: 55,
    objective: 'Juntar laços aninhados, acumulador de "melhor resultado" e contador de meta.',
    instructions: [
      'Há 4 participantes; cada um realiza 3 tentativas.',
      'Para cada participante, leia os 3 resultados (float) e determine o melhor deles.',
      'Imprima o melhor resultado de cada participante.',
      'Um participante atinge a meta quando seu melhor resultado é >= 8.0.',
      'Ao final, imprima quantos participantes atingiram a meta no formato: Atingiram a meta: N',
    ],
    concepts: ['laços aninhados', 'melhor resultado', 'contador de meta', 'reset de acumulador por participante'],
    starterCode: `#include <stdio.h>

int main() {
    float resultado, melhor;
    int meta = 0;

    // TODO: para cada participante (4x) leia 3 tentativas,
    //       encontre o melhor e atualize o contador de meta

    printf("Atingiram a meta: %d\\n", meta);
    return 0;
}
`,
    criteria: [
      {
        id: 'a4-boss-t1',
        type: 'output',
        label: 'turma 1: dois participantes na meta',
        stdin: '9.0 7.5 8.2\n6.0 5.0 4.0\n8.0 8.1 7.9\n3.0 2.0 1.0',
        expected: 'Melhor do participante 1: 9.0\nMelhor do participante 2: 6.0\nMelhor do participante 3: 8.1\nMelhor do participante 4: 4.0\nAtingiram a meta: 2',
        trimEnd: true,
      },
    ],
    hints: [
      'O "melhor" precisa ser ZERADO a cada participante — coloque a inicialização dentro do laço externo.',
      'Use um valor inicial baixo (por exemplo, -1) e compare com if (resultado > melhor) melhor = resultado;',
      'O contador de meta fica FORA dos laços e é incrementado uma vez por participante, depois do laço interno.',
    ],
    explanation:
      'Esse é o padrão "reiniciar o estado do participante" da Aula 4: o acumulador do melhor resultado vive dentro do laço externo (um por participante), enquanto o contador da meta acumula ao longo de todo o programa.',
  },

  // ───────────── FASES 4-6 (Aulas 5, 6 e 7) · ESTRUTURA PRONTA ─────────────
  // As missões serão cadastradas na próxima etapa do projeto.
]

export const getMissionById = (id) => MISSIONS.find((m) => m.id === id)

export const getMissionsByPhase = (phaseId) =>
  MISSIONS.filter((m) => m.phaseId === phaseId).sort((a, b) => a.order - b.order)

/** Missão atual recomendada: a primeira não concluída na ordem do curso. */
export function getNextMission(completedIds) {
  return MISSIONS.find((m) => !completedIds.includes(m.id)) ?? null
}
