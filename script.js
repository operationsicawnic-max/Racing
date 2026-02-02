const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const speedEl = document.getElementById("speed");
const scoreEl = document.getElementById("score");
const nitroEl = document.getElementById("nitro");

const engineSound = document.getElementById("engineSound");
const crashSound = document.getElementById("crashSound");

let keys = {};
let gameRunning = true;

let player = {
  x: 0,
  speed: 0,
  maxSpeed: 220,
  nitro: 100
};

let road = {
  curve: 0,
  curveSpeed: 0.0004
};

let score = 0;

document.addEventListener("keydown", e => {
  keys[e.key] = true;
  if (engineSound.paused) engineSound.play();
});

document.addEventListener("keyup", e => {
  keys[e.key] = false;
});

function toggleMode() {
  document.body.classList.toggle("night");
}

function drawRoad() {
  ctx.fillStyle = "#555";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 40; i++) {
    let perspective = i / 40;
    let roadWidth = 300 * perspective;
    let center = canvas.width / 2 + road.curve * (1 - perspective) * 500;

    ctx.fillStyle = i % 2 === 0 ? "#666" : "#555";
    ctx.fillRect(
      center - roadWidth / 2,
      i * 15,
      roadWidth,
      20
    );
  }
}

function drawCar() {
  ctx.fillStyle = "red";
  ctx.fillRect(
    canvas.width / 2 + player.x - 15,
    canvas.height - 80,
    30,
    60
  );
}

function updatePhysics() {
  // Steering
  if (keys["ArrowLeft"]) player.x -= 4;
  if (keys["ArrowRight"]) player.x += 4;

  // Acceleration
  if (keys["ArrowUp"]) player.speed += 1.5;
  else player.speed -= 1;

  // Nitro
  if (keys["Shift"] && player.nitro > 0) {
    player.speed += 4;
    player.nitro -= 1;
  } else if (player.nitro < 100) {
    player.nitro += 0.3;
  }

  player.speed = Math.max(0, Math.min(player.speed, player.maxSpeed));

  // Road curvature
  road.curve += road.curveSpeed * player.speed;
  road.curve = Math.sin(road.curve);

  // Engine sound pitch
  engineSound.playbackRate = 0.5 + player.speed / 300;

  score += Math.floor(player.speed / 10);
}

function drawHUD() {
  speedEl.innerText = Math.floor(player.speed);
  scoreEl.innerText = score;
  nitroEl.innerText = Math.floor(player.nitro);
}

function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawRoad();
  drawCar();
  updatePhysics();
  drawHUD();

  // Crash detection (off-road)
  if (Math.abs(player.x) > 140) {
    crashSound.play();
    gameRunning = false;
    alert("💥 CRASHED! Final Score: " + score);
    location.reload();
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
