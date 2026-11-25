require("dotenv").config();

const path = require("node:path");
const express = require("express");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const MAX_TEXT_LENGTH = 2000;

const INSTRUCAO = `Você extrai pontos de coleta de açaí de textos informais de cooperados ribeirinhos.
Responda SOMENTE com um array JSON, sem explicações e sem markdown.
Cada item deve ter:
- "nome": string (nome do local ou do produtor)
- "dist": número em km da base, ou null se o texto não disser
- "kg": número em kg de açaí, ou null se o texto não disser
- "min": minutos de carregamento (use 20 se não for dito)
- "mare": true se o texto indicar que só dá pra entrar na maré cheia, senão false
Nunca invente valores que não estão no texto. Use null.
Se não houver nenhum ponto no texto, responda [].`;

app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

function validarPontos(valor) {
  if (!Array.isArray(valor)) {
    throw new Error("A resposta da IA não é uma lista de pontos.");
  }

  return valor.map((ponto) => {
    if (!ponto || typeof ponto !== "object" || Array.isArray(ponto)) {
      throw new Error("A resposta da IA contém um ponto inválido.");
    }

    const nome = typeof ponto.nome === "string" ? ponto.nome.trim() : "";
    const numeroOuNulo = (valor, campo) => {
      if (valor === null) return null;
      if (typeof valor !== "number" || !Number.isFinite(valor) || valor < 0) {
        throw new Error(`O campo "${campo}" de um ponto é inválido.`);
      }
      return valor;
    };

    if (!nome || nome.length > 120) {
      throw new Error("A resposta da IA contém um nome inválido.");
    }
    if (typeof ponto.mare !== "boolean") {
      throw new Error('O campo "mare" de um ponto é inválido.');
    }

    return {
      nome,
      dist: numeroOuNulo(ponto.dist, "dist"),
      kg: numeroOuNulo(ponto.kg, "kg"),
      min: ponto.min === undefined ? 20 : numeroOuNulo(ponto.min, "min"),
      mare: ponto.mare,
    };
  });
}

app.post("/api/extrair", async (req, res) => {
  const texto = typeof req.body?.texto === "string"
    ? req.body.texto.trim().slice(0, MAX_TEXT_LENGTH)
    : "";

  if (!texto) {
    return res.status(400).json({ erro: "Escreva um texto para interpretar." });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({
      erro: "A integração com a IA não está configurada. Defina ANTHROPIC_API_KEY no arquivo .env.",
    });
  }

  try {
    const resposta = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5",
        max_tokens: 1000,
        system: INSTRUCAO,
        messages: [{ role: "user", content: texto }],
      }),
    });

    const dados = await resposta.json();
    if (!resposta.ok) {
      console.error("Erro retornado pela API Anthropic:", dados.error?.type || resposta.status);
      return res.status(502).json({
        erro: "A API de IA não conseguiu processar o pedido. Verifique a chave, o modelo e os créditos.",
      });
    }

    const textoResposta = dados.content
      ?.filter((bloco) => bloco.type === "text")
      .map((bloco) => bloco.text)
      .join("")
      .trim();

    if (!textoResposta) {
      throw new Error("A API de IA retornou uma resposta vazia.");
    }

    const pontos = validarPontos(JSON.parse(textoResposta));
    return res.json({ pontos });
  } catch (erro) {
    console.error("Falha ao extrair pontos:", erro.message);
    return res.status(502).json({
      erro: "Não foi possível interpretar uma resposta válida. Tente reformular o texto.",
    });
  }
});

app.use((erro, req, res, next) => {
  if (erro instanceof SyntaxError && erro.status === 400 && "body" in erro) {
    return res.status(400).json({ erro: "O corpo da requisição não contém um JSON válido." });
  }
  if (erro.status === 413) {
    return res.status(413).json({ erro: "A requisição excedeu o tamanho permitido." });
  }
  return next(erro);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Rota do Açaí disponível em http://localhost:${PORT}`);
  });
}

module.exports = { app, validarPontos };
