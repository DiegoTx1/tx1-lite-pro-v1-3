
function sendToWhatsApp(command, confidence, time) {
  const msg = `TX1 SINAL: ${command} | Confiança: ${confidence}% | Entrada: ${time}`;
  console.log("[WhatsApp] " + msg);
}
