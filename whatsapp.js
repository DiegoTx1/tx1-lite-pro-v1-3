
function sendToWhatsApp(comando, score, horario) {
    fetch("https://hook.us1.make.com/seu-webhook-aqui", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ texto: `TX1: ${horario} | ${comando} | Score: ${score}%` })
    });
}
