<template>
  <div class="form-container">
    <router-link to="/my-courses" class="back-link">← Voltar para Meus Cursos</router-link>
    <h1 class="form-title">{{ isEditing ? 'Editar Curso' : 'Criar Novo Curso' }}</h1>
    <form @submit.prevent="submitForm" class="course-form">
      <div class="form-group">
        <label for="title">Nome do Curso</label>
        <input type="text" id="title" v-model="course.title" required>
      </div>

      <div class="form-group">
        <label for="description">Descrição</label>
        <textarea id="description" v-model="course.description" required></textarea>
      </div>

      <div class="form-group">
        <label for="course_type">Tipo de Curso</label>
        <div class="select-wrapper"> <select id="course_type" v-model="course.course_type" required>
            <option disabled value="">Selecione um tipo</option>
            <option value="Alura">Alura</option>
            <option value="Udemy">Udemy</option>
            <option value="Outros">Outros</option>
            </select>
        </div>
      </div>

      <div class="form-group">
        <label for="link">Link do Curso</label>
        <input type="url" id="link" v-model="course.link" required>
      </div>
      
      <button type="submit" class="submit-button">{{ isEditing ? 'Salvar Alterações' : 'Criar Curso' }}</button>
      <div v-if="error" class="error-message">{{ error }}</div>
      <p v-if="success" class="success-message">{{ success }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import type { BaseCourse } from '@/types';

const course = ref<BaseCourse>({
  title: '',
  description: '',
  course_type: '',
  link: '',
});

const isEditing = computed(() => !!route.params.id);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

const route = useRoute();
const router = useRouter();

const fetchCourse = async (id: string) => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }
  try {
    const response = await axios.get(`http://localhost:3000/api/v1/courses/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    course.value = response.data;
  } catch (err) {
    console.error('Erro ao buscar o curso:', err);
    error.value = 'Falha ao carregar os dados do curso para edição.';
  }
};

onMounted(() => {
  if (isEditing.value) {
    fetchCourse(route.params.id as string);
  }
});

const submitForm = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }
  error.value = null;
  success.value = null;
  
  try {
    if (isEditing.value) {
      await axios.put(`http://localhost:3000/api/v1/courses/${course.value.id}`, { course: course.value }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      success.value = 'Curso atualizado com sucesso!';
    } else {
      await axios.post('http://localhost:3000/api/v1/courses', { course: course.value }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      success.value = 'Curso criado com sucesso!';
      course.value = { title: '', description: '', course_type: '', link: '' }; 
    }
  } catch (err) {
    console.error('Erro ao salvar o curso:', err);
    error.value = 'Falha ao salvar o curso. Verifique os dados.';
  }
};
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
body.dark-mode .form-container {
  background-color: #2d3748;
}
.back-link {
  color: #6A0DAD;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s;
  display: inline-block;
  margin-bottom: 1rem;
}
.back-link:hover {
  color: #9370DB;
}
.form-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2.2rem;
}
body.dark-mode .form-title {
  color: #a0aec0;
}
.course-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.form-group {
  display: flex;
  flex-direction: column;
}
label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #555;
}
body.dark-mode label {
  color: #e2e8f0;
}
input, textarea {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  background-color: #fcfcfc;
  color: #333;
}
input:focus, textarea:focus {
  border-color: #6A0DAD;
  box-shadow: 0 0 0 3px rgba(106, 13, 173, 0.1);
  outline: none;
}
body.dark-mode input, body.dark-mode textarea {
  background-color: #4a5568;
  border-color: #555;
  color: #e2e8f0;
}
textarea {
  resize: vertical;
  min-height: 100px;
}

/* Estilos para o botão */
.submit-button {
  width: 100%;
  padding: 1rem;
  background-image: linear-gradient(135deg, #28a745 0%, #218838 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.submit-button:hover {
  background-image: linear-gradient(135deg, #218838 0%, #1c7430 100%);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3);
  transform: translateY(-2px);
}

.submit-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(40, 167, 69, 0.1);
}

/* Estilos para o select */
.select-wrapper {
  position: relative;
}

.select-wrapper select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
  background-color: #fcfcfc;
  color: #333;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
}

