"use strict";

const pontos = [];
const $ = (id) => document.getElementById(id);

function paraMin(hora) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

function paraHora(min) {
  const total = Math.round(min);
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function esc(texto) {
  const elemento = document.createElement("span");
  elemento.textContent = String(texto);
  return elemento.innerHTML;
}

function mostrarLista() {
  const ul = $("lista");
  ul.replaceChildren();

  pontos.forEach((ponto, indice) => {
    const li = document.createElement("li");
    const descricao = document.createElement("span");
    descricao.innerHTML =
      `<strong>${esc(ponto.nome)}</strong> — ${ponto.dist} km, ${ponto.kg} kg` +
      `${ponto.mare ? " 🌊 maré cheia" : ""}`;

    const botao = document.createElement("button");
    botao.type = "button";
    botao.dataset.indice = String(indice);
    botao.textContent = "Remover";
    botao.setAttribute("aria-label", `Remover ${ponto.nome}`);

    li.append(descricao, botao);
    ul.appendChild(li);
  });
}

$("form-ponto").addEventListener("submit", (evento) => {
  evento.preventDefault();
  const nome = $("nome").value.trim();
  const dist = Number($("dist").value);
  const kg = Number($("kg").value);
  const min = Number($("min").value);

  if (!nome || ![dist, kg, min].every(Number.isFinite) || dist < 0 || kg < 0 || min < 0) {
    return;
  }

  pontos.push({
    nome,
    dist,
    kg,
    min,
    mare: $("precisaMare").checked,
  });
  evento.target.reset();
  $("min").value = 20;
  mostrarLista();
  $("resultado").replaceChildren();
});

$("lista").addEventListener("click", (evento) => {
  const botao = evento.target.closest("button[data-indice]");
  if (!botao) return;

  pontos.splice(Number(botao.dataset.indice), 1);
  mostrarLista();
  $("resultado").replaceChildren();
});

function configurarRota() {
  const saida = paraMin($("saida").value);
  const mare = paraMin($("mare").value);
  const velocidade = Number($("vel").value);
  const capacidade = Number($("cap").value);
  const folga = Number($("folga").value);

  if (
    ![saida, mare, velocidade, capacidade, folga].every(Number.isFinite) ||
    velocidade <= 0 ||
    capacidade <= 0 ||
    folga < 0
  ) {
    throw new Error("Confira os horários, a velocidade, a capacidade e a janela da maré.");
  }

  return {
    saida,
    vel: velocidade,
    cap: capacidade,
    ini: mare - folga,
    fim: mare + folga,
  };
}

function simular(ordem, cfg) {
  let tempo = cfg.saida;
  let posicao = 0;
  let carga = 0;
  let espera = 0;
  let atrasos = 0;
  const linhas = [];

  ordem.forEach((ponto) => {
    tempo += (Math.abs(ponto.dist - posicao) / cfg.vel) * 60;
    posicao = ponto.dist;

    const chegada = tempo;
    let esperaPonto = 0;
    const avisos = [];

    if (ponto.mare) {
      if (tempo < cfg.ini) {
        esperaPonto = cfg.ini - tempo;
        tempo = cfg.ini;
        espera += esperaPonto;
      } else if (tempo > cfg.fim) {
        atrasos++;
        avisos.push("Chegou depois da janela de maré");
      }
    }

    tempo += ponto.min;
    carga += ponto.kg;
    if (carga > cfg.cap) avisos.push("Capacidade excedida");

    linhas.push({ p: ponto, chegada, espera: esperaPonto, saida: tempo, carga, avisos });
  });

  const volta = tempo + (posicao / cfg.vel) * 60;
  return { linhas, volta, espera, atrasos, carga };
}

function custo(ordem, cfg) {
  const simulacao = simular(ordem, cfg);
  const excesso = Math.max(0, simulacao.carga - cfg.cap);
  return simulacao.volta + simulacao.atrasos * 10000 + excesso * 10000;
}

function embaralhar(lista) {
  const resultado = [...lista];
  for (let i = resultado.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
  }
  return resultado;
}

function cruzamento(pai, mae) {
  const n = pai.length;
  if (n < 2) return [...pai];

  let inicio = Math.floor(Math.random() * n);
  let fim = Math.floor(Math.random() * n);
  if (inicio > fim) [inicio, fim] = [fim, inicio];

  const filho = new Array(n).fill(null);
  for (let i = inicio; i <= fim; i++) filho[i] = pai[i];

  let posicao = (fim + 1) % n;
  for (let i = 0; i < n; i++) {
    const gene = mae[(fim + 1 + i) % n];
    if (!filho.includes(gene)) {
      filho[posicao] = gene;
      posicao = (posicao + 1) % n;
    }
  }
  return filho;
}

function mutacao(ordem) {
  if (ordem.length < 2) return [...ordem];
  const resultado = [...ordem];
  const i = Math.floor(Math.random() * resultado.length);
  let j = Math.floor(Math.random() * resultado.length);
  while (j === i) j = Math.floor(Math.random() * resultado.length);
  [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
  return resultado;
}

function algoritmoGenetico(lista, cfg) {
  const tamanho = 80;
  const geracoes = 150;
  const elite = 4;
  const porDistancia = [...lista].sort((a, b) => a.dist - b.dist);
  if (lista.length < 2) return { melhor: [...lista], simples: porDistancia };

  let populacao = Array.from({ length: tamanho }, () => embaralhar(lista));
  populacao.push(porDistancia);

  const torneio = () => {
    const primeiro = populacao[Math.floor(Math.random() * populacao.length)];
    const segundo = populacao[Math.floor(Math.random() * populacao.length)];
    return custo(primeiro, cfg) < custo(segundo, cfg) ? primeiro : segundo;
  };

  for (let geracao = 0; geracao < geracoes; geracao++) {
    populacao.sort((a, b) => custo(a, cfg) - custo(b, cfg));
    const novaPopulacao = populacao.slice(0, elite);

    while (novaPopulacao.length < tamanho) {
      let filho = cruzamento(torneio(), torneio());
      if (Math.random() < 0.2) filho = mutacao(filho);
      novaPopulacao.push(filho);
    }
    populacao = novaPopulacao;
  }

  populacao.sort((a, b) => custo(a, cfg) - custo(b, cfg));
  return { melhor: populacao[0], simples: porDistancia };
}

function mostrarResultado(simulacao, base, cfg) {
  const corpo = simulacao.linhas.map((linha) => `
    <tr>
      <td>${esc(linha.p.nome)}</td>
      <td>${paraHora(linha.chegada)}</td>
      <td>${linha.espera ? `${Math.round(linha.espera)} min` : "-"}</td>
      <td>${paraHora(linha.saida)}</td>
      <td>${linha.carga} kg</td>
      <td class="${linha.avisos.length ? "aviso" : "ok"}">${linha.avisos.length ? esc(linha.avisos.join("; ")) : "OK"}</td>
    </tr>`).join("");
  const ganho = Math.round(base.volta - simulacao.volta);
  const totalAvisos = simulacao.linhas.flatMap((linha) => linha.avisos);

  $("resultado").innerHTML = `
    ${totalAvisos.length ? '<p class="aviso">Atenção: a rota tem pontos fora da capacidade ou da janela da maré.</p>' : ""}
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Ponto</th><th>Chegada</th><th>Espera</th><th>Saída</th><th>Carga</th><th>Status</th></tr>
        </thead>
        <tbody>${corpo}</tbody>
      </table>
    </div>
    <p class="resumo">
      <strong>Retorno à base:</strong> ${paraHora(simulacao.volta)}<br>
      <strong>Total coletado:</strong> ${simulacao.carga} kg de ${cfg.cap} kg<br>
      <strong>Tempo esperando a maré:</strong> ${Math.round(simulacao.espera)} min
    </p>
    <div class="comparacao">
      <strong>Roteiro simples (por distância):</strong> volta às ${paraHora(base.volta)},
      ${Math.round(base.espera)} min de espera, ${base.atrasos} perda(s) de maré.<br>
      <strong>Roteiro otimizado:</strong> volta às ${paraHora(simulacao.volta)},
      ${Math.round(simulacao.espera)} min de espera, ${simulacao.atrasos} perda(s) de maré.<br>
      <strong>Comparação:</strong> ${ganho > 0 ? `${ganho} min economizados` : ganho < 0 ? `${Math.abs(ganho)} min a mais` : "mesmo tempo de retorno"}.
      A otimização usa um algoritmo genético e pode variar entre execuções.
    </div>`;
}

$("btn-calcular").addEventListener("click", () => {
  if (pontos.length === 0) {
    $("resultado").innerHTML = '<p class="aviso">Adicione pelo menos um ponto.</p>';
    return;
  }

  try {
    const cfg = configurarRota();
    const { melhor, simples } = algoritmoGenetico(pontos, cfg);
    mostrarResultado(simular(melhor, cfg), simular(simples, cfg), cfg);
  } catch (erro) {
    $("resultado").innerHTML = `<p class="aviso">${esc(erro.message)}</p>`;
  }
});

$("btn-ia-texto").addEventListener("click", async (evento) => {
  const texto = $("texto-livre").value.trim();
  const mensagem = $("msg-ia");
  const botao = evento.currentTarget;

  if (!texto) {
    mensagem.textContent = "Escreva algo primeiro.";
    return;
  }

  botao.disabled = true;
  mensagem.textContent = "Lendo o texto com a IA...";

  try {
    const resposta = await fetch("/api/extrair", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto }),
    });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || "Falha ao consultar a IA.");
    if (!Array.isArray(dados.pontos)) throw new Error("A resposta da IA está em formato inválido.");

    let adicionados = 0;
    const incompletos = [];

    dados.pontos.forEach((ponto) => {
      const dist = Number(ponto.dist);
      const kg = Number(ponto.kg);
      if (
        ponto.dist == null || ponto.kg == null ||
        !Number.isFinite(dist) || !Number.isFinite(kg) || dist < 0 || kg < 0
      ) {
        incompletos.push(String(ponto.nome || "sem nome"));
        return;
      }

      const min = Number(ponto.min);
      pontos.push({
        nome: String(ponto.nome || "Sem nome").slice(0, 120),
        dist,
        kg,
        min: Number.isFinite(min) && min >= 0 ? min : 20,
        mare: ponto.mare === true,
      });
      adicionados++;
    });

    mostrarLista();
    $("resultado").replaceChildren();

    let resumo = `${adicionados} ponto(s) cadastrado(s).`;
    if (incompletos.length) {
      resumo += ` Faltou distância ou kg em: ${incompletos.join(", ")}. Confira e cadastre manualmente.`;
    }
    if (dados.pontos.length === 0) resumo = "Nenhum ponto de coleta foi encontrado no texto.";
    mensagem.textContent = resumo;
    if (adicionados) $("texto-livre").value = "";
  } catch (erro) {
    mensagem.textContent = `Erro: ${erro.message}`;
  } finally {
    botao.disabled = false;
  }
});
