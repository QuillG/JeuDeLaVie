<script setup>
import { patterns } from '../core/patterns'
import { ref, onMounted } from 'vue'

const selected = ref(null)
const saved = ref([])

const emit = defineEmits(['selectPattern', 'selectSavedPattern'])

// Chargement des patterns sauvegardés
onMounted(() => {
  const raw = localStorage.getItem('savedPatterns')
  if (raw) {
    saved.value = JSON.parse(raw)
  }
})

// Sauvegarde dans localStorage
function persist() {
  localStorage.setItem('savedPatterns', JSON.stringify(saved.value))
}

// Sélection d’un pattern normal
function selectPattern(key) {
  if (selected.value === key) {
    selected.value = null
    emit('selectPattern', null)
    return
  }

  selected.value = key
  emit('selectPattern', key)
}

// Sélection d’une sauvegarde
function selectSaved(index) {
  const key = 'saved-' + index

  if (selected.value === key) {
    selected.value = null
    emit('selectSavedPattern', null)
    return
  }

  selected.value = key
  emit('selectSavedPattern', saved.value[index].cells)
}


// Fonction appelée par l’extérieur pour sauvegarder
function saveUserPattern(cells) {
  saved.value.push({
    name: "Sauvegarde " + (saved.value.length + 1),
    cells: cells
  })

  persist()
}

defineExpose({
  saveUserPattern
})
</script>

<template>
  <div class="panel">
    <h2>Patterns intégrés</h2>

    <div class="pattern-list">
      <div v-for="(pattern, key) in patterns" :key="key" class="pattern-item" :class="{ selected: selected === key }" @click="selectPattern(key)">
        <div class="mini-grid">
          <div v-for="(row, r) in pattern.cells" :key="r" class="mini-row">
            <div v-for="(cell, c) in row" :key="c" class="mini-cell" :class="{ alive: cell === 1 }"></div>
          </div>
        </div>
        <p>{{ pattern.name }}</p>
      </div>
    </div>

    <h2 style="margin-top: 20px;">Mes sauvegardes</h2>

    <div class="pattern-list">
      <div v-for="(item, index) in saved" :key="'saved_' + index" class="pattern-item" :class="{ selected: selected === 'saved-' + index }" @click="selectSaved(index)">
        <p>{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel {
  width: 300px;
  background: #1e1e1e;
  color: white;
  padding: 10px;
  display: flex;
  flex-direction: column;
  border-right: 2px solid #333;
}

h2 {
  font-size: 1rem;
  margin-bottom: 10px;
  text-align: center;
}

.pattern-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
}

.pattern-item {
  background: #2c2c2c;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  transition: 0.2s;
  text-align: center;
}

.pattern-item:hover {
  background: #333;
}

.pattern-item.selected {
  border: 2px solid #4ade80;
}

.mini-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 4px;
}

.mini-row {
  display: flex;
}

.mini-cell {
  width: 8px;
  height: 8px;
  background: #111;
  border: 1px solid #222;
}

.mini-cell.alive {
  background: #00ff80;
}
</style>
