// Initialize the game
kontra.init();

// Initialize keyboard
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

    // Keep player within canvas bounds
    this.x = Math.max(0, Math.min(this.x, canvasWidth - this.width));
    this.y = Math.max(0, Math.min(this.y, canvasHeight - this.height));
  }
});

function createParticle(x, y, targetState) {
  return kontra.Sprite({
    x: x,
    y: y,
    color: 'red',
    width: 10,
    height: 10,
    state: 'normal',
    targetState: targetState,

    update() {
      if (kontra.collides(this, player)) {
        this.state = this.state === 'normal' ? 'quantum' : 'normal';
        this.color = this.state === 'normal' ? 'red' : 'purple';
      }
    },

    isCorrect() {
      return this.state === this.targetState;
    }
  });
}

// Level definitions
const levels = [
  { particles: [
    { x: 100, y: 100, targetState: 'quantum' },
    { x: 200, y: 200, targetState: 'normal' },
    { x: 300, y: 150, targetState: 'quantum' }
  ]},
  // Add more levels here
];

let particles = [];

function loadLevel(levelIndex) {
  currentLevel = levelIndex;
  isLevelComplete = false;
  particles = levels[levelIndex].particles.map(p => createParticle(p.x, p.y, p.targetState));
  player.x = 50;
  player.y = 50;
}

// Load the first level
loadLevel(0);

// Game loop
const loop = kontra.GameLoop({
  update() {
    if (isLevelComplete) return;

    player.update();
    particles.forEach(particle => particle.update());

    // Check if level is complete
    if (particles.every(p => p.isCorrect())) {
      isLevelComplete = true;
      console.log('Level complete!');
      // Load next level after a short delay
      setTimeout(() => {
        if (currentLevel < levels.length - 1) {
          loadLevel(currentLevel + 1);
        } else {
          console.log('Game complete!');
        }
      }, 1000);
    }
  },
  render() {
    const context = kontra.getContext();
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    player.render();
    particles.forEach(particle => particle.render());

    // Render level complete message
    if (isLevelComplete) {
      context.fillStyle = 'white';
      context.font = '24px Arial';
      context.fillText('Level Complete!', canvasWidth/2 - 70, canvasHeight/2);
    }
  }
});

loop.start();
