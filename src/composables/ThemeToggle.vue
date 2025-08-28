<template>
  <button @click="toggleTheme" class="theme-toggle">
    <span v-if="theme === 'light'">🌙 Modo Escuro</span>
    <span v-else>☀️ Modo Claro</span>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '../composables/useTheme';

const { theme, toggleTheme } = useTheme();
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 0.5rem 1rem;
  background-color: #f0f2f5;
  color: #333;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: background-color 0.3s, color 0.3s;
}

body.dark-mode .theme-toggle {
  background-color: #2c3e50;
  color: white;
  box-shadow: 0 2px 4px rgba(255, 255, 255, 0.1);
}
</style>