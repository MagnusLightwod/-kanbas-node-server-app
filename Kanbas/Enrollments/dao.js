// import Database from "../Databases/index.js";

import model from "./model.js";

// export function enrollUserInCourse(userId, courseId) {
//  // Load enrollments from the database file initially
// const enrollments = [...Database.enrollments];


//   // Check if the user is already enrolled in the course
//   const existingEnrollment = enrollments.find(
//     (enrollment) => enrollment.user === userId && enrollment.course === courseId
//   );

//   if (existingEnrollment) {
//     return null; // User is already enrolled
//   }
  
//   // Create a new enrollment record
//   const newEnrollment = {
//     _id: Date.now().toString(), // Unique identifier
//     user: userId,
//     course: courseId,
//   };

//   // Update the shared enrollments array
//   Database.enrollments.push(newEnrollment);
//   // console.log("Enrollments after enrolling:", JSON.stringify(Database.enrollments, null, 2));
//   return newEnrollment;
// }

// export function deleteEnrollment(userId, courseId) {
//   const { enrollments } = Database;
  
//   // Remove enrollment matching the user and course IDs
//   Database.enrollments = enrollments.filter(
//     (enrollment) => !(enrollment.user === userId && enrollment.course === courseId)
//   );
// }

// export function deleteEnrollmentsByCourse(courseId) {
 
//   const { enrollments } = Database;
//   // Remove all enrollments associated with a specific course
//   Database.enrollments = enrollments.filter(
//     (enrollment) => enrollment.course !== courseId
//   );
// }

// export function findEnrollmentsByUser(userId) {
//   const { enrollments } = Database;
//   // Filter enrollments by user ID
//   return enrollments.filter((enrollment) => enrollment.user === userId);
// }

// export function findEnrollmentsByCourse(courseId) {
//   const { enrollments } = Database;
//   // Filter enrollments by course ID
//   return enrollments.filter((enrollment) => enrollment.course === courseId);
// }

// export function findCoursesForEnrolledUser(userId) {
//   const { courses, enrollments } = Database;
//   // Find all courses for which the user has an enrollment
//   const enrolledCourses = courses.filter((course) =>
//     enrollments.some(
//       (enrollment) => enrollment.user === userId && enrollment.course === course._id
//     )
//   );
//   return enrolledCourses;
// }



// export function deleteEnrollmentsByUser(userId) {
 
//   const { enrollments } = Database;
//   // Remove all enrollments associated with a specific user
//   Database.enrollments = enrollments.filter(
//     (enrollment) => enrollment.user !== userId
//   );
// }


export async function findCoursesForUser(userId) {
 const enrollments = await model.find({ user: userId }).populate("course");
 return enrollments.map((enrollment) => enrollment.course);
}
export async function findUsersForCourse(courseId) {
 const enrollments = await model.find({ course: courseId }).populate("user");
 return enrollments.map((enrollment) => enrollment.user);
}
// export function enrollUserInCourse(user, course) {
//  return model.create({ user, course });
// }

export async function enrollUserInCourse(uid, cid) {
  try {
    const existingEnrollment = await model.findOne({ user: uid, course: cid });
    console.log("checking existing enrollment:", existingEnrollment);
    if (existingEnrollment) {
      console.log('User is already enrolled in this course:', cid);
      return { message: 'User already enrolled' };
    }

    const newEnrollment = await model.create({ user: uid, course: cid });
    console.log('New enrollment created:', newEnrollment);
    return newEnrollment;
  } catch (error) {
    console.error('Error enrolling user in course:', error);
    throw error;
  }
}



export function unenrollUserFromCourse(user, course) {
 return model.deleteOne({ user, course });
}


