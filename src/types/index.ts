export interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}


export interface UserCourse {
  id: number;
  title: string;
  description: string;
  link: string;
  course_type: string;
}

export interface Student {
  id: number;
  name: string;
  user: User;
}

export interface BaseCourse {
  id?: number;
  title: string;
  description: string;
  course_type: string;
  link: string;
}

export interface Course extends BaseCourse {
  enrollments: CoursesViewEnrollment[];
  user_id: number;
}

export interface Stats {
  total_students: number;
  total_courses: number;
  students_with_courses: number;
}

export interface UserCourse {
  id: number;
  title: string;
  description: string;
  link: string;
  course_type: string;
}

export interface CoursesViewEnrollment {
  id: number;
  status: string;
  created_at: string;
  course_id: number;
  student: Student;
}

export interface EditEnrollment {
  id: number;
  status: string;
  course: {
    title: string;
    description: string;
  };
}

export interface StudentEnrollment {
  id: number;
  status: string;
  course: Course;
}