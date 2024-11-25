import Database from "../Databases/index.js"

// Function to create a new course
export function createCourse(course) {
  const newCourse = { ...course, _id: Date.now().toString() }; // Assign a unique ID
  Database.courses = [...Database.courses, newCourse];
  return newCourse;
}

// Function to find all courses
export function findAllCourses() {
  
  return Database.courses;
}

// Function to find courses for a specific enrolled user
export function findCoursesForEnrolledUser(userId) {
  const { courses, enrollments } = Database;

  // Filter courses that the given user is enrolled in
  const enrolledCourses = courses.filter((course) =>
    enrollments.some((enrollment) => enrollment.user === userId && enrollment.course === course._id)
  );

  return enrolledCourses;
}

export function deleteCourse(courseId) {
    const { courses, enrollments } = Database;
    Database.courses = courses.filter((course) => course._id !== courseId);
    Database.enrollments = enrollments.filter(
      (enrollment) => enrollment.course !== courseId
  );}
  
  
export function updateCourse(courseId, courseUpdates) {
    const { courses } = Database;
    const course = courses.find((course) => course._id === courseId);
    Object.assign(course, courseUpdates);
    return course;
  }
  