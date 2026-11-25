const test = require("node:test");
const assert = require("node:assert/strict");
const { app, validarPontos } = require("../server");

test("validarPontos aceita uma lista vazia", () => {
  assert.deepEqual(validarPontos([]), []);
});

test("validarPontos preserva campos nulos e aplica o tempo de carga padrão", () => {
  assert.deepEqual(validarPontos([
    { nome: "Igarapé Grande", dist: null, kg: 300, mare: true },
  ]), [
    { nome: "Igarapé Grande", dist: null, kg: 300, min: 20, mare: true },
  ]);
});

test("validarPontos rejeita formatos e valores inválidos", () => {
  assert.throws(() => validarPontos({}), /lista de pontos/);
  assert.throws(() => validarPontos([
    { nome: "Ponto", dist: -1, kg: 100, min: 20, mare: false },
  ]), /dist/);
  assert.throws(() => validarPontos([
    { nome: "Ponto", dist: 1, kg: 100, min: 20, mare: "sim" },
  ]), /mare/);
});

test("a API responde com erros claros para texto vazio e integração não configurada", async () => {
  const chaveOriginal = process.env.ANTHROPIC_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;

  const servidor = app.listen(0);
  try {
    await new Promise((resolve) => servidor.once("listening", resolve));
    const baseUrl = `http://127.0.0.1:${servidor.address().port}`;
    const pagina = await fetch(baseUrl);
    assert.equal(pagina.status, 200);
    assert.match(await pagina.text(), /Rota do Açaí/);

    const vazio = await fetch(`${baseUrl}/api/extrair`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ texto: "   " }),
    });
    assert.equal(vazio.status, 400);
    assert.equal((await vazio.json()).erro, "Escreva um texto para interpretar.");

    const semChave = await fetch(`${baseUrl}/api/extrair`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ texto: "Ponto a 2 km, 10 kg." }),
    });
    assert.equal(semChave.status, 503);
    assert.match((await semChave.json()).erro, /ANTHROPIC_API_KEY/);
  } finally {
    await new Promise((resolve, reject) => {
      servidor.close((erro) => erro ? reject(erro) : resolve());
    });
    if (chaveOriginal === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = chaveOriginal;
  }
});
