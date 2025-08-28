<template>
  <div class="page-container">
    <router-link to="/dashboard" class="back-link">← Voltar para o Dashboard</router-link>
    <h1 class="page-title">Meus Cursos</h1>
    <p v-if="loading" class="status-message">Carregando suas matrículas...</p>
    <div v-else-if="enrollments.length === 0" class="empty-message">
      <p>Você ainda não está matriculado em nenhum curso.</p>
      <router-link to="/courses" class="courses-link">Ver cursos disponíveis</router-link>
    </div>
    <div v-else class="course-grid">
      <div v-for="enrollment in enrollments" :key="enrollment.id" class="course-card">
        <h2 class="course-title">{{ enrollment.course.title }}</h2>
        <p class="course-description">{{ enrollment.course.description }}</p>
        <p v-if="enrollment.course.course_type" class="course-type">
          <span>Tipo:</span> {{ enrollment.course.course_type }}
        </p>
        <a v-if="enrollment.course.link" :href="enrollment.course.link" target="_blank" class="course-link">
          Acessar Curso
        </a>
        <span class="course-status">Status: {{ statusText(enrollment.status) }}</span>
      </div>
    </div>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

interface Course {
  id: number;
  title: string;
  description: string;
  link: string;
  course_type: string;
}

interface Enrollment {
  id: number;
  status: string;
  course: Course; 
}

const enrollments = ref<Enrollment[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const router = useRouter();

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }

  try {
    const response = await axios.get('http://localhost:3000/api/v1/courses', {
      headers: { Authorization: `Bearer ${token}` },
    });
    enrollments.value = response.data;
  } catch (err) {
    console.error('Erro ao carregar matrículas:', err);
    error.value = 'Falha ao carregar suas matrículas.';
  } finally {
    loading.value = false;
  }
});

const statusText = (status: string) => {
  switch (status) {
    case 'to_do':
      return 'A iniciar';
    case 'in_progress':
      return 'Em andamento';
    case 'completed':
      return 'Finalizado';
    default:
      return status;
  }
};
</script>

<style scoped>
.page-container {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 1.5rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  border-radius: 12px;
}
body.dark-mode .page-container {
  background-color: #2d3748;
}
.back-link {
  display: inline-block;
  margin-bottom: 1.5rem;
  color: #6A0DAD;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s;
}
.back-link:hover {
  color: #9370DB;
}
.page-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2.5rem;
}
body.dark-mode .page-title {
  color: #a0aec0;
}
.status-message {
  text-align: center;
  color: #6c757d;
  font-size: 1.2rem;
}
.empty-message {
  text-align: center;
  color: #6c757d;
  font-size: 1.2rem;
}
body.dark-mode .empty-message {
  color: #a0aec0;
}
.courses-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #6A0DAD;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.3s;
}
.courses-link:hover {
  background-color: #9370DB;
}
.course-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}
.course-card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  width: 250px;
  transition: transform 0.2s, box-shadow 0.2s;
}
body.dark-mode .course-card {
  background-color: #4a5568;
  color: #e2e8f0;
}
.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}
.course-title {
  color: #34495e;
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 0.5rem;
}
body.dark-mode .course-title {
  color: #e2e8f0;
}
.course-description {
  font-style: italic;
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
}
body.dark-mode .course-description {
  color: #a0aec0;
}
.course-type {
  font-size: 0.9rem;
  color: #5e6c84;
  margin: 0 0 0.5rem;
  font-weight: bold;
}
.course-type span {
  font-weight: normal;
}
body.dark-mode .course-type {
  color: #c4c4c4;
}
body.dark-mode .course-type span {
  font-weight: bold;
}
.course-link {
  font-size: 1rem;
  color: #6A0DAD;
  text-decoration: none;
  transition: color 0.2s;
  margin-bottom: 0.5rem;
}
.course-link:hover {
  color: #9370DB;
  text-decoration: underline;
}
.course-status {
  font-style: italic;
  color: #95a5a6;
  font-size: 1rem;
  text-align: right;
  margin-top: auto;
}
body.dark-mode .course-status {
  color: #95a5a6;
}
.error-message {
  color: #d9534f;
  text-align: center;
  margin-top: 1.5rem;
  font-size: 1rem;
}
</style>