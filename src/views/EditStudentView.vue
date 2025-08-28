<template>
  <div class="edit-student-container">
    <h1 class="page-title">Editar Aluno</h1>
    
    <div v-if="loading" class="status-message">Carregando dados do aluno...</div>
    
    <form v-else class="edit-form" @submit.prevent="updateStudent">
      <div class="form-group">
        <label for="name">Nome do Aluno:</label>
        <input type="text" id="name" v-model="student.name" required class="form-input">
      </div>
      <div class="form-group">
        <label for="email">Email do Aluno:</label>
        <input type="email" id="email" v-model="student.user.email" required class="form-input">
      </div>
      
      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
      
      <button type="submit" class="submit-button">Salvar Alterações</button>
      <router-link to="/students" class="back-link">← Voltar para Alunos</router-link>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

interface User {
  id: number;
  email: string;
}

interface Student {
  id: number;
  name: string;
  user: User;
}

const student = ref<Student>({
  id: 0,
  name: '',
  user: {
    id: 0,
    email: ''
  }
});

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const fetchStudent = async () => {
  const studentId = route.params.id;
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }
  
  try {
    const response = await axios.get(`http://localhost:3000/api/v1/students/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const apiData = response.data.student;
    
    if (apiData && apiData.user) {
      student.value.user.email = apiData.user.email;
      student.value.user.id = apiData.user.id;
    }
    
    student.value.id = apiData.id;
    student.value.name = apiData.name;
  } catch (err) {
    console.error('Erro ao buscar dados do aluno:', err);
    error.value = 'Falha ao carregar dados do aluno.';
  } finally {
    loading.value = false;
  }
};

const updateStudent = async () => {
  const token = localStorage.getItem('token');
  if (!token || !student.value.id) {
    error.value = 'ID do aluno não encontrado para atualização.';
    return;
  }
  try {
    const response = await axios.put(`http://localhost:3000/api/v1/students/${student.value.id}`, {
      student: {
        name: student.value.name,
        user_attributes: {
          id: student.value.user.id,
          email: student.value.user.email
        }
      }
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    successMessage.value = 'Aluno atualizado com sucesso!';
    setTimeout(() => {
      router.push('/students');
    }, 2000);
  } catch (err) {
    console.error('Erro ao atualizar aluno:', err);
    error.value = 'Falha ao atualizar o aluno.';
    successMessage.value = null;
  }
};

onMounted(fetchStudent);
</script>

<style scoped>
.edit-student-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
}
body.dark-mode .edit-student-container {
  background-color: #2d3748;
}

.page-title {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}
body.dark-mode .page-title {
  color: #a0aec0;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  text-align: left;
}
label {
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
  display: block;
}
body.dark-mode label {
  color: #e2e8f0;
}
.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}

.submit-button {
  padding: 1rem 2rem;
  background-color: #6A0DAD;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}
.submit-button:hover {
  background-color: #9370DB;
}

.back-link {
  display: inline-block;
  margin-top: 1rem;
  color: #6A0DAD;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s;
}
.back-link:hover {
  color: #9370DB;
}

.status-message {
  color: #6c757d;
  font-style: italic;
  margin-top: 1rem;
}
body.dark-mode .status-message {
  color: #cbd5e0;
}
.error-message {
  color: #e74c3c;
  margin-top: 1rem;
}
.success-message {
  color: #2ecc71;
  margin-top: 1rem;
}
</style>