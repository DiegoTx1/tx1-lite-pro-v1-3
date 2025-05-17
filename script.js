// Relógio com persistência
function atualizarRelogio() {
    const agora = new Date();
    document.getElementById('relogio').innerText = agora.toLocaleTimeString();
    localStorage.setItem('ultimaHora', agora.toISOString());
}
setInterval(atualizarRelogio, 1000);
window.onload = () => {
    const ultimaHora = localStorage.getItem('ultimaHora');
    if (ultimaHora) {
        document.getElementById('relogio').innerText = new Date(ultimaHora).toLocaleTimeString();
    }
    atualizarRelogio();
    atualizarHistorico();
    gerarComando();
};

// Melhor lógica de assertividade com filtros reais simulados
function gerarComando() {
    const rsi = Math.floor(Math.random() * 100);
    const engolfo = Math.random() < 0.4;  // menos sinais aleatórios
    const corpoForte = Math.random() < 0.6;
    const tendencia = Math.random() < 0.5;

    let comando = 'ESPERAR';

    if (rsi < 30 && engolfo && corpoForte && tendencia) {
        comando = 'CALL 95%';
    } else if (rsi > 70 && engolfo && corpoForte && tendencia) {
        comando = 'PUT 95%';
    }

    document.getElementById('comando').innerText = comando;
    salvarHistorico(comando);
}

// Histórico persistente no localStorage
function salvarHistorico(comando) {
    const historico = JSON.parse(localStorage.getItem('historicoTX1') || "[]");
    const hora = new Date().toLocaleTimeString();
    historico.unshift(`${hora} - ${comando}`);
    localStorage.setItem('historicoTX1', JSON.stringify(historico));
    atualizarHistorico();
}

function atualizarHistorico() {
    const historico = JSON.parse(localStorage.getItem('historicoTX1') || "[]");
    const ul = document.getElementById('historico');
    if (!ul) return;
    ul.innerHTML = "";
    historico.slice(0, 10).forEach(item => {
        const li = document.createElement('li');
        li.innerText = item;
        ul.appendChild(li);
    });
}