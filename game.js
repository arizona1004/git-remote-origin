const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

const paddle = {
  width: 80,
  height: 10,
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  speed: 5,
  moveLeft: false,
  moveRight: false
};

const ball = {
  x: canvas.width / 2,
  y: 30,
  radius: 8,
  vx: 2,
  vy: 0,
  gravity: 0.15
};

let score = 0;

function update() {
  // Paddle movement
  if (paddle.moveLeft && paddle.x > 0) paddle.x -= paddle.speed;
  if (paddle.moveRight && paddle.x + paddle.width < canvas.width) paddle.x += paddle.speed;

  // Ball physics
  ball.vy += ball.gravity; // acceleration due to gravity
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Wall collisions
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.vx = -ball.vx;
  }
  if (ball.y - ball.radius < 0) {
    ball.vy = -ball.vy;
  }

  // Paddle collision
  if (ball.y + ball.radius >= paddle.y &&
      ball.x >= paddle.x &&
      ball.x <= paddle.x + paddle.width &&
      ball.vy > 0) {
    ball.vy = -Math.abs(ball.vy) * 1.05; // bounce and accelerate
    score += 1;
    scoreEl.textContent = `Score: ${score}`;
  }

  // Reset if ball falls below paddle
  if (ball.y - ball.radius > canvas.height) {
    ball.x = canvas.width / 2;
    ball.y = 30;
    ball.vx = 2;
    ball.vy = 0;
    score = 0;
    scoreEl.textContent = `Score: ${score}`;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddle
  ctx.fillStyle = '#333';
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  // Draw ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'blue';
  ctx.fill();
  ctx.closePath();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Controls
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') paddle.moveLeft = true;
  if (e.key === 'ArrowRight') paddle.moveRight = true;
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') paddle.moveLeft = false;
  if (e.key === 'ArrowRight') paddle.moveRight = false;
});

loop();
