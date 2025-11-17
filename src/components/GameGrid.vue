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
watch(gridSize, (newSize) => {
  clearInterval(interval)
  isRunning.value = false
  game = new GameOfLife(newSize, newSize)
  grid.value = game.grid.map(row => [...row]) // ✅ clone proprement chaque ligne
})

// 🟢 Recalcule la vitesse si on modifie le slider
watch(speed, () => {
  if (isRunning.value) startLoop()
})

// 🧹 Nettoyage
onUnmounted(() => clearInterval(interval))


function saveGrid() {
  const data = {
    size: gridSize.value,
    grid: game.grid
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `grid_${gridSize.value}x${gridSize.value}.json`
  a.click()

  URL.revokeObjectURL(url)
}

</script>

<template>
  <div class="game-container">
    <div class="controls">
      <button @click="togglePlay">
        <component :is="isRunning ? Pause : Play" />
      </button>
      <button @click="reset">
        <RotateCcw />
      </button>
      <button @click="saveGrid">
        Sauvegarder
      </button>
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

    <!-- 🟢 Grille -->
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
</style>
