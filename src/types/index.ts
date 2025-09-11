// Interfaces de Entidades Básicas
// -----------------------------------------------------------------------------
export interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

// Representa o objeto de matrícula que vem aninhado em um curso na API.
export interface Enrollment {
  id: number;
  status: string;
  created_at: string;
  course_id: number;
  student: User; 
}

// Representa um curso em sua forma mais básica e o ID deve ser obrigatório aqui.
export interface BaseCourse {
  id: number;
  title: string;
  description: string;
  course_type: string;
  link: string;
}

// Interfaces de Cursos para cenários específicos
// -----------------------------------------------------------------------------
export interface CourseAdmin extends BaseCourse {
  creator_name: string;
  enrollments: Enrollment[];
}

// Representa o curso para a tela de "Meus Cursos" (para alunos).
export interface UserCourse extends BaseCourse {}

// Interfaces de Matrícula para cenários específicos
// -----------------------------------------------------------------------------
export interface StudentEnrollment {
  id: number;
  status: string;
  course: BaseCourse;
}

// Interfaces Adicionais
// -----------------------------------------------------------------------------
export interface Stats {
  total_students: number;
  total_courses: number;
  students_with_courses: number;
}