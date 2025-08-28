<template>
  <div class="students-container">
    <router-link to="/dashboard" class="back-link">← Voltar para o Dashboard</router-link>
    <h1 class="page-title">Estudantes Registrados</h1>
    <div v-if="loading" class="status-message">Carregando alunos...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else class="cards-list">
      <div v-for="student in students" :key="student.id" class="card">
        <div class="card-content">
          <p class="student-email">{{ student.user.email }}</p>
          <p class="student-id">ID: {{ student.id }}</p>
        </div>
        <div class="card-actions">
          <button @click="editStudent(student.id)" class="edit-button">Editar</button>
          <button @click="deleteStudent(student.id)" class="delete-button">Excluir</button>
          <router-link :to="{ name: 'show-student', params: { id: student.id } }" class="view-button">Ver</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

interface User {
  id: number;
  email: string;
}

interface Student {
  id: number;
  name: string;
  user: User;
}

const students = ref<Student[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const router = useRouter();

const fetchStudents = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }
  try {
    const response = await axios.get('http://localhost:3000/api/v1/students', {
      headers: { Authorization: `Bearer ${token}` },
    });
    students.value = response.data.students || [];
  } catch (err) {
    console.error('Erro ao carregar alunos:', err);
    error.value = 'Falha ao carregar a lista de alunos.';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchStudents);

const editStudent = (studentId: number) => {
  router.push({ name: 'edit-student', params: { id: studentId.toString() } });
};

const deleteStudent = async (studentId: number) => {
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
    students.value = students.value.filter(student => student.id !== studentId);
    alert('Aluno excluído com sucesso!');
  } catch (err) {
    console.error('Erro ao excluir aluno:', err);
    alert('Falha ao excluir o aluno.');
  }
};
</script>

<style scoped>
.students-container {
  max-width: 900px;
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
  font-size: 2.5rem;
}
.status-message {
  color: #6c757d;
  font-size: 1.2rem;
}
.error-message {
  color: #d9534f;
  margin-top: 1.5rem;
  font-size: 1rem;
}
.cards-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
  justify-content: center;
}
.card {
  background: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}
.card-content {
  flex-grow: 1;
  width: 100%;
}
.student-email {
  color: #34495e;
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  word-break: break-all;
}
.student-id {
  color: #95a5a6;
  font-size: 0.9rem;
  margin: 0;
}
.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
.edit-button, .delete-button, .view-button {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  text-decoration: none;
  color: white;
  transition: background-color 0.2s;
  font-size: 0.9rem;
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
.view-button {
  background-color: #6a0dad;
}
.view-button:hover {
  background-color: #9370db;
}
</style>

<style>
body.dark-mode .students-container {
  background-color: #1a202c;
  color: #a0aec0;
}
body.dark-mode .page-title {
  color: #a0aec0;
}
body.dark-mode .status-message {
  color: #e2e8f0;
}
body.dark-mode .students-container .card {
  background-color: #2d3748;
  border: 1px solid #4a5568;
}
body.dark-mode .students-container .student-email {
  color: #e2e8f0;
}
body.dark-mode .students-container .student-id {
  color: #cbd5e0;
}
</style>