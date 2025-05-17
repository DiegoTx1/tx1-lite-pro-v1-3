
let reading = true;
let soundOn = true;
let win = 0;
let loss = 0;
let seconds = 0;

function updateCandle() {
  if (reading) {
    seconds++;
    if (seconds > 60) seconds = 1;
    document.getElementById("candleTime").textContent = seconds + "s / 60s";
    if (seconds === 58) updateCommand();
  }
}
setInterval(updateCandle, 1000);

function updateCommand() {
  const commands = ["CALL", "PUT", "ESPERAR"];
  const command = commands[Math.floor(Math.random() * commands.length)];
  const confidence = Math.floor(Math.random() * 41) + 60;
  const now = new Date();
  const time = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
  document.getElementById("command").textContent = command;
  document.getElementById("confidence").textContent = confidence + "%";
  document.getElementById("entryTime").textContent = time;
  if (soundOn && (command === "CALL" || command === "PUT")) {
    new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg").play();
  }

  sendToWhatsApp(command, confidence, time);
}

function registerWin() {
  win++;
  updateHistory();
}
function registerLoss() {
  loss++;
  updateHistory();
}
function updateHistory() {
  document.getElementById("history").textContent = `${win} WIN / ${loss} LOSS`;
}
function toggleSound() {
  soundOn = !soundOn;
  document.getElementById("soundStatus").textContent = soundOn ? "Ligado" : "Desligado";
}
function toggleSession() {
  reading = !reading;
  document.getElementById("sessionButton").textContent = reading ? "Finalizar Sessão" : "Iniciar Sessão";
  document.getElementById("sessionStatus").textContent = reading ? "Sessão ativa" : "Sessão pausada";
}


function checkNewsBlock() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10); // formato yyyy-mm-dd
  const hour = now.getHours();

  fetch('news.json')
    .then(response => response.json())
    .then(data => {
      const bloqueios = data.high_impact_news;
      const noticia = bloqueios.find(n => n.day === today && parseInt(n.hour) === hour);
      if (noticia) {
        document.getElementById("command").textContent = "BLOQUEADO";
        document.getElementById("confidence").textContent = "Notícia de alto impacto";
        document.getElementById("entryTime").textContent = "--:--";
        if (soundOn) {
          new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg").play();
        }
        return true;
      }
    });
}

// chamar junto ao updateCommand()
const originalUpdateCommand = updateCommand;
updateCommand = function() {
  checkNewsBlock(); // verifica antes de emitir sinal
  originalUpdateCommand();
};
