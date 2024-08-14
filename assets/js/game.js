// Global variables
let levels = [];
let currentLevel = 0;
let isLevelComplete = false;
let gameScore = 0;
let levelScore = 0;
let particles = [];
let obstacles = [];
let player;

// Canvas dimensions
let canvasWidth, canvasHeight;

// Load levels from JSON file
fetch('/assets/json/levels.json')
  .then(response => response.json())
  .then(data => {
    levels = data.levels;
    initGame();
  })
  .catch(error => console.error('Error loading levels:', error));

function initGame() {
  // Initialize the game
  kontra.init();
  kontra.initKeys();

  // Get canvas dimensions
  const canvas = kontra.getCanvas();
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;

  // Create player
  player = kontra.Sprite({
    x: 50,
    y: 50,
    color: 'blue',
    width: 20,
    height: 20,
    dx: 0,
    dy: 0,
    speed: 3,

    update() {
      if (kontra.keyPressed('arrowleft')) this.dx = -this.speed;
      else if (kontra.keyPressed('arrowright')) this.dx = this.speed;
      else this.dx = 0;

      if (kontra.keyPressed('arrowup')) this.dy = -this.speed;
      else if (kontra.keyPressed('arrowdown')) this.dy = this.speed;
      else this.dy = 0;

      this.advance();

      // Collision with canvas borders and obstacles
      this.x = Math.max(0, Math.min(this.x, canvasWidth - this.width));
      this.y = Math.max(0, Math.min(this.y, canvasHeight - this.height));

      obstacles.forEach(obstacle => {
        if (kontra.collides(this, obstacle)) {
          // Simple collision response
          if (this.dx > 0) this.x = obstacle.x - this.width;
          if (this.dx < 0) this.x = obstacle.x + obstacle.width;
          if (this.dy > 0) this.y = obstacle.y - this.height;
          if (this.dy < 0) this.y = obstacle.y + obstacle.height;
        }
      });
    }
  });

  // Load the first level
  loadLevel(0);

  // Game loop
  const loop = kontra.GameLoop({
    update() {
      if (isLevelComplete) return;

      player.update();
      particles.forEach(particle => particle.update());
      checkLevelCompletion();
    },
    render() {
      const context = kontra.getContext();
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      obstacles.forEach(obstacle => obstacle.render());
      particles.forEach(particle => particle.render());
      player.render();

      if (isLevelComplete) {
        context.fillStyle = 'white';
        context.font = '24px Arial';
        context.fillText('Level Complete!', canvasWidth / 2 - 70, canvasHeight / 2);
      }
    }
  });

  loop.start();
}

function createParticle(x, y, targetState) {
  return kontra.Sprite({
    x: x,
    y: y,
    color: 'red',
    width: 20,
    height: 20,
    state: 'normal',
    targetState: targetState,
    lastToggleTime: 0,
    hasChanged: false,

    update() {
      const currentTime = Date.now();
      if (currentTime - this.lastToggleTime > 500 && kontra.collides(this, player)) {
        this.toggleState();
        this.lastToggleTime = currentTime;
        this.hasChanged = true;
      }
    },

    toggleState() {
      const previousState = this.state;
      this.state = this.state === 'normal' ? 'quantum' : 'normal';
      this.color = this.state === 'normal' ? 'red' : 'purple';

      if (this.state === this.targetState && previousState !== this.targetState) {
        levelScore++;
      } else if (previousState === this.targetState && this.state !== this.targetState) {
        levelScore = Math.max(0, levelScore - 1);
      }

      updateScoreDisplay();
    },

    render() {
      this.draw();
      const context = kontra.getContext();
      context.strokeStyle = this.targetState === 'quantum' ? 'purple' : 'red';
      context.lineWidth = 2;
      context.strokeRect(this.x, this.y, this.width, this.height);
    },

    isCorrect() {
      return this.state === this.targetState && this.hasChanged;
    }
  });
}

function createObstacle(x, y, width, height) {
  return kontra.Sprite({
    x: x,
    y: y,
    color: 'gray',
    width: width,
    height: height
  });
}

function loadLevel(levelIndex) {
  currentLevel = levelIndex;
  isLevelComplete = false;
  levelScore = 0;

  // Create obstacles
  obstacles = levels[levelIndex].obstacles.map(o => createObstacle(o.x, o.y, o.width, o.height));

  // Create particles
  particles = [];
  levels[levelIndex].particles.forEach(p => {
    const particle = createParticle(0, 0, p.targetState);
    if (findValidPosition(particle, [...obstacles, ...particles])) {
      particles.push(particle);
    }
  });

  // Reset player position
  player.x = 50;
  player.y = 50;

  updateScoreDisplay();
}

function checkLevelCompletion() {
  if (!isLevelComplete && particles.every(p => p.isCorrect())) {
    isLevelComplete = true;
    gameScore += levelScore;
    console.log(`Level complete! Score: ${levelScore}`);
    updateScoreDisplay();
    setTimeout(() => {
      if (currentLevel < levels.length - 1) {
        loadLevel(currentLevel + 1);
      } else {
        console.log(`Game complete! Total score: ${gameScore}`);
      }
    }, 1000);
  }
}

function updateScoreDisplay() {
  document.getElementById('level-info').textContent = `Level: ${currentLevel + 1}`;
  document.getElementById('score-info').textContent = `Score: ${gameScore}`;
  document.getElementById('level-score-info').textContent = `Level Score: ${levelScore}`;
}

function findValidPosition(particle, existingSprites) {
  const margin = 10; // Minimum distance from canvas edges
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    particle.x = margin + Math.random() * (canvasWidth - particle.width - 2 * margin);
    particle.y = margin + Math.random() * (canvasHeight - particle.height - 2 * margin);

    if (!existingSprites.some(sprite => kontra.collides(particle, sprite))) {
      return true; // Valid position found
    }

    attempts++;
  }

  console.warn("Could not find a valid position for particle after " + maxAttempts + " attempts");
  return false;
}
