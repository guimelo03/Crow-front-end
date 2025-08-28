<template>
  <div class="show-student-container">
    <router-link to="/students" class="back-link">← Voltar para a Lista de Alunos</router-link>
    <h1 class="page-title">Detalhes do Aluno</h1>

    <div v-if="loading" class="status-message">Carregando dados do aluno...</div>

    <div v-else-if="student" class="student-detail-card">
      <div class="card-header">
        <h2 class="student-name">{{ student.name }}</h2>
        <span class="student-id-display">ID: {{ student.id }}</span>
      </div>
      <div class="card-body">
        <div class="detail-item">
          <label class="detail-label">Email:</label>
          <p class="detail-value">{{ student.user.email }}</p>
        </div>
      </div>
      <div class="card-footer">
        <button @click="editStudent(student.id)" class="action-button edit-button">Editar</button>
        <button @click="confirmDelete(student.id)" class="action-button delete-button">Excluir</button>
      </div>
    </div>

    <div v-else class="error-message">{{ error }}</div>
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

const student = ref<Student | null>(null);
const route = useRoute();
const router = useRouter();
const loading = ref(true);
const error = ref<string | null>(null);

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
    
    // CORREÇÃO: Acessar a propriedade 'student' dentro dos dados da resposta
    student.value = response.data.student;

  } catch (err) {
    console.error('Erro ao buscar dados do aluno:', err);
    error.value = 'Falha ao carregar dados do aluno.';
  } finally {
    loading.value = false;
  }
};

const editStudent = (studentId: number) => {
  router.push({ name: 'edit-student', params: { id: studentId.toString() } });
};

const confirmDelete = async (studentId: number) => {
  if (!confirm('Tem certeza que deseja excluir este aluno?')) {
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }

  try {
    await axios.delete(`http://localhost:3000/api/v1/students/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert('Aluno excluído com sucesso!');
    router.push('/students');
  } catch (err) {
    console.error('Erro ao excluir aluno:', err);
    alert('Falha ao excluir o aluno.');
  }
};

onMounted(fetchStudent);
</script>

<style scoped>
/* ... (Seus estilos CSS existentes) ... */
.show-student-container {
  max-width: 700px;
  margin: 2rem auto;
  padding: 1.5rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
}
.back-link {
  display: inline-block;
  margin-bottom: 2rem;
  color: #6a0dad;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s;
}
.back-link:hover {
  color: #9370db;
}
.page-title {
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2.2rem;
  font-weight: 600;
}
.status-message {
  color: #6c757d;
  font-style: italic;
  margin-top: 1rem;
}
.error-message {
  color: #e74c3c;
  margin-top: 1rem;
}
.student-detail-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: left;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.card-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.student-name {
  color: #34495e;
  font-size: 1.8rem;
  margin: 0;
  flex-grow: 1;
}
.student-id-display {
  color: #95a5a6;
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
}
.card-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.detail-label {
  font-weight: bold;
  color: #555;
  font-size: 0.95rem;
}
.detail-value {
  font-size: 1.1rem;
  color: #333;
  margin: 0;
}
.card-footer {
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
}
.action-button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  text-decoration: none;
  color: white;
  transition: background-color 0.3s ease, transform 0.2s ease;
  font-size: 1rem;
}
.action-button:hover {
  transform: translateY(-2px);
}
.edit-button {
  background-color: #3498db;
}
.edit-button:hover {
  background-color: #2980b9;
}
.delete-button {
  background-color: #e74c3c;
}
.delete-button:hover {
  background-color: #c0392b;
}
</style>