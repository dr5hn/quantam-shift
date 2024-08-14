// Initialize the game
kontra.init();
kontra.initKeys();

// Get canvas dimensions
const canvas = kontra.getCanvas();
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Game state
let currentLevel = 0;
let isLevelComplete = false;

// Create game objects
const player = kontra.Sprite({
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

    this.x = Math.max(0, Math.min(this.x, canvasWidth - this.width));
    this.y = Math.max(0, Math.min(this.y, canvasHeight - this.height));
  }
});

// Add game score
let gameScore = 0;
let levelScore = 0;

function createParticle(x, y, targetState) {
  return kontra.Sprite({
    x: x,
    y: y,
    color: 'red',  // Always start as red
    width: 20,
    height: 20,
    state: 'normal',  // Always start as normal
    targetState: targetState,
    lastToggleTime: 0,
    hasChanged: false,  // New property to track if particle has been changed

    update() {
      const currentTime = Date.now();
      if (currentTime - this.lastToggleTime > 500 && kontra.collides(this, player)) {
        this.toggleState();
        this.lastToggleTime = currentTime;
        this.hasChanged = true;  // Mark as changed when toggled
      }
    },

    toggleState() {
      this.state = this.state === 'normal' ? 'quantum' : 'normal';
      this.color = this.state === 'normal' ? 'red' : 'purple';
      levelScore++; // Increment score on each toggle
    },

    render() {
      this.draw();
      // Draw target state indicator
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

// Level definitions
// ... (previous code remains the same)

// Expanded level definitions
const levels = [
  { particles: [
    { x: 100, y: 100, targetState: 'quantum' },
    { x: 300, y: 300, targetState: 'normal' }
  ]},
  { particles: [
    { x: 100, y: 100, targetState: 'quantum' },
    { x: 200, y: 200, targetState: 'normal' },
    { x: 300, y: 300, targetState: 'quantum' }
  ]},
  { particles: [
    { x: 100, y: 100, targetState: 'quantum' },
    { x: 300, y: 100, targetState: 'normal' },
    { x: 100, y: 300, targetState: 'normal' },
    { x: 300, y: 300, targetState: 'quantum' }
  ]},
  { particles: [
    { x: 100, y: 100, targetState: 'quantum' },
    { x: 300, y: 100, targetState: 'normal' },
    { x: 200, y: 200, targetState: 'quantum' },
    { x: 100, y: 300, targetState: 'normal' },
    { x: 300, y: 300, targetState: 'quantum' }
  ]},
  { particles: [
    { x: 100, y: 100, targetState: 'quantum' },
    { x: 200, y: 100, targetState: 'normal' },
    { x: 300, y: 100, targetState: 'quantum' },
    { x: 100, y: 300, targetState: 'normal' },
    { x: 200, y: 300, targetState: 'quantum' },
    { x: 300, y: 300, targetState: 'normal' }
  ]}
];

let particles = [];

function loadLevel(levelIndex) {
  currentLevel = levelIndex;
  isLevelComplete = false;
  levelScore = 0; // Reset level score
  particles = levels[levelIndex].particles.map(p => createParticle(p.x, p.y, p.targetState));
  player.x = 50;
  player.y = 50;
}

function checkLevelCompletion() {
  if (!isLevelComplete && particles.every(p => p.isCorrect())) {
    isLevelComplete = true;
    gameScore += levelScore; // Add level score to game score
    console.log(`Level complete! Score: ${levelScore}`);
    setTimeout(() => {
      if (currentLevel < levels.length - 1) {
        loadLevel(currentLevel + 1);
      } else {
        console.log(`Game complete! Total score: ${gameScore}`);
      }
    }, 1000);
  }
}

// Load the first level
loadLevel(0);

// Game loopf
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

    particles.forEach(particle => particle.render());
    player.render();

    // Render game information
    context.fillStyle = 'white';
    context.font = '20px Arial';
    context.fillText(`Level: ${currentLevel + 1}`, 10, 30);
    context.fillText(`Score: ${gameScore}`, 10, 60);
    context.fillText(`Level Score: ${levelScore}`, 10, 90);

    // Debug information
    // context.fillText(`Particles: ${particles.length}`, 10, 60);
    // context.fillText(`Correct: ${particles.filter(p => p.isCorrect()).length}`, 10, 90);

    // Render level complete message
    if (isLevelComplete) {
      context.fillStyle = 'white';
      context.font = '24px Arial';
      context.fillText('Level Complete!', canvasWidth/2 - 70, canvasHeight/2);
    }
  }
});

loop.start();
