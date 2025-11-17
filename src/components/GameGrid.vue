<script setup>
import { ref, onUnmounted, watch } from 'vue'
import { Play, Pause, RotateCcw } from 'lucide-vue-next'
import { GameOfLife } from '../core/gameOfLife'
import { patterns } from '../core/patterns'

const props = defineProps({
  selectedPattern: {
    type: String,
    default: null
  }
})

// 🟢 Paramètres de la grille
const gridSize = ref(50)
const cellSize = 15
const speed = ref(200)
let game = new GameOfLife(gridSize.value, gridSize.value)
const grid = ref(game.grid)

let interval = null
const isRunning = ref(false)

// 🟢 Gère une génération
function next() {
  game.nextGeneration()
  grid.value = [...game.grid]
}

// 🟢 Démarrer / Pause
function togglePlay() {
  if (isRunning.value) {
    clearInterval(interval)
    interval = null
    isRunning.value = false
  } else {
    startLoop()
  }
}

function startLoop() {
  clearInterval(interval)
  interval = setInterval(next, speed.value)
  isRunning.value = true
}

// 🟢 Réinitialiser
function reset() {
  clearInterval(interval)
  interval = null
  isRunning.value = false
  game.clear()
  grid.value = [...game.grid]
}

// 🟢 Cliquer sur une cellule
function toggleCell(row, col) {
  if (props.selectedPattern) {
    const pattern = patterns[props.selectedPattern]
    if (!pattern) return

    const shape = pattern.cells
    const shapeRows = shape.length
    const shapeCols = shape[0].length

    for (let i = 0; i < shapeRows; i++) {
      for (let j = 0; j < shapeCols; j++) {
        const x = row + i
        const y = col + j
        if (x < gridSize.value && y < gridSize.value) {
          game.grid[x][y] = shape[i][j]
        }
      }
    }
  } else {
    game.grid[row][col] = game.grid[row][col] ? 0 : 1
  }

  grid.value = [...game.grid]
}

// 🟢 Recrée la grille quand la taille change
watch(gridSize, (newSize, oldSize) => {
  newSize = Number(newSize)

  clearInterval(interval)
  isRunning.value = false

  const oldRows = game.rows
  const oldCols = game.cols

  game.rows = newSize
  game.cols = newSize

  const newGrid = Array.from({ length: newSize }, (_, r) =>
    Array.from({ length: newSize }, (_, c) =>
      (r < oldRows && c < oldCols) ? game.grid[r][c] : 0
    )
  )

  game.grid = newGrid
  grid.value = newGrid.map(row => [...row])
})


watch(speed, () => {
  if (isRunning.value) startLoop()
})

onUnmounted(() => clearInterval(interval))

function exportRLE() {
  const rows = game.grid.length
  const cols = game.grid[0].length

  let rle = ""

  for (let r = 0; r < rows; r++) {
    let count = 1
    for (let c = 0; c < cols; c++) {
      const current = game.grid[r][c]
      const next = c + 1 < cols ? game.grid[r][c + 1] : null

      if (current === next) {
        count++
      } else {
        if (count > 1) rle += count
        rle += current ? "o" : "b"
        count = 1
      }
    }
    if (r < rows - 1) rle += "$"
  }

  rle += "!"

  const header = `x = ${cols}, y = ${rows}, rule = B3/S23\n`
  const file = header + rle

  const blob = new Blob([file], { type: "text/plain" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = "grid.rle"
  a.click()

  URL.revokeObjectURL(url)
}

const fileInput = ref(null)

function loadRLEFile(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()

  reader.onload = () => {
    importRLE(reader.result)
  }

  reader.readAsText(file)
}


function importRLE(text) {
  const lines = text.split("\n").filter(l => !l.startsWith("#"))

  const header = lines.shift()
  const match = header.match(/x\s*=\s*(\d+),\s*y\s*=\s*(\d+)/)

  const cols = parseInt(match[1])
  const rows = parseInt(match[2])

  game = new GameOfLife(rows, cols)

  let r = 0, c = 0
  let data = lines.join("")

  let number = ""

  for (let char of data) {
    if (/[0-9]/.test(char)) {
      number += char
    } else {
      const n = number ? parseInt(number) : 1
      number = ""

      if (char === "o") {
        for (let i = 0; i < n; i++) game.grid[r][c++] = 1
      } else if (char === "b") {
        for (let i = 0; i < n; i++) game.grid[r][c++] = 0
      } else if (char === "$") {
        r++
        c = 0
      } else if (char === "!") {
        break
      }
    }
  }

  grid.value = [...game.grid]
  gridSize.value = rows
}


</script>

<template>
  <div class="game-container">
    <div class="controls">
      <div class="buttons">
        <button @click="togglePlay">
          <component :is="isRunning ? Pause : Play" />
        </button>
        <button @click="reset">
          <RotateCcw />
        </button>
        <button @click="exportRLE">
          Export RLE
        </button>
        <input type="file" accept=".rle" @change="loadRLEFile" style="display:none" ref="fileInput" />

        <button @click="fileInput.click()">
          Import RLE
        </button>
      </div>
      <div class="sliders">
        <div class="slider-group">
          <label>Grille</label>
          <input type="range" min="10" max="150" step="5" v-model="gridSize" />
          <span>{{ gridSize }}×{{ gridSize }}</span>
        </div>

        <div class="slider-group">
          <label>Vitesse</label>
          <input type="range" min="50" max="1000" step="50" v-model="speed" />
          <span>{{ speed }} ms</span>
        </div>
      </div>
    </div>

    <div class="grid" :style="{
      gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
      gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`
    }">

      <template v-for="(row, r) in grid" :key="r">
        <div v-for="(cell, c) in row" :key="`${r}-${c}`" :class="['cell', { alive: cell === 1 }]" @click="toggleCell(r, c)"></div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  flex: 1;
  background-color: #181818;
  padding: 20px;
  overflow: auto;
  border-left: 2px solid #333;
}

.grid {
  display: grid;
  grid-gap: 0.5px;
  border-radius: 8px;
  justify-content: flex-start;
  align-content: flex-start;
  width: fit-content;
  margin-top: 15px;
}

.cell {
  width: 15px;
  height: 15px;
  background: white;
  cursor: pointer;
}

.cell.alive {
  background: #111;
}

/* --- Contrôles --- */
.controls {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-top: 5px;
  color: white;
}

.controls button {
  background: #222;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 6px 10px;
  color: white;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.controls button:hover {
  background: #333;
  border-color: #666;
}

.sliders {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.slider-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.slider-group label {
  width: 60px;
}

input[type='range'] {
  flex: 1;
  accent-color: #00c853;
}

button svg {
  width: 24px;
  height: 24px;
}

.buttons {
  display: flex;
  gap: 10px;
}
</style>
