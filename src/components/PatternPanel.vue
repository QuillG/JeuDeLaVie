<script setup>
import { patterns } from '../core/patterns'
import { ref } from 'vue'

const selected = ref(null)
const emit = defineEmits(['selectPattern'])

function selectPattern(key) {
  selected.value = key
  emit('selectPattern', key)
}
</script>

<template>
  <div class="panel">
    <h2>🧬 Patterns</h2>

    <div class="pattern-list">
      <div
        v-for="(pattern, key) in patterns"
        :key="key"
        class="pattern-item"
        :class="{ selected: selected === key }"
        @click="selectPattern(key)"
      >
        <div class="mini-grid">
          <div
            v-for="(row, rowIndex) in pattern.cells"
            :key="rowIndex"
            class="mini-row"
          >
            <div
              v-for="(cell, colIndex) in row"
              :key="colIndex"
              class="mini-cell"
              :class="{ alive: cell === 1 }"
            ></div>
          </div>
        </div>
        <p>{{ pattern.name }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel {
  width: 220px;
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
  max-height: calc(100vh - 80px);
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
