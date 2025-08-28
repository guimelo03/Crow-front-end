<template>
  <div class="page-container">
    <router-link to="/dashboard" class="back-link">← Voltar para o Dashboard</router-link>
    <h1 class="page-title">Criar Novo Curso</h1>
    <form @submit.prevent="createCourse" class="create-form">
      <input 
        v-model="title" 
        type="text" 
        placeholder="Título do curso" 
        required 
        class="form-input" 
      />
      <textarea
        v-model="description"
        placeholder="Descrição / Observações"
        class="form-input"
      ></textarea>
      <input 
        v-model="link" 
        type="url" 
        placeholder="Link do curso" 
        class="form-input" 
      />
      <select v-model="courseType" class="form-input">
        <option value="" disabled selected>Selecione o tipo</option>
        <option value="Alura">Alura</option>
        <option value="Udemy">Udemy</option>
        <option value="Outro">Outro</option>
      </select>

      <button type="submit" :disabled="loading" class="form-button">
        {{ loading ? 'Criando...' : 'Criar Curso' }}
      </button>
    </form>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const title = ref('');
const description = ref('');
const link = ref('');
const courseType = ref('');
const loading = ref(false);
const error = ref<string | null>(null);
const router = useRouter();

const createCourse = async () => {
  loading.value = true;
  error.value = null;

  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }

  try {
    await axios.post(
      'http://localhost:3000/api/v1/courses',
      { course: { 
        title: title.value, 
        description: description.value,
        link: link.value,
        course_type: courseType.value 
      } },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert('Curso criado com sucesso!');
    router.push('/courses');
  } catch (err) {
    console.error('Erro ao criar curso:', err);
    error.value = 'Falha ao criar o curso. Tente novamente.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.page-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  border-radius: 12px;
  text-align: center;
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
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 2rem;
}
body.dark-mode .page-title {
  color: #a0aec0;
}
.create-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.form-input {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}
body.dark-mode .form-input {
  background-color: #4a5568;
  color: white;
  border-color: #4a5568;
}
.form-button {
  padding: 1rem 2rem;
  background-color: #6A0DAD;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}
.form-button:hover:not(:disabled) {
  background-color: #9370DB;
}
.form-button:disabled {
  background-color: #a0c9ef;
  cursor: not-allowed;
}
.error-message {
  color: #d9534f;
  margin-top: 1.5rem;
  font-size: 1rem;
}
</style>