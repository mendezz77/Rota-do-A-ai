# Plano inicial — Rota do Açaí

## Objetivo

Entregar uma aplicação web demonstrável para organizar pontos de coleta de açaí e planejar o percurso de um barco considerando capacidade, distância e janela de maré. O plano deriva dos requisitos do `PRD.md` e respeita a estrutura simples já existente no projeto.

## Escopo

- Configuração da saída, velocidade, capacidade e janela de maré.
- Cadastro e remoção manual de pontos.
- Cadastro assistido por IA com revisão de dados incompletos.
- Simulação e otimização da sequência de visitas.
- Exibição de horários, carga, avisos e comparação com a ordem por distância.
- Testes da API, documentação de execução e verificação da aplicação.

Persistência, login, mapas, GPS e integrações adicionais ficam fora do escopo inicial.

## Etapas

1. **Definir produto e critérios:** registrar público, objetivo, requisitos, regras e critérios de aceitação no `PRD.md`.
2. **Preparar instruções e fluxo de trabalho:** documentar tecnologias e comandos em `AGENTS.md` e criar a Skill `desenvolver-funcionalidade`.
3. **Implementar a interface principal:** permitir configurar barco/maré, cadastrar e remover pontos, calcular a rota, apresentar avisos e comparar roteiros.
4. **Implementar a extração assistida:** aceitar texto limitado, consultar a Anthropic somente no servidor, validar a resposta e permitir completar manualmente dados ausentes.
5. **Verificar e corrigir:** executar testes automatizados, verificar sintaxe, iniciar a aplicação e conferir os fluxos principais e as respostas de erro.

## Critérios de conclusão

- Os critérios CA-01 a CA-08 do `PRD.md` são atendidos.
- A aplicação pode iniciar com `npm start`; cadastro manual e planejamento não dependem de credencial de IA.
- A configuração opcional de IA está documentada e não expõe segredos ao cliente.
- `npm test` e as verificações de sintaxe passam.
- As limitações de lint e build são registradas, pois esta aplicação estática não possui essas etapas configuradas.

## Situação da versão no workspace

O código da aplicação já estava presente no workspace antes da criação deste plano. A interface, a API opcional de extração por IA, a simulação/otimização de rota e testes da API estão implementados. Este plano documenta o escopo e a sequência de desenvolvimento correspondentes; a validação executada para esta entrega será registrada na resposta da tarefa.
