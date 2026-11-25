---
name: desenvolver-funcionalidade
description: Processo para analisar, planejar, implementar e verificar funcionalidades no Rota do Açaí.
---

# Desenvolver funcionalidade

Use este processo ao criar ou alterar qualquer funcionalidade do Rota do Açaí.

## 1. Análise da solicitação

- Leia `AGENTS.md` e as partes relevantes de `PRD.md`.
- Inspecione o código e os testes relacionados antes de propor alterações.
- Delimite o comportamento esperado, os usuários afetados e os arquivos que podem precisar de mudança.
- Preserve as funcionalidades existentes e evite alterações fora do escopo.

## 2. Dúvidas e ambiguidades

- Identifique requisitos contraditórios, dados ausentes e decisões que mudem significativamente o comportamento ou a experiência do usuário.
- Faça perguntas objetivas antes de implementar quando a resposta não puder ser inferida com segurança.
- Quando a dúvida for pequena e não bloquear o trabalho, adote o comportamento existente ou o padrão mais simples e documente a suposição.
- Não invente dados, regras de negócio ou capacidades de serviços externos.

## 3. Planejamento

- Defina a menor sequência de alterações que atende ao requisito.
- Identifique validações, casos de erro e compatibilidade com fluxos existentes.
- Determine testes específicos que falhariam se o comportamento solicitado estivesse incorreto.
- Se a funcionalidade alterar o escopo do produto, proponha atualização do PRD.

## 4. Implementação

- Siga as tecnologias, convenções e comandos descritos em `AGENTS.md`.
- Faça mudanças pequenas e tipadas conforme os padrões da linguagem; reutilize os helpers existentes.
- Valide entradas e mantenha explícitos os erros relevantes.
- Evite dependências novas, abstrações desnecessárias e alterações não relacionadas.
- Atualize documentação diretamente afetada e acrescente testes focados para o comportamento novo ou corrigido.

## 5. Verificação

- Execute os testes automatizados (`npm test`) e a verificação de sintaxe dos arquivos alterados.
- Verifique manualmente ou por teste os caminhos principais e casos de erro afetados.
- Execute lint ou build somente se essas ferramentas existirem ou forem adicionadas justificadamente; não reporte comandos não executados como aprovados.
- Revise o diff para confirmar que não houve alterações incidentais e comunique resultados, limitações e configurações necessárias.
