export class GameOfLife {
  constructor(grid) {
    this.grid = grid;
    this.rows = grid.length;
    this.cols = grid[0].length;
  }

  getNextState(row, col) {
    const dirs = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    let neighbors = 0;

    for (const [dx, dy] of dirs) {
      const x = row + dx,
        y = col + dy;
      if (x >= 0 && x < this.rows && y >= 0 && y < this.cols) {
        neighbors += this.grid[x][y];
      }
    }

    const current = this.grid[row][col];
    if (current === 1 && (neighbors < 2 || neighbors > 3)) return 0;
    if (current === 0 && neighbors === 3) return 1;
    return current;
  }

  nextGeneration() {
    const newGrid = Array.from({ length: this.rows }, () =>
      Array(this.cols).fill(0)
    );

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        newGrid[i][j] = this.getNextState(i, j);
      }
    }

    this.grid = newGrid;
  }

  print() {
    console.clear();
    console.log(
      this.grid
        .map((row) => row.map((c) => (c ? "■" : "·")).join(" "))
        .join("\n")
    );
  }
}
