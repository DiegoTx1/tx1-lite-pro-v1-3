
let wins = 0, losses = 0, somAtivo = true, sessaoAtiva = true;
let historico = [];

function toggleSom() {
    somAtivo = !somAtivo;
}

function finalizarSessao() {
    sessaoAtiva = false;
    document.getElementById("status").innerHTML = "<strong style='color:red'>Sessão pausada</strong>";
}

function iniciarSessao() {
    sessaoAtiva = true;
    document.getElementById("status").innerHTML = "<strong style='color:lime'>Sessão ativa</strong>";
    analisarVela();
}

function registrarWin() {
    wins++;
    atualizarHistorico();
}
function registrarLoss() {
    losses++;
    atualizarHistorico();
}
function atualizarHistorico() {
    document.getElementById("historico").textContent = `Histórico: ${wins} WIN / ${losses} LOSS`;
}

async function analisarVela() {
    if (!sessaoAtiva) return;

    try {
        const response = await fetch("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=20");
        const data = await response.json();

        const candles = data.map(c => ({
            open: parseFloat(c[1]),
            high: parseFloat(c[2]),
            low: parseFloat(c[3]),
            close: parseFloat(c[4]),
            timestamp: c[0]
        }));

        const rsi = calcularRSI(candles);
        const atual = candles[candles.length - 1];
        const anterior = candles[candles.length - 2];

        // Tendência com base nas últimas 10 velas
        const ultimos10 = candles.slice(-11, -1);
        const closes = ultimos10.map(c => c.close);
        let direcao = 0;
        for (let i = 1; i < closes.length; i++) {
            if (closes[i] > closes[i - 1]) direcao++;
            else if (closes[i] < closes[i - 1]) direcao--;
        }

        let comando = "ESPERAR";
        let score = 0;

        const corpo = Math.abs(atual.close - atual.open);
        const sombraSuperior = atual.high - Math.max(atual.close, atual.open);
        const sombraInferior = Math.min(atual.close, atual.open) - atual.low;
        const sombraMaior = Math.max(sombraSuperior, sombraInferior);

        const tendenciaAlta = direcao >= 6;
        const tendenciaBaixa = direcao <= -6;

        if (rsi < 30 && corpo > sombraMaior && tendenciaAlta) {
            comando = "CALL";
            score += 60;
        }
        if (rsi > 70 && corpo > sombraMaior && tendenciaBaixa) {
            comando = "PUT";
            score += 60;
        }
        if (corpo > Math.abs(anterior.close - anterior.open)) {
            score += 20;
        }
        if (sombraMaior > corpo) {
            score = 0;
            comando = "ESPERAR";
        }

        const horario = new Date(atual.timestamp).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });

        document.getElementById("comando").innerHTML = `Comando Atual: <strong>${comando}</strong>`;
        document.getElementById("score").textContent = `Confiabilidade: ${score}%`;
        document.getElementById("horario").textContent = `Entrada: ${horario}`;

        if (comando !== "ESPERAR") {
            historico.unshift(`${horario} – ${comando} – ${score}%`);
            if (historico.length > 5) historico.pop();
            document.getElementById("historicoDetalhado").innerHTML = historico.map(e => `<div>${e}</div>`).join("");

            if (somAtivo) {
                new Audio('https://www.soundjay.com/buttons/sounds/beep-07.mp3').play();
                sendToWhatsApp(comando, score, horario);
            }
        }

    } catch (e) {
        console.error("Erro na análise da vela:", e);
    }
}

function calcularRSI(candles) {
    let ganhos = 0, perdas = 0;
    for (let i = 1; i < 15; i++) {
        const diff = candles[i].close - candles[i - 1].close;
        if (diff > 0) ganhos += diff;
        else perdas -= diff;
    }
    const rs = ganhos / (perdas || 1);
    return 100 - 100 / (1 + rs);
}

setInterval(() => {
    const now = new Date();
    if (now.getSeconds() === 59 && sessaoAtiva) {
        analisarVela();
    }
}, 1000);

iniciarSessao();
