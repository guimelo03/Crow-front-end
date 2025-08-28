import { createRouter, createWebHistory, type RouteRecordRaw, type Router } from 'vue-router';
import LoginForm from '@/components/LoginForm.vue';
import DashboardView from '@/views/DashboardView.vue';
import CoursesView from '@/views/CoursesView.vue';
import StudentsView from '../views/StudentsView.vue';
import KanbanView from '../views/KanbanView.vue';
import SignupView from '@/views/SignupView.vue';
import CreateCourseView from '@/views/CreateCourseView.vue';
import EditCoursesView from '@/views/EditCoursesView.vue';
import CreateCourseByStudentView from '@/views/CreateCourseByStudentView.vue';
import MyCoursesView from '@/views/MyCoursesView.vue';
import EditEnrollmentView from '@/views/EditEnrollmentView.vue';
import EditStudentView from '@/views/EditStudentView.vue';
import ShowStudentView from '@/views/ShowStudentView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: LoginForm,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/courses',
    name: 'courses',
    component: CoursesView,
    meta: { requiresAuth: true },
  },
  {
    path: '/students',
    name: 'students',
    component: StudentsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/kanban',
    name: 'kanban',
    component: KanbanView,
    meta: { requiresAuth: true },
  },
  {
    path: '/my-courses',
    name: 'student-enrollments',
    component: MyCoursesView,
    meta: { requiresAuth: true },
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView
  },
  {
    path: '/create-course',
    name: 'create-course',
    component: CreateCourseView,
    meta: { requiresAuth: true },
  },
  {
    path: '/edit-course/:id',
    name: 'edit-course',
    component: EditCoursesView,
    meta: { requiresAuth: true },
  },
  {
    path: '/create-and-enroll',
    name: 'create-and-enroll',
    component: CreateCourseByStudentView,
    meta: { requiresAuth: true }
  },
  {
    path: '/edit-enrollment/:id',
    name: 'edit-enrollment',
    component: EditEnrollmentView,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/edit-student/:id',
    name: 'edit-student',
    component: EditStudentView,
    meta: { requiresAuth: true }
  },
  {
    path: '/show-student/:id',
    name: 'show-student',
    component: ShowStudentView,
    meta: { requiresAuth: true }
  }
];

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !token) {
    next('/login');
  } else if (to.name === 'login' && token) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;