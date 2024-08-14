// Initialize Kontra
kontra.init();

// Create game objects
const player = kontra.sprite({
  x: 100,
  y: 100,
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
  }
});

const particles = [];

function createParticle(x, y) {
  return kontra.sprite({
    x: x,
    y: y,
    color: 'red',
    width: 10,
    height: 10,
    state: 'normal', // or 'quantum'

    update() {
      if (this.collidesWith(player)) {
        this.state = this.state === 'normal' ? 'quantum' : 'normal';
        this.color = this.state === 'normal' ? 'red' : 'purple';
      }
    }
  });
}

// Create some initial particles
for (let i = 0; i < 5; i++) {
  particles.push(createParticle(Math.random() * kontra.canvas.width, Math.random() * kontra.canvas.height));
}

// Game loop
const loop = kontra.gameLoop({
  update() {
    player.update();

    particles.forEach(particle => particle.update());
  },
  render() {
    player.render();

    particles.forEach(particle => particle.render());
  }
});

loop.start();
