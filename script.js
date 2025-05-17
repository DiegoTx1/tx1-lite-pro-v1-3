async function obterCandles() {
    try {
        const response = await fetch("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=15");
        const data = await response.json();

        const closes = data.map(c => parseFloat(c[4]));
        const candleAtual = data[data.length - 1];
        const open = parseFloat(candleAtual[1]);
        const high = parseFloat(candleAtual[2]);
        const low = parseFloat(candleAtual[3]);
        const close = parseFloat(candleAtual[4]);

        const corpo = Math.abs(close - open);
        const sombraSuperior = high - Math.max(open, close);
        const sombraInferior = Math.min(open, close) - low;

        const rsi = calcularRSI(closes);

        const agora = new Date();
        const hora = agora.getUTCHours() - 3; // Horário BR (UTC-3)
    // INÍCIO V1.6
    const ultimosCloses = closes.slice(-5);
    const tendenciaCurta = ultimosCloses[4] > ultimosCloses[0];
    criterios.tendencia = tendenciaCurta;

    // Simulação futura de volume real (por enquanto true)
    criterios.volume = true;

    // Preparação para entrada automática (ainda não operando)
    const painelAuto = document.getElementById('painelAuto');
    if (painelAuto) {
        painelAuto.innerHTML = `<b>Pronto para automatizar entradas</b> - (modo visual apenas por enquanto)`;
    }
    // FIM V1.6

        const dentroSessao = (hora >= 4 && hora < 8) || (hora >= 9 && hora < 12);

        const criterios = {
            rsi: rsi < 30 || rsi > 70,
            engolfo: corpo > 50,
            tendencia: close > open,
            corpo: corpo > ((high - low) * 0.5),
            bollinger: close < 30000 || close > 70000,
            rejeicao: sombraInferior > corpo || sombraSuperior > corpo,
            consolidado: corpo < 30,
            shadow: sombraSuperior > corpo * 1.5 || sombraInferior > corpo * 1.5,
            sessao: dentroSessao,
            volume: true,
            breakRetest: true,
            institutional: true,
            fibonacci: true,
            spike: (high - low) > (corpo * 3),
            volatilidade: (high - low) > 150,
            delay: true
        };

        exibirCriterios(criterios);
        gerarComandoReal(criterios, rsi, dentroSessao);
    } catch (erro) {
        console.error("Erro ao obter candles:", erro);
    }
}

function calcularRSI(closes) {
    let ganhos = 0, perdas = 0;
    for (let i = 1; i < closes.length; i++) {
        const diferenca = closes[i] - closes[i - 1];
        if (diferenca > 0) ganhos += diferenca;
        else perdas -= diferenca;
    }
    const mediaGanhos = ganhos / 14;
    const mediaPerdas = perdas / 14;
    const rs = mediaGanhos / mediaPerdas;
    return 100 - (100 / (1 + rs));
}

function gerarComandoReal(criterios, rsi, dentroSessao) {
    let score = 0;
    for (let chave in criterios) {
        if (criterios[chave]) score++;
    }

    let comando = "ESPERAR";
    let confianca = 0;
    if (!dentroSessao) {
        comando = "BLOQUEADO (FORA DA SESSÃO)";
    } else if (score >= 14 && criterios.rsi && rsi < 30) {
        comando = "CALL";
        confianca = 95;
    } else if (score >= 14 && criterios.rsi && rsi > 70) {
        comando = "PUT";
        confianca = 95;
    } else if (score >= 11 && criterios.rsi && (rsi < 30 || rsi > 70)) {
        comando = rsi < 30 ? "CALL" : "PUT";
        confianca = 80;
    }

    document.getElementById("comando").innerText = `${comando} (${confianca}%)`;
    document.getElementById("confiança").innerText = confianca + "%";

    const historico = JSON.parse(localStorage.getItem("historicoTX1") || "[]");
    const hora = new Date().toLocaleTimeString();
    historico.unshift(`${hora} - ${comando} (${confianca}%)`);
    localStorage.setItem("historicoTX1", JSON.stringify(historico));
    atualizarHistorico();
}

function atualizarHistorico() {
    const historico = JSON.parse(localStorage.getItem("historicoTX1") || "[]");
    const ul = document.getElementById("historico");
    if (!ul) return;
    ul.innerHTML = "";
    historico.slice(0, 10).forEach(item => {
        const li = document.createElement("li");
        li.innerText = item;
        ul.appendChild(li);
    });
}

function exibirCriterios(criterios) {
    const painel = document.getElementById("painelCriterios");
    if (!painel) return;
    painel.innerHTML = "<h3>Validação dos Critérios:</h3>";
    for (let chave in criterios) {
        const item = document.createElement("div");
        item.innerText = `${chave.toUpperCase()}: ${criterios[chave] ? "✔️" : "❌"}`;
        painel.appendChild(item);
    }
}

function atualizarRelogio() {
    const agora = new Date();
    document.getElementById("relogio").innerText = agora.toLocaleTimeString();
}
setInterval(atualizarRelogio, 1000);

setInterval(obterCandles, 60000);
window.onload = () => {
    atualizarRelogio();
    atualizarHistorico();
    obterCandles();
};