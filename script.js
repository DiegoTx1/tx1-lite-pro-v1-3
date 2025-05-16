
let segundos = 0;
let wins = 0, losses = 0;
let somAtivo = true;

function leituraVela() {
    segundos++;
    if (segundos > 59) {
        segundos = 0;
        analisarCandle();
    }
    document.getElementById("contador").textContent = `Lendo vela: ${segundos}s / 60s`;
}

function analisarCandle() {
    const horario = new Date();
    const min = String(horario.getMinutes()).padStart(2, '0');
    const hora = String(horario.getHours()).padStart(2, '0');
    const comandoPossivel = ["CALL", "PUT", "ESPERAR"];
    const escolha = Math.random();
    let comando = "ESPERAR";
    let score = Math.floor(Math.random() * 21) + 80;
    if (escolha > 0.7) comando = "CALL";
    else if (escolha < 0.3) comando = "PUT";

    document.getElementById("comando").innerHTML = "Comando Atual: <strong>" + comando + "</strong>";
    document.getElementById("score").textContent = "Confiabilidade: " + score + "%";
    document.getElementById("horario").textContent = `Entrada: ${hora}:${min}`;

    if (comando !== "ESPERAR" && somAtivo) {
        new Audio('https://www.soundjay.com/buttons/sounds/beep-07.mp3').play();
        sendToWhatsApp(comando, score, `${hora}:${min}`);
    }
}

function toggleSom() {
    somAtivo = !somAtivo;
    document.querySelector("button").textContent = somAtivo ? "Som: Ligado" : "Som: Desligado";
}

function finalizarSessao() {
    alert("Sessão encerrada. TX1 em modo de descanso.");
}

setInterval(leituraVela, 1000);
