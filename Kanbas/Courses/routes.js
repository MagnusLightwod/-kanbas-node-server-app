import express from "express";
import * as courseDao from "./dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
import * as modulesDao from "../Modules/dao.js";
export default function CourseRoutes(app) {
  // Route to find all courses
  app.get("/api/courses", (req, res) => {
    try {
      const courses = courseDao.findAllCourses();  // Call DAO to get all courses
      res.status(200).json(courses);  // Send back the courses as JSON with 200 status
    } catch (error) {
      console.error("Error fetching courses: ", error);
      res.status(500).send("Error fetching courses");
    }
  });

  // Route to find courses for a specific enrolled user
  app.get("/api/users/:userId/courses", (req, res) => {
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
      const courses = courseDao.findCoursesForEnrolledUser(userId);
      res.status(200).json(courses);
    } catch (error) {
      console.error("Error finding courses for user: ", error);
      res.status(500).send("Error finding courses for user");
    }
  });

  // Route to create a new course (for faculty)
  app.post("/api/users/current/courses", (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser || currentUser.role !== "FACULTY") {
        res.status(403).send("Unauthorized: Only faculty can create courses");
        return;
      }

      // Create the new course and enroll the faculty member in it
      const newCourse = courseDao.createCourse(req.body);
      enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
      res.status(201).json(newCourse);
    } catch (error) {
      console.error("Error creating course: ", error);
      res.status(500).send("Error creating course");
    }
  });


  
  // Route to enroll a student or faculty in an existing course
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
      res.status(201).json(newEnrollment);
    } catch (error) {
      console.error("Error enrolling user in course: ", error);
      res.status(500).send("Error enrolling user in course");
    }
  });

  // Route to unenroll a user from a course
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

  // Route to delete a specific course by ID
  app.delete("/api/courses/:courseId", (req, res) => {
    try {
      const { courseId } = req.params;
      const currentUser = req.session["currentUser"];
      if (!currentUser || currentUser.role !== "FACULTY") {
        res.status(403).send("Unauthorized: Only faculty can delete courses");
        return;
      }

      // Delete the course and any associated enrollments
      courseDao.deleteCourse(courseId);
      enrollmentsDao.deleteEnrollmentsByCourse(courseId);
      res.sendStatus(204);  // Successful deletion returns a 204 status
    } catch (error) {
      console.error("Error deleting course: ", error);
      res.status(500).send("Error deleting course");
    }
  });

  app.get("/api/courses/:courseId/modules", (req, res) => {
    const { courseId } = req.params;
    const modules = modulesDao.findModulesForCourse(courseId);
    res.json(modules);
  });

  app.post("/api/courses/:courseId/modules", (req, res) => {
    const { courseId } = req.params;
    const module = {
      ...req.body,
      course: courseId,
    };
    const newModule = modulesDao.createModule(module);
    res.send(newModule);
  });

}
