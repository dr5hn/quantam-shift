// Initialize Kontra
kontra.init();

// Game state
let currentLevel = 0;
let isLevelComplete = false;

// Create game objects
const player = kontra.sprite({
  x: 50,
  y: 50,
  color: 'blue',
  width: 20,
  height: 20,
  dx: 0,
  dy: 0,
  speed: 3,

  update() {
    if (kontra.keys.pressed('left')) this.dx = -this.speed;
    else if (kontra.keys.pressed('right')) this.dx = this.speed;
    else this.dx = 0;

    if (kontra.keys.pressed('up')) this.dy = -this.speed;
    else if (kontra.keys.pressed('down')) this.dy = this.speed;
    else this.dy = 0;

    this.advance();

    // Keep player within canvas bounds
    this.x = Math.max(0, Math.min(this.x, kontra.canvas.width - this.width));
    this.y = Math.max(0, Math.min(this.y, kontra.canvas.height - this.height));
  }
});

function createParticle(x, y, targetState) {
  return kontra.sprite({
    x: x,
    y: y,
    color: 'red',
    width: 10,
    height: 10,
    state: 'normal',
    targetState: targetState,

    update() {
      if (this.collidesWith(player)) {
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
const loop = kontra.gameLoop({
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
    player.render();
    particles.forEach(particle => particle.render());

    // Render level complete message
    if (isLevelComplete) {
      const ctx = kontra.context;
      ctx.fillStyle = 'white';
      ctx.font = '24px Arial';
      ctx.fillText('Level Complete!', kontra.canvas.width/2 - 70, kontra.canvas.height/2);
    }
  }
});

loop.start();
