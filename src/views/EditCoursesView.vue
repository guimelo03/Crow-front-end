<template>
  <div class="page-container">
    <router-link to="/courses" class="back-link">← Voltar para a lista de cursos</router-link>
    <h1 class="page-title">Editar Curso</h1>

    <form @submit.prevent="updateCourse" class="course-form">
      <div class="form-group">
        <label for="title">Título do Curso:</label>
        <input type="text" id="title" v-model="course.title" required />
      </div>

      <div class="form-group">
        <label for="description">Descrição:</label>
        <textarea id="description" v-model="course.description" required></textarea>
      </div>

      <div class="form-group">
        <label for="link">Link do Curso:</label>
        <input type="url" id="link" v-model="course.link" required />
      </div>

      <div class="form-group">
        <label for="course_type">Tipo de Curso:</label>
        <select id="course_type" v-model="course.course_type" required>
          <option disabled value="">Selecione um tipo</option>
          <option value="alura">Alura</option>
          <option value="udemy">Udemy</option>
          <option value="other">Outros</option>
        </select>
      </div>

      <button type="submit" class="submit-button">Salvar Alterações</button>
      <div v-if="error" class="error-message">{{ error }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import type { BaseCourse } from '@/types';

const course = ref<BaseCourse>({
  title: '',
  description: '',
  link: '',
  course_type: '',
});

const error = ref<string | null>(null);
const router = useRouter();
const route = useRoute();

const courseId = route.params.id;

console.log('ID do curso na rota:', courseId);

onMounted(async () => {
  if (!courseId) {
    console.error('ID do curso está faltando na URL.');
    error.value = 'ID do curso está faltando na URL.';
    return;
  }
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }
  try {
    const response = await axios.get(`http://localhost:3000/api/v1/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    course.value = response.data;
  } catch (err) {
    console.error('Erro ao carregar curso:', err);
    error.value = 'Falha ao carregar os dados do curso.';
  }
});

const updateCourse = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }
  if (!courseId) {
    error.value = 'ID do curso está faltando para atualizar.';
    return;
  }
  try {
    await axios.patch(
      `http://localhost:3000/api/v1/courses/${courseId}`,
      { course: course.value },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert('Curso atualizado com sucesso!');
    router.push('/courses');
  } catch (err) {
    console.error('Erro ao atualizar curso:', err);
    error.value = 'Falha ao atualizar o curso. Verifique se todos os campos estão preenchidos.';
  }
};
</script>

<style scoped>
.page-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
.course-form .form-group {
  margin-bottom: 1.5rem;
}
.course-form label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #34495e;
}
body.dark-mode .course-form label {
  color: #e2e8f0;
}
.course-form input[type="text"],
.course-form input[type="url"],
.course-form textarea,
.course-form select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}
.course-form textarea {
  resize: vertical;
  min-height: 120px;
}
.submit-button {
  width: 100%;
  padding: 1rem;
  background-color: #6A0DAD;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s;
}
.submit-button:hover {
  background-color: #9370DB;
}
.error-message {
  color: #d9534f;
  text-align: center;
  margin-top: 1.5rem;
  font-size: 1rem;
}
</style>