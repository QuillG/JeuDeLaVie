<template>
  <div class="container">
    <PatternPanel @selectPattern="onPatternSelected" />
    <GameGrid :selectedPattern="selectedPattern" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PatternPanel from './components/PatternPanel.vue'
import GameGrid from './components/GameGrid.vue'

const selectedPattern = ref(null)

function onPatternSelected(patternKey) {
  selectedPattern.value = patternKey
}
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  background: #111;
}
</style>
