# Instruções do projeto — Rota do Açaí

## Contexto e tecnologias

- Aplicação web em Node.js (>=18) e Express 4.
- Interface estática em HTML, CSS e JavaScript sem framework, servida de `public/`.
- `server.js` contém a API `/api/extrair`, que integra com a API Messages da Anthropic quando `ANTHROPIC_API_KEY` está configurada.
- Testes usam o executor nativo `node:test` em `test/`.
- O projeto usa CommonJS. Preserve o estilo e os padrões já existentes.

## Orientações de desenvolvimento

- Leia `PRD.md` antes de alterar requisitos ou comportamento do produto.
- Preserve o uso manual do sistema quando a integração com IA estiver indisponível.
- Valide entradas no servidor; nunca exponha chaves de API no HTML ou no JavaScript do navegador.
- Exiba erros de forma clara. Não silencie erros nem substitua falhas por resultados aparentemente válidos.
- Ao inserir valores dinâmicos no HTML, escape texto não confiável; prefira APIs DOM seguras.
- Mantenha a interface em português do Brasil, responsiva e com rótulos acessíveis.
- Inclua ou ajuste testes em `test/` para comportamentos novos ou corrigidos.
- Não adicione dependências, frameworks, persistência ou serviços externos sem necessidade explícita.

## Comandos

- `npm install` — instalar dependências.
- `npm start` — iniciar a aplicação em `http://localhost:3000` (ou na porta de `PORT`).
- `npm run dev` — iniciar com reinício automático do Node.
- `npm test` — executar testes automatizados.
- `node --check server.js` e `node --check public/script.js` — verificar sintaxe JavaScript.

Não há processo de build ou ferramenta de lint configurados: a interface é servida diretamente como arquivos estáticos e o projeto não possui etapa de compilação. Não declare lint/build como aprovados sem configurar e executar ferramentas correspondentes.

## Configuração da IA

Copie `.env.example` para `.env` e preencha `ANTHROPIC_API_KEY` para habilitar o cadastro por texto. `ANTHROPIC_MODEL` é opcional. Nunca inclua valores reais de segredo em commits, documentação ou testes.

## Critério de conclusão

Antes de concluir uma alteração, execute os testes e as verificações de sintaxe pertinentes, confira o comportamento afetado e informe verificações não disponíveis ou que não foram executadas.
