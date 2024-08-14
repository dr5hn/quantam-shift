# Quantum Shift

Quantum Shift is a minimalist puzzle game created for the js13kGames competition. In this game, you control a quantum particle navigating through various levels, shifting the states of other particles to solve puzzles.

## How to Play

1. **Controls**:
   - Use the arrow keys to move your quantum particle (blue square) around the screen.

2. **Particles**:
   - Other squares on the screen are particles that can be in two states:
     * Red: Normal state
     * Purple: Quantum state

3. **Target States**:
   - Each particle has an colored outline indicating its target state:
     * Red outline: The particle should be red to complete the level
     * Purple outline: The particle should be purple to complete the level

4. **Changing Particle States**:
   - Move your blue square to touch other particles.
   - When touched, particles will toggle between red and purple states.

5. **Objective**:
   - Your goal is to make all particles match their outlined color.
   - For example, a particle with a purple outline should be purple to complete the level.

6. **Completing Levels**:
   - A level is complete when all particles match their target state (outlined color).
   - The game will display a "Level Complete!" message before moving to the next level.

7. **Winning the Game**:
   - Complete all levels to win the game.

## Development

This game was developed using Kontra.js, a lightweight JavaScript game engine. The entire game, including the engine, fits within the 13 kilobyte size limit of the js13kGames competition.

### Technical Details

- The game is built with HTML5, JavaScript, and the Kontra.js library.
- It uses the HTML5 Canvas for rendering.
- The game logic is implemented in pure JavaScript, with Kontra.js providing core functionality like the game loop, sprite management, and collision detection.

## Running the Game

To run the game locally:

1. Clone this repository or download the source files.
2. Ensure you have the following files in the same directory:
   - `index.html`
   - `game.js`
   - `kontra.min.js`
3. Open `index.html` in a modern web browser.

## Contributing

This game was created for a competition, but suggestions and improvements are welcome! Feel free to fork the repository and submit pull requests.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Thanks to Kontra.js for providing a compact and powerful game development library.
- Inspired by the fascinating world of quantum mechanics and puzzle games.

Enjoy playing Quantum Shift!
