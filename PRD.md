# PRD — Rota do Açaí

## 1. Visão do produto

- **Nome:** Rota do Açaí
- **Objetivo:** ajudar cooperativas e pequenos produtores ribeirinhos a planejar a coleta de açaí por barco, considerando distância, tempo de carga, capacidade da embarcação e horário da maré.
- **Público-alvo:** cooperativas, barqueiros e produtores que organizam coletas em comunidades e igarapés.
- **Problema:** organizar os pontos e a ordem de coleta manualmente exige comparar informações dispersas e pode aumentar o tempo de viagem, causar perda da janela de maré ou exceder a capacidade do barco.

O sistema é uma aplicação web demonstrável. Os dados são mantidos apenas durante a sessão no navegador; não há cadastro de usuários nem persistência em banco de dados.

## 2. Funcionalidades principais

### RF-01 — Configurar a embarcação e a maré
O usuário pode informar horário de saída, velocidade do barco, capacidade máxima, horário da maré cheia e tolerância da janela de maré.

### RF-02 — Cadastrar pontos manualmente
O usuário pode adicionar um ponto com nome, distância da base, quantidade estimada de açaí, duração do carregamento e indicação de acesso condicionado à maré cheia.

### RF-03 — Remover pontos
O usuário pode remover pontos da lista antes de calcular a rota.

### RF-04 — Interpretar uma descrição com IA
O usuário pode enviar uma descrição em português informal para extrair pontos de coleta. A aplicação apresenta o resultado na lista e informa quando faltam distância ou quantidade; os dados incompletos podem ser cadastrados manualmente.

### RF-05 — Planejar e otimizar a rota
O usuário pode calcular uma ordem de visita e visualizar horários de chegada e saída, espera pela maré, carga acumulada e avisos de capacidade ou janela perdida.

### RF-06 — Comparar roteiros
O usuário pode comparar o roteiro otimizado com um roteiro simples ordenado por distância, incluindo horário de retorno, espera e perdas da janela de maré.

## 3. Requisitos não funcionais

### RNF-01 — Acessibilidade e compatibilidade
A interface deve ser utilizável em navegadores modernos, adaptar-se a telas pequenas e oferecer rótulos, foco visível e mensagens de estado para tecnologias assistivas.

### RNF-02 — Segurança da integração
A chave da API Anthropic deve permanecer no servidor, configurada por variável de ambiente, e nunca ser enviada ao navegador. A API deve validar os dados recebidos e limitar o tamanho do texto.

### RNF-03 — Clareza e resiliência
Erros de configuração e de processamento devem ser comunicados em linguagem clara. A função de cadastro manual deve continuar disponível quando a integração de IA não estiver configurada.

### RNF-04 — Manutenibilidade
O projeto deve manter dependências e comandos documentados, usar JavaScript sem framework e possuir testes automatizados para as regras da API.

## 4. Regras de negócio

1. Distâncias, quantidades e tempos não podem ser negativos; velocidade e capacidade devem ser maiores que zero.
2. O ponto indica se requer maré cheia. A janela permitida é calculada como horário da maré mais ou menos a tolerância configurada.
3. Se a embarcação chegar antes da janela a um ponto dependente da maré, deve aguardar até o início da janela. Chegar depois do fim gera um aviso e conta como perda da janela.
4. A carga acumulada não pode exceder a capacidade sem que a rota apresente um aviso. A coleta não é descartada automaticamente.
5. Se o texto extraído pela IA não informar distância ou quantidade, o sistema não deve inventar esses valores; o usuário deve completar o cadastro manualmente.
6. O tempo padrão de carregamento de um ponto extraído pela IA é 20 minutos quando não informado.
7. Uma chave de API Anthropic é necessária somente para o cadastro por IA; o restante do sistema funciona sem ela.

## 5. Critérios de aceitação

- **CA-01:** ao preencher dados válidos do barco e da maré, o usuário consegue calcular a rota para pelo menos um ponto.
- **CA-02:** ao adicionar e remover pontos, a lista reflete as alterações e um resultado anterior é limpo.
- **CA-03:** o planejamento mostra cada ponto na ordem calculada, horários, carga acumulada, retorno à base e avisos pertinentes.
- **CA-04:** o roteiro otimizado é comparado com a ordem simples por distância e apresenta o tempo de espera e as perdas de maré.
- **CA-05:** ao calcular sem pontos, a interface solicita que seja adicionado ao menos um.
- **CA-06:** com a API de IA sem configuração, a API responde com erro explícito e a interface continua permitindo cadastro manual.
- **CA-07:** entradas inválidas ou respostas de IA com formato inesperado são rejeitadas com mensagem adequada, sem serem tratadas como sucesso.
- **CA-08:** `npm test` conclui os testes automatizados sem falhas.

## 6. Fora do escopo desta versão

Persistência de dados, autenticação, mapas/geocodificação, acompanhamento GPS, integração com serviços de maré e geração de rotas por coordenadas não fazem parte do protótipo.
