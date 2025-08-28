<template>
  <div id="app">
    <button v-if="showSidebar" @click="toggleSidebar" :class="['sidebar-toggle-button', { open: isSidebarOpen }]">
      <svg v-if="!isSidebarOpen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
      </svg>
    </button>

    <aside v-if="showSidebar" class="sidebar-panel" :class="{ open: isSidebarOpen }">
      <div class="user-profile">
        <UserDisplay />
      </div>

      <router-link to="/settings" class="nav-item">Configurações</router-link>
      <button @click="logout" class="nav-item logout-button">Sair</button>
    </aside>

    <div :class="['content-wrapper', { 'shifted': isSidebarOpen && showSidebar }]">
      <header v-if="!shouldHideHeader" class="main-header">
        <div class="logo">
          <router-link to="/dashboard">
            {{ pageTitle }}
          </router-link>
        </div>
        <nav class="nav-links">
          <router-link to="/dashboard" class="nav-item">Dashboard</router-link>
          <router-link to="/courses" class="nav-item">Todos os Cursos</router-link>
          <router-link to="/my-courses" class="nav-item">Meus Cursos</router-link>
          <router-link to="/students" class="nav-item">Estudantes</router-link>
        </nav>
        <div class="user-info-container">
          <UserDisplay />
        </div>
      </header>

      <main class="page-content">
        <router-view />
      </main>
      <ThemeToggle />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ThemeToggle from './composables/ThemeToggle.vue';
import UserDisplay from './components/UserDisplay.vue';

const route = useRoute();
const router = useRouter();
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const showSidebar = computed(() => {
  return route.path !== '/login' && route.path !== '/signup';
});

const routeTitles: { [key: string]: string } = {
  '/dashboard': 'Painel Dashboard',
  '/courses': 'Todos os Cursos',
  '/my-courses': 'Meus Cursos',
  '/students': 'Estudantes',
  '/settings': 'Configurações'
};

const pageTitle = computed(() => {
  return routeTitles[route.path] || 'Página';
});

const shouldHideHeader = computed(() => {
  const currentPath = route.path;
  return currentPath === '/login' || currentPath === '/signup';
});

const logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: background-color 0.3s, color 0.3s;
  background-color: #f8f9fa;
  color: #333;
}

body.dark-mode {
  background-color: #1a202c;
  color: #a0aec0;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-wrapper {
  flex-grow: 1;
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
}

.content-wrapper.shifted {
  transform: translateX(250px);
}

.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

body.dark-mode .main-header {
  background-color: #2d3748;
}

.logo a {
  font-size: 1.5rem;
  font-weight: bold;
  color: #6A0DAD;
  text-decoration: none;
  padding-left: 48px;
  display: inline-block;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-item {
  color: #555;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease-in-out;
  border: none;
  background-color: transparent;
  cursor: pointer;
  padding: 0;
}

.nav-item:hover,
.nav-item.router-link-active {
  color: #9370DB;
}

.user-info-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-content {
  padding: 2rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.sidebar-panel {
  width: 250px;
  background-color: #f4f4f4;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  z-index: 999;
  overflow-y: auto;
}

.sidebar-panel.open {
  transform: translateX(0);
}

.sidebar-toggle-button {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  background-color: #6A0DAD;
  color: white;
  border: none;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s, left 0.3s ease-in-out;
}

.sidebar-toggle-button:hover {
  background-color: #9370DB;
}

.sidebar-toggle-button.open {
  left: 260px;
  transform: rotate(180deg);
}

.icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
  transition: transform 0.3s ease-in-out;
}

.sidebar-panel .logout-button {
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background-color: transparent;
  font-size: 1rem;
  color: #555;
  display: block;
}

.sidebar-panel .logout-button:hover {
  background-color: #e2e8f0;
  color: #9370DB;
}
</style>