// Interfaces de Entidades Básicas
// -----------------------------------------------------------------------------
export interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

export interface Student {
  id: number;
  name: string;
  user: User;
}

export interface BaseCourse {
  id: number;
  title: string;
  description: string;
  course_type: string;
  link: string;
}

// Interfaces de Matrícula (que dependem das básicas)
// -----------------------------------------------------------------------------
export interface Enrollment {
  id: number;
  status: string;
  created_at: string;
  course_id: number;
  student: Student;
  course: BaseCourse;
}

// Interfaces de Cursos para cenários específicos
// -----------------------------------------------------------------------------
export interface CourseAdmin extends BaseCourse {
  creator_name: string;
  enrollments: Enrollment[];
}

export interface UserCourse extends BaseCourse {}

// Interfaces Adicionais
// -----------------------------------------------------------------------------
export interface Stats {
  total_students: number;
  total_courses: number;
  students_with_courses: number;
}