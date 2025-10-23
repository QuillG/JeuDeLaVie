import fs from "fs";
import { GameOfLife } from "./gameOfLife.js";

const path = process.argv[2];
if (!path) {
  console.log("Usage : node cli.js <grid.json>");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(path));
const game = new GameOfLife(data.grid);

console.log(`🎮 Simulation du Jeu de la Vie (${data.rows}x${data.cols})`);

let generation = 0;

const interval = setInterval(() => {
  process.stdout.write('\x1Bc') // clear console
  console.log(`Generation ${generation++}`);
  game.print();
  game.nextGeneration();

  if (generation > 500) clearInterval(interval); // stop après 100 tours
}, 300);
