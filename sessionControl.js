
const agora = new Date();
const hora = agora.getUTCHours();
let sessao = "", horarioStatus = "", cor = "gray";

if (hora >= 0 && hora < 7) {
    sessao = "Sessão: Tóquio";
    horarioStatus = "Horário Regular";
    cor = "yellow";
} else if (hora >= 7 && hora < 14) {
    sessao = "Sessão: Londres";
    horarioStatus = "Horário Ideal";
    cor = "green";
} else if (hora >= 14 && hora < 21) {
    sessao = "Sessão: Nova York";
    horarioStatus = "Horário Intermediário";
    cor = "orange";
} else {
    sessao = "Sessão: Pós-Mercado";
    horarioStatus = "Horário de Risco";
    cor = "red";
}

document.getElementById("sessao").textContent = sessao;
document.getElementById("horarioStatus").innerHTML = `<span style='color:${cor}; font-weight:bold'>${horarioStatus}</span>`;
document.getElementById("saudacao").textContent = "Bom dia, Diego.";
