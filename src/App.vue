<template>
  <div class="container">
    <PatternPanel
      ref="patternPanelRef"
      @selectPattern="onPatternSelected"
      @selectSavedPattern="onSavedPatternSelected"
    />

    <GameGrid
      :selectedPattern="selectedPattern"
      :savedPattern="savedPattern"
      @save-current-grid="onSaveCurrentGrid"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PatternPanel from './components/PatternPanel.vue'
import GameGrid from './components/GameGrid.vue'

const selectedPattern = ref(null)
const savedPattern = ref(null)
const patternPanelRef = ref(null)


function onPatternSelected(patternKey) {
  savedPattern.value = null
  selectedPattern.value = patternKey
}

function onSavedPatternSelected(cells) {
  selectedPattern.value = null
  savedPattern.value = cells
}

function onSaveCurrentGrid(cells) {
  patternPanelRef.value.saveUserPattern(cells)
}
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  background: #111;
}
</style>
