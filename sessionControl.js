
window.onload = () => {
  const hour = new Date().getHours();
  let session = "Neutra";
  let status = "Sessão em horário neutro";

  if (hour >= 4 && hour < 12) {
    session = "Londres – Alta Liquidez";
    status = "Horário ideal para operar";
  } else if (hour >= 12 && hour < 17) {
    session = "Nova York – Média liquidez";
    status = "Atenção moderada";
  } else {
    session = "Mercado Lento";
    status = "Evite operar";
  }

  document.getElementById("session").textContent = session;
  document.getElementById("sessionStatus").textContent = status;
}
