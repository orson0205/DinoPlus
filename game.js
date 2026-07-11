(() => {
  "use strict";

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const distanceEl = document.getElementById("distance");
  const scoreEl = document.getElementById("score");
  const highScoreEl = document.getElementById("highScore");
  const startPanel = document.getElementById("startPanel");
  const messagePanel = document.getElementById("messagePanel");
  const messageTitle = document.getElementById("messageTitle");
  const messageText = document.getElementById("messageText");
  const startButton = document.getElementById("startButton");
  const restartButton = document.getElementById("restartButton");
  const jumpButton = document.getElementById("jumpButton");
  const duckButton = document.getElementById("duckButton");
  const pauseButton = document.getElementById("pauseButton");

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  const GROUND_Y = 340;

  let state = "ready";
  let lastTime = 0;
  let elapsed = 0;
  let distance = 0;
  let score = 0;
  let speed = 410;
  let spawnTimer = 0;
  let nextSpawn = 1.45;
  let groundOffset = 0;

  const obstacles = [];
  const clouds = [
    { x: 160, y: 75, size: 1.0 },
    { x: 510, y: 120, size: 0.75 },
    { x: 840, y: 68, size: 1.2 }
  ];

  const player = {
    x: 92,
    y: GROUND_Y - 68,
    width: 68,
    height: 68,
    normalHeight: 68,
    duckHeight: 42,
    velocityY: 0,
    grounded: true,
    ducking: false
  };

  let highScore = Number(localStorage.getItem("dinoPlussHighScore") || 0);
  highScoreEl.textContent = highScore;

  function resetGame() {
    state = "running";
    elapsed = 0;
    distance = 0;
    score = 0;
    speed = 410;
    spawnTimer = 0;
    nextSpawn = 1.25;
    groundOffset = 0;
    obstacles.length = 0;

    player.y = GROUND_Y - player.normalHeight;
    player.height = player.normalHeight;
    player.velocityY = 0;
    player.grounded = true;
    player.ducking = false;

    distanceEl.textContent = "0";
    scoreEl.textContent = "0";
    startPanel.classList.add("hidden");
    messagePanel.classList.add("hidden");
    pauseButton.textContent = "暫停";
    lastTime = performance.now();
  }

  function jump() {
    if (state === "ready" || state === "gameover") resetGame();
    if (state !== "running" || !player.grounded) return;
    player.velocityY = -770;
    player.grounded = false;
    setDuck(false);
  }

  function setDuck(isDucking) {
    if (state !== "running") return;
    player.ducking = isDucking && player.grounded;
    player.height = player.ducking ? player.duckHeight : player.normalHeight;
    if (player.grounded) player.y = GROUND_Y - player.height;
  }

  function togglePause() {
    if (state === "ready" || state === "gameover") return;

    if (state === "running") {
      state = "paused";
      messageTitle.textContent = "遊戲暫停";
      messageText.textContent = "按 Esc 或按下繼續回到遊戲。";
      restartButton.textContent = "繼續";
      messagePanel.classList.remove("hidden");
      pauseButton.textContent = "繼續";
    } else {
      state = "running";
      messagePanel.classList.add("hidden");
      pauseButton.textContent = "暫停";
      lastTime = performance.now();
    }
  }

  function spawnObstacle() {
    const tall = Math.random() > 0.45;
    const width = tall ? 42 : 58;
    const height = tall ? 78 : 48;
    obstacles.push({ x: WIDTH + 40, y: GROUND_Y - height, width, height });
    nextSpawn = 0.95 + Math.random() * 0.85;
  }

  function isColliding(a, b) {
    const padX = 10;
    const padTop = 8;
    return (
      a.x + padX < b.x + b.width &&
      a.x + a.width - padX > b.x &&
      a.y + padTop < b.y + b.height &&
      a.y + a.height > b.y + 5
    );
  }

  function endGame() {
    state = "gameover";
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("dinoPlussHighScore", String(highScore));
      highScoreEl.textContent = highScore;
    }
    messageTitle.textContent = "遊戲結束";
    messageText.textContent = `距離 ${distance} m，分數 ${score}。按 R 或按下按鈕重新開始。`;
    restartButton.textContent = "重新開始";
    messagePanel.classList.remove("hidden");
  }

  function update(dt) {
    if (state !== "running") return;

    elapsed += dt;
    speed = Math.min(760, 410 + elapsed * 7);
    groundOffset = (groundOffset + speed * dt) % 80;

    player.velocityY += 1950 * dt;
    player.y += player.velocityY * dt;

    if (player.y + player.height >= GROUND_Y) {
      player.y = GROUND_Y - player.height;
      player.velocityY = 0;
      player.grounded = true;
    }

    spawnTimer += dt;
    if (spawnTimer >= nextSpawn) {
      spawnTimer = 0;
      spawnObstacle();
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obstacle = obstacles[i];
      obstacle.x -= speed * dt;
      if (obstacle.x + obstacle.width < -20) {
        obstacles.splice(i, 1);
        continue;
      }
      if (isColliding(player, obstacle)) {
        endGame();
        return;
      }
    }

    distance = Math.floor(elapsed * 10);
    score = Math.floor(distance + elapsed * speed / 100);
    distanceEl.textContent = distance;
    scoreEl.textContent = score;
  }

  function drawCloud(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "rgba(255,255,255,.9)";
    ctx.beginPath();
    ctx.arc(0, 15, 25, 0, Math.PI * 2);
    ctx.arc(28, 0, 34, 0, Math.PI * 2);
    ctx.arc(66, 15, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    gradient.addColorStop(0, "#58bde9");
    gradient.addColorStop(0.72, "#dff5ff");
    gradient.addColorStop(0.73, "#f3d37a");
    gradient.addColorStop(1, "#b96a2d");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    clouds.forEach(cloud => drawCloud(cloud.x, cloud.y, cloud.size));

    ctx.fillStyle = "#d9823c";
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(0, 265);
    ctx.lineTo(110, 190);
    ctx.lineTo(230, 275);
    ctx.lineTo(370, 220);
    ctx.lineTo(520, 290);
    ctx.lineTo(700, 205);
    ctx.lineTo(860, 275);
    ctx.lineTo(WIDTH, 225);
    ctx.lineTo(WIDTH, GROUND_Y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#f2c968";
    ctx.fillRect(0, 285, WIDTH, GROUND_Y - 285);
    ctx.fillStyle = "#704021";
    ctx.fillRect(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y);

    ctx.strokeStyle = "rgba(255,255,255,.35)";
    ctx.lineWidth = 3;
    for (let x = -groundOffset; x < WIDTH; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, GROUND_Y + 18);
      ctx.lineTo(x + 38, GROUND_Y + 18);
      ctx.stroke();
    }
  }

  function drawDino() {
    const x = player.x;
    const y = player.y;
    const w = player.width;
    const h = player.height;

    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "#2f9e44";
    ctx.strokeStyle = "#101810";
    ctx.lineWidth = 5;

    if (player.ducking) {
      ctx.beginPath();
      ctx.roundRect(8, 7, w - 8, h - 8, 14);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#101810";
      ctx.fillRect(w - 20, 15, 6, 6);
      ctx.restore();
      return;
    }

    ctx.beginPath();
    ctx.roundRect(24, 2, 40, 32, 9);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(28, 25);
    ctx.lineTo(8, 40);
    ctx.lineTo(25, 48);
    ctx.lineTo(38, 38);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#101810";
    ctx.fillRect(50, 10, 6, 6);

    ctx.strokeStyle = "#101810";
    ctx.lineWidth = 7;
    const runPhase = Math.floor(elapsed * 10) % 2;
    ctx.beginPath();
    ctx.moveTo(34, 45);
    ctx.lineTo(runPhase ? 27 : 39, 65);
    ctx.moveTo(50, 45);
    ctx.lineTo(runPhase ? 57 : 47, 65);
    ctx.stroke();
    ctx.restore();
  }

  function drawCactus(obstacle) {
    ctx.save();
    ctx.translate(obstacle.x, obstacle.y);
    ctx.fillStyle = "#228b3b";
    ctx.strokeStyle = "#102c16";
    ctx.lineWidth = 5;
    const w = obstacle.width;
    const h = obstacle.height;
    ctx.beginPath();
    ctx.roundRect(w * 0.35, 0, w * 0.3, h, 8);
    ctx.roundRect(0, h * 0.35, w * 0.35, h * 0.24, 8);
    ctx.roundRect(w * 0.65, h * 0.25, w * 0.35, h * 0.22, 8);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function draw() {
    drawBackground();
    obstacles.forEach(drawCactus);
    drawDino();
    if (state === "ready") {
      ctx.fillStyle = "rgba(0,0,0,.7)";
      ctx.font = "700 24px Arial";
      ctx.textAlign = "center";
      ctx.fillText("按開始遊戲或空白鍵開始", WIDTH / 2, 45);
    }
  }

  function gameLoop(time) {
    const dt = Math.min((time - lastTime) / 1000 || 0, 0.032);
    lastTime = time;
    update(dt);
    draw();
    requestAnimationFrame(gameLoop);
  }

  function handleKeyDown(event) {
    const key = event.code;
    if (["Space", "ArrowUp", "ArrowDown"].includes(key)) event.preventDefault();
    if (key === "Space" || key === "ArrowUp") jump();
    if (key === "KeyC" || key === "ArrowDown") setDuck(true);
    if (key === "Escape") togglePause();
    if (key === "KeyR") resetGame();
  }

  function handleKeyUp(event) {
    if (event.code === "KeyC" || event.code === "ArrowDown") setDuck(false);
  }

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
  startButton.addEventListener("click", resetGame);
  restartButton.addEventListener("click", () => state === "paused" ? togglePause() : resetGame());
  jumpButton.addEventListener("click", jump);
  pauseButton.addEventListener("click", togglePause);
  duckButton.addEventListener("pointerdown", () => setDuck(true));
  duckButton.addEventListener("pointerup", () => setDuck(false));
  duckButton.addEventListener("pointercancel", () => setDuck(false));
  duckButton.addEventListener("pointerleave", () => setDuck(false));
  canvas.addEventListener("pointerdown", jump);

  draw();
  requestAnimationFrame(gameLoop);
})();
