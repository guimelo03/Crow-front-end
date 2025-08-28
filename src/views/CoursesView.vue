<template>
  <div class="page-container">
    <router-link to="/dashboard" class="back-link">← Voltar para o Dashboard</router-link>
    <h1 class="page-title">Todos os Cursos</h1>
    <p v-if="loading" class="status-message">Carregando cursos...</p>
    <div v-else-if="courses.length === 0" class="empty-message">
      <p>Nenhum curso disponível no momento.</p>
    </div>
    <div v-else class="course-grid">
      <div v-for="course in courses" :key="course.id" class="course-card">
        <h2 class="course-title">{{ course.title }}</h2>
        <p class="course-description">{{ course.description }}</p>
        <p v-if="course.course_type" class="course-type">
          <span>Tipo:</span> {{ course.course_type }}
        </p>
        <div class="course-info">
          <div v-if="course.enrollments && course.enrollments.length > 0">
            <h3>Pessoas matriculadas:</h3>
            <ul class="enrollments-list">
              <li v-for="enrollment in course.enrollments" :key="enrollment.id">
                <span>{{ enrollment.student.name }}</span>
                <span>(Status: {{ statusText(enrollment.status) }})</span>
                <span class="created-at">Início: {{ formatDate(enrollment.created_at) }}</span>
              </li>
            </ul>
          </div>
          <div v-else>
            <p>Ninguém está fazendo este curso ainda.</p>
          </div>
        </div>
        <div class="actions">
          <button
            v-if="course.id && !isEnrolled(course.id)"
            @click="enroll(course.id)"
            class="action-button enroll-button"
          >
            Matricular-se
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
import { jwtDecode } from 'jwt-decode';

interface Student {
  id: number;
  name: string;
}

interface Enrollment {
  id: number;
  status: string;
  created_at: string;
  course_id: number;
  student: Student;
}

interface Course {
  id: number;
  title: string;
  description: string;
  link: string;
  course_type: string;
  enrollments: Enrollment[];
  user_id: number;
}

const courses = ref<Course[]>([]);
const enrolledCourses = ref<Enrollment[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const currentUserId = ref<number | null>(null);

const router = useRouter();

const fetchCoursesAndEnrollments = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }
  
  try {
    const decodedToken: any = jwtDecode(token);
    currentUserId.value = decodedToken.user_id;
  } catch (err) {
    console.error('Erro ao decodificar o token:', err);
    return;
  }

  try {
    const response = await axios.get('http://localhost:3000/api/v1/courses', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    courses.value = response.data.courses;
    
    if (Array.isArray(response.data.enrollments)) {
        enrolledCourses.value = response.data.enrollments;
    } else {
        enrolledCourses.value = [];
    }
  } catch (err) {
    console.error('Erro ao carregar dados:', err);
    error.value = 'Falha ao carregar a lista de cursos ou matrículas.';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCoursesAndEnrollments);

const isEnrolled = (courseId: number): boolean => {
  return enrolledCourses.value?.some((enrollment: any) => {
    return enrollment?.course?.id === courseId;
  }) || false;
};

const enroll = async (courseId: number) => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }
  try {
    await axios.post(
      'http://localhost:3000/api/v1/enrollments',
      { enrollment: { course_id: courseId } },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert('Matrícula realizada com sucesso!');
    await fetchCoursesAndEnrollments();
  } catch (err) {
    console.error('Erro ao matricular-se:', err);
    error.value = 'Falha ao realizar a matrícula.';
  }
};

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

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
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
.course-description {
  font-style: italic;
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
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
.course-info {
  margin-top: 1rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}
.course-info h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #555;
}
.enrollments-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.enrollments-list li {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #666;
}
.created-at {
  font-style: italic;
  font-size: 0.8rem;
  color: #888;
}
.actions {
  display: flex;
  justify-content: space-between;
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
.enroll-button {
  background-color: #6A0DAD;
}
.enroll-button:hover {
  background-color: #9370DB;
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