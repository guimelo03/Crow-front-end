<template>
  <div class="edit-enrollment-container">
    <router-link to="/my-courses" class="back-link">← Voltar para Meus Cursos</router-link>
    <h1 class="page-title">Editar Status do Curso</h1>
    <div v-if="loading" class="status-message">Carregando detalhes da matrícula...</div>
    <div v-else-if="!enrollment" class="error-message">
      <p>{{ error }}</p>
    </div>
    <div v-else class="form-card">
      <h2 class="course-title">{{ enrollment.course?.title }}</h2>
      <p class="course-description">{{ enrollment.course?.description }}</p>
      
      <form @submit.prevent="updateStatus" class="status-form">
        <div class="form-group">
          <label for="status" class="form-label">Status atual: <strong>{{ statusText(currentStatus) }}</strong></label>
          <label for="new-status" class="form-label">Novo Status:</label>
          <select id="new-status" v-model="newStatus" class="status-select">
            <option value="to_do">A iniciar</option>
            <option value="in_progress">Em andamento</option>
            <option value="completed">Finalizado</option>
          </select>
        </div>
        
        <div class="actions">
          <button type="submit" class="action-button save-button" :disabled="isUpdating">
            {{ isUpdating ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
          <router-link to="/my-courses" class="action-button cancel-button">Cancelar</router-link>
        </div>
      </form>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

interface Enrollment {
  id: number;
  status: string;
  course: {
    title: string;
    description: string;
  };
}

const enrollment = ref<Enrollment | null>(null);
const currentStatus = ref('');
const newStatus = ref('to_do');
const loading = ref(true);
const isUpdating = ref(false);
const error = ref<string | null>(null);

const fetchEnrollment = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }

  const enrollmentId = route.params.id;
  if (!enrollmentId) {
    error.value = 'ID da matrícula não fornecido.';
    loading.value = false;
    return;
  }

  try {
    const response = await axios.get(`http://localhost:3000/api/v1/enrollments/${enrollmentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (response.data && response.data.enrollment) {
      enrollment.value = response.data.enrollment;
      currentStatus.value = response.data.enrollment.status;
      newStatus.value = response.data.enrollment.status;
    } else {
      error.value = 'Matrícula não encontrada ou você não tem permissão para acessá-la.';
    }

  } catch (err) {
    console.error('Erro ao buscar a matrícula:', err);
    error.value = 'Não foi possível carregar os dados da matrícula.';
  } finally {
    loading.value = false;
  }
};

const updateStatus = async () => {
  if (newStatus.value === currentStatus.value) {
    alert('O status selecionado é o mesmo que o atual.');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token || !enrollment.value) {
    router.push('/login');
    return;
  }
  
  isUpdating.value = true;
  try {
    await axios.patch(`http://localhost:3000/api/v1/enrollments/${enrollment.value.id}`, {
      enrollment: {
        status: newStatus.value,
      },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert('Status da matrícula atualizado com sucesso!');
    router.push('/my-courses');
  } catch (err) {
    console.error('Erro ao atualizar o status:', err);
    error.value = 'Falha ao atualizar o status da matrícula.';
  } finally {
    isUpdating.value = false;
  }
};

onMounted(fetchEnrollment);

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
.edit-enrollment-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
body.dark-mode .edit-enrollment-container {
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
  font-size: 2rem;
}
body.dark-mode .page-title {
  color: #a0aec0;
}
.status-message {
  text-align: center;
  color: #6c757d;
}
.error-message {
  color: #d9534f;
  text-align: center;
  margin-top: 1.5rem;
}
.form-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
body.dark-mode .form-card {
  background-color: #4a5568;
  color: #e2e8f0;
}
.course-title {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #34495e;
}
body.dark-mode .course-title {
  color: #e2e8f0;
}
.course-description {
  font-style: italic;
  color: #7f8c8d;
  margin-bottom: 1.5rem;
}
body.dark-mode .course-description {
  color: #a0aec0;
}
.status-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #555;
}
body.dark-mode .form-label {
  color: #ccc;
}
.status-select {
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}
body.dark-mode .status-select {
  background-color: #5a657a;
  color: white;
  border-color: #6a7a8d;
}
.actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
.action-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  text-decoration: none;
  text-align: center;
}
.save-button {
  background-color: #6A0DAD;
  color: white;
}
.save-button:hover:not(:disabled) {
  background-color: #9370DB;
}
.save-button:disabled {
  background-color: #b1a1c9;
  cursor: not-allowed;
}
.cancel-button {
  background-color: #6c757d;
  color: white;
}
.cancel-button:hover {
  background-color: #5a6268;
}
</style>