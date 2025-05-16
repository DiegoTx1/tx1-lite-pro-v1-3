let wins = 0, losses = 0;

function atualizarComando() {
    const comandos = ['CALL', 'PUT', 'ESPERAR'];
    const score = Math.floor(Math.random() * 21) + 80;
    const comando = comandos[Math.floor(Math.random() * comandos.length)];
    const hora = new Date();
    const entrada = `${hora.getHours()}:${String(hora.getMinutes()).padStart(2, '0')}`;

    document.getElementById("comando").textContent = comando;
    document.getElementById("score").textContent = score + "%";
    document.getElementById("horario").textContent = entrada + " - " + (hora.getMinutes()+1);
}

function registrarEntrada(tipo) {
    if (Math.random() > 0.3) { wins++; } else { losses++; }
    document.getElementById("historico").textContent = `${wins} WIN / ${losses} LOSS`;
}

function finalizarSessao() {
    alert("Sessão finalizada. TX1 está em descanso.");
}

setInterval(atualizarComando, 10000);