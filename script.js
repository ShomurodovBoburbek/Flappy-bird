 const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const scoreDisplay = document.getElementById('score');
  const gameOverDisplay = document.getElementById('gameOver');
  const restartBtn = document.getElementById('restartBtn');

  let bird = {
    x: 50,
    y: canvas.height / 2,
    radius: 20,
    velocity: 0,
    gravity: 0.3,
    lift: -8
  };

  let pipes = [];
  let pipeWidth = 50;
  let pipeGap = 150;
  let pipeSpeed = 2;
  let frameCount = 0;
  let score = 0;
  let gameOver = false;

  function createPipe() {
    let topPipeHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
    pipes.push({
      x: canvas.width,
      top: topPipeHeight,
      bottom: canvas.height - topPipeHeight - pipeGap,
      passed: false
    });
  }

  function drawBird() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawPipes() {
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
      ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
      ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });
  }

  function checkCollision(pipe) {

    let birdLeft = bird.x - bird.radius;
    let birdRight = bird.x + bird.radius;
    let birdTop = bird.y - bird.radius;
    let birdBottom = bird.y + bird.radius;

    
    let pipeLeft = pipe.x;
    let pipeRight = pipe.x + pipeWidth;
    let pipeTopBottom = pipe.top;
    let pipeBottomTop = canvas.height - pipe.bottom;

    
    if (
      birdRight > pipeLeft &&
      birdLeft < pipeRight &&
      birdTop < pipeTopBottom
    ) {
      return true;
    }

    
    if (
      birdRight > pipeLeft &&
      birdLeft < pipeRight &&
      birdBottom > pipeBottomTop
    ) {
      return true;
    }

    return false;
  }

  function update() {
    if (gameOver) return;

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.radius > canvas.height) {
      bird.y = canvas.height - bird.radius;
      gameOver = true;
      showGameOver();
    }

    if (bird.y - bird.radius < 0) {
      bird.y = bird.radius;
      bird.velocity = 0;
    }

    pipes.forEach(pipe => {
      pipe.x -= pipeSpeed;

      if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
        score++;
        scoreDisplay.textContent = `Ball: ${score}`;
        pipe.passed = true;
      }

      if (checkCollision(pipe)) {
        gameOver = true;
        showGameOver();
      }
    });

    if (pipes.length && pipes[0].x + pipeWidth < 0) {
      pipes.shift();
    }

    frameCount++;
    if (frameCount % 90 === 0) {
      createPipe();
    }
  }

  function showGameOver() {
    gameOverDisplay.style.display = 'block';
    restartBtn.style.display = 'inline-block';
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
  }

  function gameLoop() {
    update();
    draw();
    if (!gameOver) {
      requestAnimationFrame(gameLoop);
    }
  }

  window.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && !gameOver) {
      bird.velocity = bird.lift;
    }
  });

  restartBtn.addEventListener('click', () => {
    resetGame();
  });

  function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    frameCount = 0;
    gameOver = false;
    scoreDisplay.textContent = `Ball: ${score}`;
    gameOverDisplay.style.display = 'none';
    restartBtn.style.display = 'none';
    createPipe();
    gameLoop();
  }


  createPipe();
  gameLoop();
