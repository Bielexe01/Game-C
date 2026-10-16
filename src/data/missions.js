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

  // ───────────────────────── AULA 5 · FUNÇÕES ──────────────────────────────
  {
    id: 'a5-m1',
    phaseId: 'aula-5',
    order: 1,
    title: 'Dobro com função',
    difficulty: 'iniciante',
    boss: false,
    isDemo: false,
    xp: 40,
    coins: 10,
    objective: 'Criar uma função com parâmetro e retorno e usar o valor devolvido no main.',
    instructions: [
      'Leia um número inteiro (o código inicial já lê em n).',
      'Crie a função int dobro(int valor) que retorna valor * 2.',
      'No main, chame dobro(n) e imprima o retorno com printf("%d\\n", ...).',
      'Não faça o cálculo no main: ele deve acontecer dentro da função.',
      'Coloque o protótipo da função antes do main().',
    ],
    concepts: ['parâmetros', 'return', 'protótipo', 'chamada de função'],
    starterCode: `#include <stdio.h>

/* TODO: escreva o protótipo da função dobro aqui */

int main() {
    int n;

    printf("Numero: ");
    scanf("%d", &n);

    // TODO: chame dobro(n) e imprima o retorno

    return 0;
}
`,
    criteria: [
      { id: 'a5-m1-t1', type: 'output', label: 'n = 5 imprime 10', stdin: '5', expected: '10' },
      { id: 'a5-m1-t2', type: 'output', label: 'n = -3 imprime -6', stdin: '-3', expected: '-6' },
      { id: 'a5-m1-t3', type: 'output', label: 'n = 0 imprime 0', stdin: '0', expected: '0' },
      {
        id: 'a5-m1-c1',
        type: 'code',
        label: 'existe uma função int dobro(int) com return e ela é chamada no main',
      },
    ],
    hints: [
      'A função precisa de três partes: tipo do valor retornado, nome e parâmetros.',
      'Escreva int dobro(int valor) { return valor * 2; } — e o protótipo int dobro(int valor); antes do main().',
      'No main: int resultado = dobro(n); printf("%d\\n", resultado);',
    ],
    explanation:
      'A função devolve um valor com return; quem chamou recebe esse valor e pode guardá-lo numa variável ou usá-lo direto na expressão. Imprimir dentro da função seria uma ação (void), não um retorno — por isso o main continua no controle da saída.',
  },

  {
    id: 'a5-m2',
    phaseId: 'aula-5',
    order: 2,
    title: 'Desconto progressivo',
    difficulty: 'intermediario',
    boss: false,
    isDemo: false,
    xp: 60,
    coins: 15,
    objective: 'Devolver de uma função o resultado de uma regra com mais de um caso.',
    instructions: [
      'A função calcularDesconto(float valor) retorna o VALOR DO DESCONTO em reais:',
      'compras abaixo de 100 → 0;',
      'de 100 até 499,99 → 10% (valor * 0.10);',
      '500 ou mais → 15% (valor * 0.15).',
      'No main, chame a função e imprima exatamente no formato: Desconto: %.2f',
      'Use if / else if com os limites exatos 100 e 500.',
    ],
    concepts: ['função com retorno float', 'if / else if', 'regra de negócio'],
    starterCode: `#include <stdio.h>

/* TODO: protótipo de calcularDesconto */

int main() {
    float valor;

    printf("Valor da compra: ");
    scanf("%f", &valor);

    // TODO: chame a função e imprima "Desconto: %.2f"

    return 0;
}
`,
    criteria: [
      { id: 'a5-m2-t1', type: 'output', label: 'compra de 80 → desconto 0.00', stdin: '80', expected: 'Desconto: 0.00' },
      { id: 'a5-m2-t2', type: 'output', label: 'compra de 250 → desconto 25.00', stdin: '250', expected: 'Desconto: 25.00' },
      { id: 'a5-m2-t3', type: 'output', label: 'compra de 1000 → desconto 150.00', stdin: '1000', expected: 'Desconto: 150.00' },
      {
        id: 'a5-m2-c1',
        type: 'code',
        label: 'a função calcularDesconto(float) retorna float e usa if/else if com os limites 100 e 500',
      },
    ],
    hints: [
      'São três faixas, então são dois testes encadeados (if / else if) — não dois ifs independentes.',
      'O retorno é o valor em reais: float desconto = valor * 0.10; return desconto;',
      'No main: printf("Desconto: %.2f\\n", calcularDesconto(valor));',
    ],
    explanation:
      'A função resolve a regra inteira e devolve só o número; o main só formata. Note o cuidado com os limites: 100 e 500 entram na faixa "maior" (>=), porque a regra diz "100 até 499,99" e "500 ou mais".',
  },

  {
    id: 'a5-m3',
    phaseId: 'aula-5',
    order: 3,
    title: 'Somatório encapsulado',
    difficulty: 'intermediario',
    boss: false,
    isDemo: false,
    xp: 60,
    coins: 15,
    objective: 'Levar para uma função um laço com acumulador e devolver o total.',
    instructions: [
      'Crie a função int somarAte(int limite) que soma 1 + 2 + ... + limite.',
      'Use um laço (for ou while) e um acumulador iniciado em 0 DENTRO da função.',
      'No main, leia o limite e imprima o retorno com printf("%d\\n", ...).',
      'O acumulador não deve existir no main — ele pertence à função.',
    ],
    concepts: ['escopo local', 'acumulador', 'laço dentro de função', 'return'],
    starterCode: `#include <stdio.h>

/* TODO: protótipo de somarAte */

int main() {
    int limite;

    printf("Limite: ");
    scanf("%d", &limite);

    // TODO: chame somarAte(limite) e imprima o retorno

    return 0;
}
`,
    criteria: [
      { id: 'a5-m3-t1', type: 'output', label: 'limite 5 → 15', stdin: '5', expected: '15' },
      { id: 'a5-m3-t2', type: 'output', label: 'limite 10 → 55', stdin: '10', expected: '55' },
      { id: 'a5-m3-t3', type: 'output', label: 'limite 1 → 1', stdin: '1', expected: '1' },
      {
        id: 'a5-m3-c1',
        type: 'code',
        label: 'existe a função int somarAte(int limite) com laço, acumulador local e return',
      },
    ],
    hints: [
      'A variável soma começa em 0 sempre que a função é chamada — ela é local.',
      'for (int i = 1; i <= limite; i++) { soma = soma + i; }',
      'Termine com return soma; e imprima o valor recebido no main.',
    ],
    explanation:
      'Cada chamada cria suas próprias variáveis locais: chamar somarAte(5) e depois somarAte(10) não mistura os totais, porque o acumulador nasce de novo a cada chamada.',
  },

  {
    id: 'a5-boss',
    phaseId: 'aula-5',
    order: 4,
    title: 'CHEFÃO: Conta bancária',
    difficulty: 'desafio',
    boss: true,
    isDemo: false,
    xp: 140,
    coins: 60,
    objective: 'Juntar do-while, menu com switch e funções que devolvem o saldo atualizado.',
    instructions: [
      'A conta começa com saldo de 1000.00 e o laço do menu termina na opção 0.',
      'NÃO imprima o menu — apenas as mensagens de resultado (uma por linha).',
      'Opção 1 (depositar): valor > 0 → "Deposito realizado."; senão → "Valor invalido."',
      'Opção 2 (sacar): valor > 0 e <= saldo → "Saque realizado."; valor maior que o saldo → "Saque negado: saldo insuficiente."; senão → "Valor invalido."',
      'Opção 3 (consultar): printf("Saldo atual: %.2f\\n", saldo)',
      'Opção 0 encerra sem imprimir nada; qualquer outra → "Opcao invalida"',
      'Crie uma função para cada ação (depositar, sacar, consultar) — o saldo deve ser passado e DEVOLVIDO pelas funções.',
    ],
    concepts: ['do-while', 'switch-case', 'funções com retorno', 'passagem por valor', 'acumulador de saldo'],
    starterCode: `#include <stdio.h>

/* TODO: protótipos de depositar, sacar e consultar */

int main() {
    float saldo = 1000.00;
    int opcao;
    float valor;

    // TODO: laço do menu (do-while) com switch-case

    return 0;
}
`,
    criteria: [
      {
        id: 'a5-boss-t1',
        type: 'output',
        label: 'deposita 200, consulta, saca 150 e consulta de novo',
        stdin: '1\n200\n3\n2\n150\n3\n0\n',
        expected:
          'Deposito realizado.\nSaldo atual: 1200.00\nSaque realizado.\nSaldo atual: 1050.00',
      },
      {
        id: 'a5-boss-t2',
        type: 'output',
        label: 'saque acima do saldo, depósito 0 e consulta final',
        stdin: '2\n5000\n1\n0\n3\n0\n',
        expected: 'Saque negado: saldo insuficiente.\nValor invalido.\nSaldo atual: 1000.00',
      },
      {
        id: 'a5-boss-t3',
        type: 'output',
        label: 'opção inválida e saída',
        stdin: '9\n0\n',
        expected: 'Opcao invalida',
      },
      {
        id: 'a5-boss-c1',
        type: 'code',
        label: 'usa repetição (do-while ou while) para o menu e funções separadas para depositar, sacar e consultar',
      },
    ],
    hints: [
      'O saldo vive FORA do laço — se ficar dentro, ele volta a 1000 a cada volta.',
      'Atenção à passagem por valor: alterar o parâmetro dentro da função NÃO muda o saldo do main.',
      'Faça o saldo voltar: saldo = depositar(saldo, valor); e saldo = sacar(saldo, valor); — cada função retorna o saldo já atualizado.',
    ],
    explanation:
      'Esse é o coração da Aula 5: como a função recebe uma CÓPIA do valor, ela não consegue mexer no saldo do main. A solução nesta disciplina é devolver o novo saldo pelo return e reatribuí-lo no chamador (saldo = sacar(...)).',
  },

  // ────────────────────── AULA 6 · VETORES & STRINGS ───────────────────────
  {
    id: 'a6-m1',
    phaseId: 'aula-6',
    order: 1,
    title: 'Soma de um vetor',
    difficulty: 'iniciante',
    boss: false,
    isDemo: false,
    xp: 50,
    coins: 10,
    objective: 'Preencher e percorrer um vetor com laço, acumulando o total.',
    instructions: [
      'Declare um vetor de 5 inteiros usando #define TAM 5.',
      'Leia os 5 valores com um laço for usando scanf("%d", &v[i]).',
      'Acumule a soma em uma variável iniciada em 0.',
      'Imprima no formato: Soma: %d',
      'O laço deve ir de 0 até TAM - 1.',
    ],
    concepts: ['#define', 'declaração de vetor', 'índice', 'for percorrendo vetor', 'acumulador'],
    starterCode: `#include <stdio.h>
#define TAM 5

int main() {
    int v[TAM];
    int soma = 0;

    // TODO: leia os 5 valores com laço, acumule em soma e imprima "Soma: %d"

    return 0;
}
`,
    criteria: [
      { id: 'a6-m1-t1', type: 'output', label: '4 7 2 8 3 → Soma: 24', stdin: '4 7 2 8 3', expected: 'Soma: 24' },
      { id: 'a6-m1-t2', type: 'output', label: '1 1 1 1 1 → Soma: 5', stdin: '1 1 1 1 1', expected: 'Soma: 5' },
      {
        id: 'a6-m1-c1',
        type: 'code',
        label: 'usa laço for com i de 0 até TAM-1 acessando v[i]',
      },
    ],
    hints: [
      'O índice começa em 0 e vai até TAM - 1 (nunca até TAM).',
      'for (int i = 0; i < TAM; i++) { scanf("%d", &v[i]); soma += v[i]; }',
      'printf("Soma: %d\\n", soma); depois do laço.',
    ],
    explanation:
      'O mesmo código processa qualquer posição: o índice é que decide qual elemento entra na conta. Repare que soma += v[i] faz as duas coisas — lê a posição e acumula.',
  },

  {
    id: 'a6-m2',
    phaseId: 'aula-6',
    order: 2,
    title: 'Média e valores abaixo dela',
    difficulty: 'intermediario',
    boss: false,
    isDemo: false,
    xp: 70,
    coins: 20,
    objective: 'Calcular uma média de um vetor e depois percorrê-lo de novo para contar.',
    instructions: [
      'Leia 6 valores float em um vetor com #define TAM 6.',
      'Calcule a média (soma / 6) e imprima no formato: Media: %.1f',
      'Depois, conte quantos valores são MENORES que a média e imprima: Abaixo da media: %d',
      'A média precisa existir antes da contagem — são dois laços.',
    ],
    concepts: ['vetor de float', 'média', 'dois laços sequenciais', 'contador'],
    starterCode: `#include <stdio.h>
#define TAM 6

int main() {
    float v[TAM];
    float soma = 0;

    // TODO: leia, calcule a média, imprima e conte os abaixo dela

    return 0;
}
`,
    criteria: [
      {
        id: 'a6-m2-t1',
        type: 'output',
        label: '1 2 3 4 5 9 → média 4.0 e 3 abaixo',
        stdin: '1 2 3 4 5 9',
        expected: 'Media: 4.0\nAbaixo da media: 3',
      },
      {
        id: 'a6-m2-t2',
        type: 'output',
        label: 'seis valores iguais → média 10.0 e nenhum abaixo',
        stdin: '10 10 10 10 10 10',
        expected: 'Media: 10.0\nAbaixo da media: 0',
      },
      {
        id: 'a6-m2-c1',
        type: 'code',
        label: 'usa dois laços sobre o vetor: um para somar e outro, depois da média, para contar',
      },
    ],
    hints: [
      'Acumule primeiro, divida depois: float media = soma / TAM;',
      'O segundo laço só roda DEPOIS da média existir: if (v[i] < media) contador++;',
      'printf("Media: %.1f\\n", media); printf("Abaixo da media: %d\\n", contador);',
    ],
    explanation:
      'Percorrer o vetor é o padrão que se repete em toda a Aula 6: o índice anda, v[i] entrega o elemento e você decide o que fazer com ele. Aqui isso acontece duas vezes — uma para acumular, outra para contar.',
  },

  {
    id: 'a6-m3',
    phaseId: 'aula-6',
    order: 3,
    title: 'Maior e menor do vetor',
    difficulty: 'intermediario',
    boss: false,
    isDemo: false,
    xp: 70,
    coins: 20,
    objective: 'Encontrar extremos de uma coleção inicializando com o primeiro elemento.',
    instructions: [
      'Leia 5 inteiros em um vetor.',
      'Descubra o maior e o menor valor.',
      'Imprima no formato: Maior: %d e em outra linha Menor: %d',
      'Inicialize maior e menor com v[0] — não com 0 e nem com um valor inventado.',
    ],
    concepts: ['inicialização com v[0]', 'comparação acumulada', 'laço percorrendo vetor'],
    starterCode: `#include <stdio.h>
#define TAM 5

int main() {
    int v[TAM];
    int maior, menor;

    // TODO: leia, encontre maior e menor, e imprima "Maior:" e "Menor:"

    return 0;
}
`,
    criteria: [
      { id: 'a6-m3-t1', type: 'output', label: '18 7 25 10 14 → Maior 25, Menor 7', stdin: '18 7 25 10 14', expected: 'Maior: 25\nMenor: 7' },
      { id: 'a6-m3-t2', type: 'output', label: 'vetor todo igual → maior e menor iguais', stdin: '3 3 3 3 3', expected: 'Maior: 3\nMenor: 3' },
      {
        id: 'a6-m3-c1',
        type: 'code',
        label: 'inicializa maior e menor com v[0] e percorre o vetor inteiro comparando',
      },
    ],
    hints: [
      'maior = v[0]; menor = v[0]; antes do laço — o vetor já tem um valor válido para começar.',
      'Dentro do laço: if (v[i] > maior) maior = v[i]; if (v[i] < menor) menor = v[i];',
      'Se inicializasse com 0, um vetor só com números positivos teria "menor: 0" — errado.',
    ],
    explanation:
      'O primeiro elemento é o único valor que sabemos que existe sem ter lido o vetor inteiro. Partir dele garante que maior e menor sempre serão elementos reais da coleção.',
  },

  {
    id: 'a6-boss',
    phaseId: 'aula-6',
    order: 4,
    title: 'CHEFÃO: Avaliação da apresentação',
    difficulty: 'desafio',
    boss: true,
    isDemo: false,
    xp: 150,
    coins: 65,
    objective: 'Combinar string com fgets, vetor de notas, média, extremos e busca em uma só missão.',
    instructions: [
      'Leia o TÍTULO com fgets() (ele pode ter espaços) e retire o \\n com strcspn(nome, "\\n").',
      'Leia 8 notas float em um vetor com #define NOTAS 8.',
      'Depois das notas, leia a nota a pesquisar.',
      'Imprima EXATAMENTE nesta ordem e nestes formatos, um por linha:',
      '  Titulo: %s',
      '  Media: %.1f',
      '  Maior: %.1f',
      '  Menor: %.1f',
      '  Aparece: %d   (quantas vezes a nota pesquisada aparece)',
      'Sem acento, sem ponto final e sem linhas extras.',
    ],
    concepts: ['fgets', 'strcspn', 'vetor de float', 'média', 'maior/menor', 'contagem de ocorrências'],
    starterCode: `#include <stdio.h>
#include <string.h>
#define NOTAS 8
#define TAM_TITULO 81

int main() {
    char titulo[TAM_TITULO];
    float notas[NOTAS];
    float pesquisada;

    // TODO: fgets + strcspn no título

    // TODO: leia as 8 notas com laço

    // TODO: média, maior, menor

    // TODO: leia a nota pesquisada e conte ocorrências

    return 0;
}
`,
    criteria: [
      {
        id: 'a6-boss-t1',
        type: 'output',
        label: 'busca pela nota 7.0 (aparece 2 vezes)',
        stdin: 'Introducao a C\n7.0 8.0 6.0 9.0 7.0 8.0 6.0 9.0\n7.0\n',
        expected:
          'Titulo: Introducao a C\nMedia: 7.5\nMaior: 9.0\nMenor: 6.0\nAparece: 2',
      },
      {
        id: 'a6-boss-t2',
        type: 'output',
        label: 'busca pela nota 5.5 (não aparece)',
        stdin: 'Introducao a C\n7.0 8.0 6.0 9.0 7.0 8.0 6.0 9.0\n5.5\n',
        expected:
          'Titulo: Introducao a C\nMedia: 7.5\nMaior: 9.0\nMenor: 6.0\nAparece: 0',
      },
      {
        id: 'a6-boss-c1',
        type: 'code',
        label: 'usa fgets() para o título e remove a quebra de linha com strcspn (ou um laço que substitui \\n por \\0)',
      },
    ],
    hints: [
      'fgets(titulo, TAM_TITULO, stdin); depois nome[strcspn(nome, "\\n")] = \'\\0\'; — sem isso o título sai com uma quebra sobrando.',
      'Média: acumule as 8 notas num laço e divida por NOTAS, com %.1f na impressão.',
      'A contagem segue o padrão: percorra o vetor e faça if (notas[i] == pesquisada) cont++;',
    ],
    explanation:
      'A string aqui é só um vetor de char com um terminador — por isso ela entra nesta aula e não numa aula de "texto". O fgets lê a linha inteira (com espaços), mas guarda também o \\n; removê-lo com strcspn é o que faz "Titulo: Introducao a C" bater exato com o esperado.',
  },

  // ─────────────────────── AULA 7 · MATRIZES & ARRANJOS ────────────────────
  {
    id: 'a7-m1',
    phaseId: 'aula-7',
    order: 1,
    title: 'Matriz 3×2 na tela',
    difficulty: 'iniciante',
    boss: false,
    isDemo: false,
    xp: 60,
    coins: 15,
    objective: 'Percorrer uma matriz com dois índices e exibir linha a linha.',
    instructions: [
      'Crie #define DIAS 3 e #define PERIODOS 2 e a matriz float t[DIAS][PERIODOS].',
      'Leia os 6 valores na ordem (linha a linha, da esquerda para a direita).',
      'Exiba cada LINHA da matriz em uma linha da saída, com %.1f.',
      'Separe os valores com um espaço simples e NÃO deixe espaço sobrando no fim da linha.',
    ],
    concepts: ['declaração de matriz', '[linha][coluna]', 'laços aninhados', 'exibição por linhas'],
    starterCode: `#include <stdio.h>
#define DIAS 3
#define PERIODOS 2

int main() {
    float t[DIAS][PERIODOS];

    // TODO: leia com laços aninhados e exiba linha a linha

    return 0;
}
`,
    criteria: [
      {
        id: 'a7-m1-t1',
        type: 'output',
        label: 'exibe as 3 linhas na ordem lida',
        stdin: '23.5 28.0 22.0 30.5 24.0 27.0',
        expected: '23.5 28.0\n22.0 30.5\n24.0 27.0',
      },
      {
        id: 'a7-m1-c1',
        type: 'code',
        label: 'usa dois laços aninhados (i para linha, j para coluna) tanto na leitura quanto na exibição',
      },
    ],
    hints: [
      'Um laço escolhe a LINHA, o outro percorre as COLUNAS dessa linha.',
      'for (int i = 0; i < DIAS; i++) { for (int j = 0; j < PERIODOS; j++) ... }',
      'O printf do valor fica no interno; o quebra-linha (printf("\\n")) só depois do laço interno, ainda no externo.',
    ],
    explanation:
      'Uma dimensão é um índice, duas dimensões são dois índices. O laço interno termina de vez a cada linha do externo — é o que garante que a saída seja formada exatamente por 3 linhas.',
  },

  {
    id: 'a7-m2',
    phaseId: 'aula-7',
    order: 2,
    title: 'Maior temperatura com função',
    difficulty: 'intermediario',
    boss: false,
    isDemo: false,
    xp: 80,
    coins: 25,
    objective: 'Receber uma matriz em uma função e devolver o maior valor.',
    instructions: [
      'Use a mesma matriz 3×2 e leia os 6 valores.',
      'Exiba a matriz no formato da missão anterior (uma linha por dia, %.1f, sem espaço no fim).',
      'Crie a função float maiorTemperatura(float t[][PERIODOS], int dias).',
      'A função deve percorrer a matriz, inicializar maior com t[0][0] e retornar o maior valor.',
      'Depois imprima no formato: Maior: %.1f',
    ],
    concepts: ['matriz como parâmetro', 'segunda dimensão obrigatória', 'laços aninhados em função', 'return'],
    starterCode: `#include <stdio.h>
#define DIAS 3
#define PERIODOS 2

/* TODO: protótipo — lembre: a segunda dimensão é obrigatória */

int main() {
    float t[DIAS][PERIODOS];

    // TODO: leia, exiba, chame maiorTemperatura e imprima "Maior: %.1f"

    return 0;
}
`,
    criteria: [
      {
        id: 'a7-m2-t1',
        type: 'output',
        label: 'exibe a matriz e o maior valor (30.5)',
        stdin: '23.5 28.0 22.0 30.5 24.0 27.0',
        expected: '23.5 28.0\n22.0 30.5\n24.0 27.0\nMaior: 30.5',
      },
      {
        id: 'a7-m2-c1',
        type: 'code',
        label: 'a função maiorTemperatura recebe float t[][PERIODOS] e int dias, inicializa maior com t[0][0] e retorna maior',
      },
    ],
    hints: [
      'No protótipo, a 1ª dimensão pode ficar vazia, mas a 2ª é obrigatória: float maiorTemperatura(float t[][PERIODOS], int dias);',
      'float maior = t[0][0]; depois percorra tudo comparando: if (t[i][j] > maior) maior = t[i][j];',
      'No main: printf("Maior: %.1f\\n", maiorTemperatura(t, DIAS));',
    ],
    explanation:
      'A função precisa saber o tamanho da SEGUNDA dimensão para calcular onde cada linha começa. Já a primeira pode vir vazia porque quem chama passa o total de linhas como argumento separado — vetor e quantidade viajam juntos.',
  },

  {
    id: 'a7-boss',
    phaseId: 'aula-7',
    order: 3,
    title: 'CHEFÃO: Diário de classe',
    difficulty: 'desafio',
    boss: true,
    isDemo: false,
    xp: 160,
    coins: 70,
    objective: 'Relacionar vetores paralelos e matriz de notas por meio do mesmo índice.',
    instructions: [
      'Guarde os dados de 3 alunos: int ras[ALUNOS], int faltas[ALUNOS], char nomes[ALUNOS][81] e float notas[ALUNOS][2] (com #define ALUNOS 3).',
      'Para cada aluno leia: RA (%d), nome com fgets() (retire o \\n com strcspn), P1, P2 e faltas.',
      'Depois de todos os alunos, leia quantas aulas foram dadas.',
      'ATENÇÃO: consuma o \\n deixado pelo scanf antes do fgets, senão o nome sai vazio.',
      'Para cada aluno imprima EXATAMENTE estas 4 linhas, nesta ordem:',
      '  RA: %d | Nome: %s',
      '  P1: %.1f | P2: %.1f',
      '  Media: %.1f | Frequencia: %.1f%%',
      '  Situacao: Aprovado   (média >= 6.0 E frequência >= 75.0) — senão: Situacao: Reprovado',
      'media = (P1 + P2) / 2.0 e frequencia = (aulasDadas - faltas) * 100.0 / aulasDadas',
      'Sem linha em branco entre os alunos.',
    ],
    concepts: ['vetores paralelos', 'matriz de notas', 'fgets + strcspn', 'limpeza de buffer', '&& em aprovação', 'funções'],
    starterCode: `#include <stdio.h>
#include <string.h>
#define ALUNOS 3
#define TAM_NOME 81
#define QTD_NOTAS 2

/* TODO: protótipos de leitura e de resultados */

int main() {
    int ras[ALUNOS];
    int faltas[ALUNOS];
    char nomes[ALUNOS][TAM_NOME];
    float notas[ALUNOS][QTD_NOTAS];
    int aulasDadas;

    // TODO: leia os 3 alunos, depois as aulas dadas e exiba o relatório

    return 0;
}
`,
    criteria: [
      {
        id: 'a7-boss-t1',
        type: 'output',
        label: 'turma com 40 aulas: 2 aprovados e 1 reprovado por frequência',
        stdin:
          '123\nAna Souza\n7.0 8.0\n2\n348\nBruno Lima\n6.0 6.0\n6\n529\nCarla Dias\n5.0 7.0\n12\n40\n',
        expected:
          'RA: 123 | Nome: Ana Souza\nP1: 7.0 | P2: 8.0\nMedia: 7.5 | Frequencia: 95.0%\nSituacao: Aprovado\nRA: 348 | Nome: Bruno Lima\nP1: 6.0 | P2: 6.0\nMedia: 6.0 | Frequencia: 85.0%\nSituacao: Aprovado\nRA: 529 | Nome: Carla Dias\nP1: 5.0 | P2: 7.0\nMedia: 6.0 | Frequencia: 70.0%\nSituacao: Reprovado',
      },
      {
        id: 'a7-boss-c1',
        type: 'code',
        label: 'usa vetores paralelos (ras, nomes, faltas) mais a matriz de notas, e organiza a solução em funções',
      },
      {
        id: 'a7-boss-c2',
        type: 'code',
        label: 'usa fgets() com strcspn para o nome e consome o \\n pendente do scanf antes de ler o nome',
      },
    ],
    hints: [
      'Depois de scanf("%d", &ras[i]) o \\n fica no buffer: while ((c = getchar()) != \'\\n\' && c != EOF); antes do fgets.',
      'nomes[i][strcspn(nomes[i], "\\n")] = \'\\0\'; remove a quebra que o fgets guarda junto com o texto.',
      'Use 100.0 (não 100) na frequência, senão a divisão inteira estraga o resultado. E lembre: mesmo índice = mesmo aluno.',
    ],
    explanation:
      'O índice é a chave de tudo nesta aula: ras[1], nomes[1], notas[1][0] e faltas[1] descrevem a MESMA pessoa. Note também a aprovação com && — média alta não basta se a frequência cair abaixo de 75%.',
  },
]

export const getMissionById = (id) => MISSIONS.find((m) => m.id === id)

export const getMissionsByPhase = (phaseId) =>
  MISSIONS.filter((m) => m.phaseId === phaseId).sort((a, b) => a.order - b.order)

/** Missão atual recomendada: a primeira não concluída na ordem do curso. */
export function getNextMission(completedIds) {
  return MISSIONS.find((m) => !completedIds.includes(m.id)) ?? null
}