.select-wrapper select:focus {
  border-color: #6A0DAD;
  box-shadow: 0 0 0 3px rgba(106, 13, 173, 0.15);
  outline: none;
}

.select-wrapper::after {
  content: '▼';
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #6A0DAD;
  font-size: 0.7rem;
  transition: color 0.2s ease-in-out;
}

body.dark-mode .select-wrapper select {
  background-color: #4a5568;
  border-color: #555;
  color: #e2e8f0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

body.dark-mode .select-wrapper select:focus {
  border-color: #9370DB;
  box-shadow: 0 0 0 3px rgba(147, 112, 219, 0.2);
}

body.dark-mode .select-wrapper::after {
  color: #9370DB;
}

.error-message {
  color: #d9534f;
  text-align: center;
  margin-top: 1rem;
  font-weight: bold;
}
.success-message {
  color: #28a745;
  text-align: center;
  margin-top: 1rem;
  font-weight: bold;
}
</style>
.form-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
body.dark-mode .form-container {
  background-color: #2d3748;
}
.back-link {
  color: #6A0DAD;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s;
  display: inline-block;
  margin-bottom: 1rem;
}
.back-link:hover {
  color: #9370DB;
}
.form-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2.2rem;
}
body.dark-mode .form-title {
  color: #a0aec0;
}
.course-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.form-group {
  display: flex;
  flex-direction: column;
}
label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #555;
}
body.dark-mode label {
  color: #e2e8f0;
}
input, textarea {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  background-color: #fcfcfc;
  color: #333;
}
input:focus, textarea:focus {
  border-color: #6A0DAD;
  box-shadow: 0 0 0 3px rgba(106, 13, 173, 0.1);
  outline: none;
}
body.dark-mode input, body.dark-mode textarea {
  background-color: #4a5568;
  border-color: #555;
  color: #e2e8f0;
}
textarea {
  resize: vertical;
  min-height: 100px;
}
.submit-button {
  width: 100%;
  padding: 1rem;
  background-image: linear-gradient(135deg, #28a745 0%, #218838 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.submit-button:hover {
  background-image: linear-gradient(135deg, #218838 0%, #1c7430 100%);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3);
  transform: translateY(-2px);
}

.submit-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(40, 167, 69, 0.1);
}
.error-message {
  color: #d9534f;
  text-align: center;
  margin-top: 1rem;
  font-weight: bold;
}
.success-message {
  color: #28a745;
  text-align: center;
  margin-top: 1rem;
  font-weight: bold;
}

.form-group select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #fcfcfc;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236A0DAD%22%20d%3D%22M287%20165.7c-4.4%205.1-10.4%207.7-16.4%207.7s-12-2.6-16.4-7.7L146.2%2042.3%2038.2%20165.7c-4.4%205.1-10.4%207.7-16.4%207.7S5.4%20170.8%201%20165.7c-4.4-5.1-6.6-11.7-6.6-18.4s2.2-13.3%206.6-18.4L140%201.2c4.4-5.1%2010.4-7.7%2016.4-7.7s12%202.6%2016.4%207.7L291%20129.4c4.4%205.1%206.6%2011.7%206.6%2018.4s-2.2%2013.3-6.6%2018.4z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: right 0.7rem top 50%;
  background-size: 0.65rem auto;
  padding-right: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease-in-out;
}

.form-group select:focus {
  border-color: #6A0DAD;
  box-shadow: 0 0 0 3px rgba(106, 13, 173, 0.1);
  outline: none;
}

body.dark-mode .form-group select {
  background-color: #4a5568;
  border-color: #555;
  color: #e2e8f0;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%202000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23A0AEc0%22%20d%3D%22M287%20165.7c-4.4%205.1-10.4%207.7-16.4%207.7s-12-2.6-16.4-7.7L146.2%2042.3%2038.2%20165.7c-4.4%205.1-10.4%207.7-16.4%207.7S5.4%20170.8%201%20165.7c-4.4-5.1-6.6-11.7-6.6-18.4s2.2-13.3%206.6-18.4L140%201.2c4.4-5.1%2010.4-7.7%2016.4-7.7s12%202.6%2016.4%207.7L291%20129.4c4.4%205.1%206.6%2011.7%206.6%2018.4s-2.2%2013.3-6.6%2018.4z%22%2F%3E%3C%2