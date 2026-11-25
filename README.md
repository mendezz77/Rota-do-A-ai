# Rota do Açaí

Aplicação web para cadastrar pontos de coleta de açaí e comparar uma rota otimizada com uma ordem simples por distância, considerando horário de saída, velocidade, capacidade do barco e maré.

## Requisitos

- Node.js 18 ou superior.
- Uma chave Anthropic é opcional e necessária somente para cadastrar pontos descrevendo-os em texto.

## Executar

```powershell
npm install
npm start
```

Abra `http://localhost:3000`. Para desenvolvimento com reinício automático, use `npm run dev`.

O cadastro manual e o planejamento de rota funcionam sem chave de IA. Para ativar a extração por texto, copie `.env.example` para `.env` e preencha `ANTHROPIC_API_KEY`. Opcionalmente, defina `ANTHROPIC_MODEL`.

## Testes e verificações

```powershell
npm test
node --check server.js
node --check public/script.js
```

Não há lint nem etapa de build configurados. Consulte `PRD.md`, `AGENTS.md` e `docs/plans/PLANO-INICIAL.md` para requisitos, orientações e escopo.
