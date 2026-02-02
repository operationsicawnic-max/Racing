const game = document.querySelector('.game');
const road = document.getElementById('road');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const startScreen = document.getElementById('startScreen');

let player = { speed: 5, score: 0 };
let keys = { ArrowLeft: false, ArrowRight: false };
let isPlaying = false;

let highScore = localStorage.getItem('highScore') || 0;
highScoreEl.innerText = highScore;

// Create road lines
for (let i = 0; i < 5; i++) {
  let line = document.createElement('div');
  line.classList.add('line');
  line.y = i * 100;
  line.style.top = line.y + 'px';
  road.appendChild(line);
}

// Create player car
let car = document.createElement('div');
car.classList.add('car');
car.style.left = '130px';
road.appendChild(car);

// Create enemy cars
let enemies = [];
for (let i = 0; i < 3; i++) {
  let enemy = document.createElement('div');
  enemy.classList.add('enemy');
  enemy.y = (i + 1) * -200;
  enemy.style.left = Math.floor(Math.random() * 220) + 'px';
  road.appendChild(enemy);
  enemies.push(enemy);
}

// Controls
document.addEventListener('keydown', e => {
  keys[e.key] = true;
  if (e.key === 'Enter' && !isPlaying) startGame();
});

document.addEventListener('keyup', e => {
  keys[e.key] = false;
});

function startGame() {
  isPlaying = true;
  player.score = 0;
  player.speed = 5;
  startScreen.style.display = 'none';
  requestAnimationFrame(playGame);
}

function isCollide(a, b) {
  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();
  return !(
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

function playGame() {
  if (!isPlaying) return;

  // Move road lines
  document.querySelectorAll('.line').forEach(line => {
    line.y += player.speed;
    if (line.y > 500) line.y -= 500;
    line.style.top = line.y + 'px';
  });

  // Move enemies
  enemies.forEach(enemy => {
    if (isCollide(car, enemy)) {
      endGame();
    }
    enemy.y += player.speed;
    if (enemy.y > 500) {
      enemy.y = -200;
      enemy.style.left = Math.floor(Math.random() * 220) + 'px';
    }
    enemy.style.top = enemy.y + 'px';
  });

  // Move player
  let carLeft = car.offsetLeft;
  if (keys.ArrowLeft && carLeft > 0) {
    car.style.left = carLeft - player.speed + 'px';
  }
  if (keys.ArrowRight && carLeft < 260) {
    car.style.left = carLeft + player.speed + 'px';
  }

  // Update score
  player.score++;
  scoreEl.innerText = player.score;

  if (player.score % 500 === 0) player.speed++;

  requestAnimationFrame(playGame);
}

function endGame() {
  isPlaying = false;
  startScreen.style.display = 'flex';
  startScreen.innerHTML = `
    <h1>💥 Game Over</h1>
    <p>Your Score: ${player.score}</p>
    <p>Press ENTER to restart</p>
  `;

  if (player.score > highScore) {
    highScore = player.score;
    localStorage.setItem('highScore', highScore);
    highScoreEl.innerText = highScore;
  }
}
