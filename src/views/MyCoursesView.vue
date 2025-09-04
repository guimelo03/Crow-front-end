<template>
  <div class="page-container">
    <div class="header-actions">
      <router-link to="/dashboard" class="back-link">← Voltar para o Dashboard</router-link>
      <router-link to="/create-course" class="create-button">
        Criar Novo Curso
      </router-link>
    </div>
    <h1 class="page-title">Meus Cursos</h1>
    <p v-if="loading" class="status-message">Carregando seus cursos...</p>
    <div v-else-if="myCourses.length === 0" class="empty-message">
      <p>Você ainda não criou nenhum curso.</p>
    </div>
    <div v-else class="course-grid">
      <div v-for="course in myCourses" :key="course.id" class="course-card">
        <h2 class="course-title">{{ course.title }}</h2>
        <p class="course-description">{{ course.description }}</p>
        <p v-if="course.course_type" class="course-type">
          <span>Tipo:</span> {{ course.course_type }}
        </p>
        <a v-if="course.link" :href="course.link" target="_blank" class="course-link">
          Acessar Curso
        </a>
        <div class="actions">
          <router-link 
            :to="{ name: 'edit-course', params: { id: course.id } }" 
            class="action-button edit-button"
          >
            Editar Curso
          </router-link>
          
          <button @click="deleteCourse(course.id)" class="action-button delete-button">
            Excluir Curso
          </button>
        </div>
      </div>
    </div>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import type { UserCourse } from '@/types';

const myCourses = ref<UserCourse[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const router = useRouter();

const fetchMyCourses = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }
  try {
    const response = await axios.get('http://localhost:3000/api/v1/courses', {
      headers: { Authorization: `Bearer ${token}` },
    });
    myCourses.value = response.data.courses;
  } catch (err) {
    console.error('Erro ao carregar os cursos do usuário:', err);
    error.value = 'Falha ao carregar a lista de cursos.';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchMyCourses);

const deleteCourse = async (courseId: number) => {
  if (!confirm('Tem certeza de que deseja excluir este curso?')) {
    return;
  }
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }
  try {
    await axios.delete(`http://localhost:3000/api/v1/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert('Curso excluído com sucesso!');
    await fetchMyCourses(); 
  } catch (err) {
    console.error('Erro ao excluir curso:', err);
    error.value = 'Falha ao excluir o curso.';
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
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.back-link {
  color: #6A0DAD;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s;
}
.back-link:hover {
  color: #9370DB;
}
.create-button {
  padding: 0.75rem 1.5rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s;
}
.create-button:hover {
  background-color: #218838;
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
.status-message, .empty-message {
  text-align: center;
  color: #6c757d;
  font-size: 1.2rem;
}
body.dark-mode .status-message, body.dark-mode .empty-message {
  color: #a0aec0;
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
.actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: auto;
  flex-wrap: wrap;
}
.action-button {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  text-align: center;
  flex-grow: 1;
  text-decoration: none;
  color: white;
}
.edit-button {
  background-color: #f39c12;
}
.edit-button:hover {
  background-color: #f1c40f;
}
.delete-button {
  background-color: #dc3545;
}
.delete-button:hover {
  background-color: #c82333;
}
.error-message {
  color: #d9534f;
  text-align: center;
  margin-top: 1.5rem;
  font-size: 1rem;
}
</style>