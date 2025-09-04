<template>
  <main class="dashboard-content">
    <h1 class="page-title">Crow Dashboard</h1>
    <p class="subtitle">Visão geral da plataforma.</p>
    
    <div v-if="loading" class="loading-message">Carregando estatísticas...</div>
    <div v-else class="stats-grid">
      <div class="stat-card">
        <h2 class="stat-number">{{ stats.total_students }}</h2>
        <p class="stat-label">Alunos Cadastrados</p>
      </div>
      <div class="stat-card">
        <h2 class="stat-number">{{ stats.total_courses }}</h2>
        <p class="stat-label">Cursos Cadastrados</p>
      </div>
      <div class="stat-card">
        <h2 class="stat-number">{{ stats.students_with_courses }}</h2>
        <p class="stat-label">Alunos com Matrículas</p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import type { Stats } from '@/types';

const stats = ref<Stats>({
  total_students: 0,
  total_courses: 0,
  students_with_courses: 0
});
const loading = ref(true);
const router = useRouter();

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }
  
  try {
    const statsResponse = await axios.get('http://localhost:3000/api/v1/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    });
    stats.value = statsResponse.data;

  } catch (err) {
    console.error('Erro ao carregar dados:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.dashboard-content {
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.page-title {
  font-size: 3rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}
.subtitle {
  color: #7f8c8d;
  font-size: 1.2rem;
  margin-bottom: 3rem;
}
.loading-message {
  color: #6c757d;
  font-size: 1.2rem;
  margin-bottom: 2rem;
}
.stats-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}
.stat-card {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  width: 250px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}
.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #6A0DAD;
  margin: 0;
}
.stat-label {
  font-size: 1rem;
  color: #7f8c8d;
  margin-top: 0.5rem;
}
</style>