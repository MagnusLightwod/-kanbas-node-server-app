// File: enrollmentsRoutes.js
import * as enrollmentsDao from "./dao.js";
export default function EnrollmentsRoutes(app) {
  
    // Enroll a user in a course
    app.post("/api/courses/:courseId/enroll", (req, res) => {
      try {
        const currentUser = req.session["currentUser"];
        const { courseId } = req.params;
  
        if (!currentUser) {
          res.status(401).send("Unauthorized");
          return;
        }
  
        // Enroll the user in the course
        const newEnrollment = enrollmentsDao.enrollUserInCourse(currentUser._id, courseId);
        if (newEnrollment) {
           
           // console.log("USER ENROLLED.....");
          res.status(201).json(newEnrollment);
        } else {
          res.status(409).send("User is already enrolled in this course");
        }
      } catch (error) {
        console.error("Error enrolling user in course: ", error);
        res.status(500).send("Error enrolling user in course");
      }
    });
  
    // Unenroll a user from a course
    app.delete("/api/courses/:courseId/unenroll", (req, res) => {
      try {
        const currentUser = req.session["currentUser"];
        const { courseId } = req.params;
  
        if (!currentUser) {
          res.status(401).send("Unauthorized");
          return;
        }
  
        // Remove the enrollment
        enrollmentsDao.deleteEnrollment(currentUser._id, courseId);
        res.sendStatus(204);  // Successfully unenrolled
      } catch (error) {
        console.error("Error unenrolling user from course: ", error);
        res.status(500).send("Error unenrolling user from course");
      }
    });
  
    // Get all courses a user is enrolled in
    app.get("/api/enrollments/user/:userId", (req, res) => {
      try {
        let { userId } = req.params;
        if (userId === "current") {
          const currentUser = req.session["currentUser"];
          if (!currentUser) {
            res.sendStatus(401);
            return;
          }
          userId = currentUser._id;
        }
  
        const enrolledCourses = enrollmentsDao.findCoursesForEnrolledUser(userId);
        res.status(200).json(enrolledCourses);
      } catch (error) {
        console.error("Error finding enrolled courses for user: ", error);
        res.status(500).send("Error finding enrolled courses for user");
      }
    });
  }
  