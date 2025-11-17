<script setup>
import { ref, onUnmounted, watch, computed } from 'vue'
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

// 🟢 Mode pas à pas (dev seulement)
const isDev = import.meta.env.DEV
const stepModeEnabled = ref(false)
const iterations = ref([]) // tableau d'états pré-calculés (chaque état = tableau 2D)
const iterationCountInput = ref(50)
const currentIterationIndex = ref(0)
const generating = ref(false)

// Grille affichée selon le mode
const displayGrid = computed(() => {
  if (stepModeEnabled.value) {
    return iterations.value[currentIterationIndex.value] || []
  }
  return grid.value
})

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
  // Reset du mode pas à pas
  iterations.value = []
  currentIterationIndex.value = 0
  stepModeEnabled.value = false
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
  // Invalide les itérations pré-calculées
  iterations.value = []
  currentIterationIndex.value = 0
  stepModeEnabled.value = false
})

// 🟢 Recalcule la vitesse si on modifie le slider
watch(speed, () => {
  if (isRunning.value) startLoop()
})

// 🟢 Invalider le mode pas à pas si on change de pattern sélectionné (avant placement)
watch(() => props.selectedPattern, () => {
  iterations.value = []
  currentIterationIndex.value = 0
  stepModeEnabled.value = false
})

// 🧹 Nettoyage
onUnmounted(() => clearInterval(interval))

// 🟢 Génération des itérations (mode pas à pas)
async function generateIterations() {
  const count = Number(iterationCountInput.value)
  if (!Number.isFinite(count) || count <= 0) return
  generating.value = true
  stepModeEnabled.value = false
  iterations.value = []
  currentIterationIndex.value = 0

  // Clone initial
  const cloneGrid = (src) => src.map(r => [...r])
  let tempGame = new GameOfLife(game.rows, game.cols)
  tempGame.grid = cloneGrid(game.grid)
  iterations.value.push(cloneGrid(tempGame.grid)) // état initial = itération 0

  for (let i = 0; i < count; i++) {
    tempGame.nextGeneration()
    iterations.value.push(cloneGrid(tempGame.grid))
  }

  stepModeEnabled.value = true
  generating.value = false
}

function nextIteration() {
  if (!stepModeEnabled.value) return
  if (currentIterationIndex.value < iterations.value.length - 1) {
    currentIterationIndex.value++
  }
}

function prevIteration() {
  if (!stepModeEnabled.value) return
  if (currentIterationIndex.value > 0) {
    currentIterationIndex.value--
  }
}

function jumpToIteration(e) {
  const val = Number(e.target.value)
  if (!stepModeEnabled.value) return
  if (Number.isFinite(val) && val >= 0 && val < iterations.value.length) {
    currentIterationIndex.value = val
  }
}

function exitStepMode() {
  stepModeEnabled.value = false
  iterations.value = []
  currentIterationIndex.value = 0
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

      <!-- 🟢 Mode pas à pas (affiché uniquement en dev) -->
      <div v-if="isDev" class="step-mode">
        <h3>Mode pas à pas (dev)</h3>
        <div class="step-config">
          <label>Itérations à générer</label>
          <input
            type="number"
            min="1"
            :max="5000"
            v-model="iterationCountInput"
            :disabled="generating"
          />
          <button @click="generateIterations" :disabled="generating">
            {{ generating ? 'Génération...' : 'Générer' }}
          </button>
          <button v-if="stepModeEnabled" @click="exitStepMode">Fermer</button>
        </div>

        <div v-if="stepModeEnabled" class="step-navigation">
          <div class="nav-buttons">
            <button @click="prevIteration" :disabled="currentIterationIndex === 0">&lt;</button>
            <button
              @click="nextIteration"
              :disabled="currentIterationIndex >= iterations.length - 1"
            >&gt;</button>
          </div>
          <div class="jump">
            <label>Aller à</label>
            <input
              type="number"
              :min="0"
              :max="iterations.length - 1"
              :value="currentIterationIndex"
              @change="jumpToIteration"
            />
          </div>
          <div class="info">
            Itération: {{ currentIterationIndex }} / {{ iterations.length - 1 }}
          </div>
        </div>
      </div>
    </div>

    <!-- 🟢 Grille -->
    <div
      class="grid"
      :style="{
        gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`
      }"
    >
      <template v-for="(row, r) in displayGrid" :key="r">
        <div
          v-for="(cell, c) in row"
          :key="`${r}-${c}`"
          :class="['cell', { alive: cell === 1 }]"
          @click="toggleCell(r, c)"
        ></div>
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

.step-mode {
  margin-top: 12px;
  background: #202020;
  padding: 10px;
  border: 1px solid #333;
  border-radius: 8px;
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.step-mode h3 {
  margin: 0;
  font-size: 0.9rem;
  color: #4ade80;
}

.step-config,
.step-navigation {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step-config label,
.jump label {
  font-size: 0.7rem;
  opacity: 0.8;
}

.step-config input[type='number'],
.jump input[type='number'] {
  background: #111;
  border: 1px solid #333;
  color: #fff;
  padding: 4px 6px;
  border-radius: 6px;
  width: 100%;
}

.step-config button,
.nav-buttons button,
.step-navigation button {
  background: #222;
  border: 1px solid #444;
  color: #fff;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
}

.step-config button:hover,
.nav-buttons button:hover,
.step-navigation button:hover {
  background: #333;
}

.nav-buttons {
  display: flex;
  gap: 6px;
}

.info {
  font-size: 0.7rem;
  opacity: 0.9;
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
