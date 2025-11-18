export class GameOfLife {
  constructor(rows, cols) {
    this.rows = rows
    this.cols = cols
    this.grid = Array.from({ length: rows }, () => Array(cols).fill(0))
  }

  nextGeneration() {
    const next = Array.from({ length: this.rows }, () => Array(this.cols).fill(0))
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const neighbors = this.countNeighbors(r, c)
        const alive = this.grid[r][c]
        if (alive && (neighbors === 2 || neighbors === 3)) next[r][c] = 1
        else if (!alive && neighbors === 3) next[r][c] = 1
      }
    }
    this.grid = next
  }

  countNeighbors(row, col) {
    let count = 0
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue
        const x = row + i
        const y = col + j
        if (x >= 0 && x < this.rows && y >= 0 && y < this.cols) {
          count += this.grid[x][y]
        }
      }
    }
    return count
  }

  clear() {
    this.grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(0))
  }
}
