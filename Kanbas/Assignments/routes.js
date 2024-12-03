
import * as assignmentsDao from "./dao.js";


export default function AssignmentRoutes(app) {app.get("/api/courses/:courseId/assignments", async (req, res) => {
  const { courseId } = req.params;
  try {
      const assignments = await assignmentsDao.findAssignmnetsForCourse(courseId);
      res.json(assignments);
  } catch (error) {
      console.error("Error fetching assignments:", error);
      res.status(500).send("Error fetching assignments");
  }
});

app.post("/api/courses/:courseId/assignments/new", async (req, res) => {
  const { courseId } = req.params;
  const assignment = {
      ...req.body,
      course: String(courseId) // Ensure 'course' is set as a string
  };
  try {
      console.log("Assignment being saved:", assignment); // Debugging line
      const newAssignment = await assignmentsDao.createAssigment(assignment);
      console.log("Assignment stored in DB:", newAssignment);
      res.status(201).json(newAssignment);
  } catch (error) {
      console.error("Error creating assignment:", error);
      res.status(500).send("Error creating assignment");
  }
});

app.delete("/api/assignments/:assignmentId", async (req, res) => {
  const { assignmentId } = req.params;
  try {
      await assignmentsDao.deleteAssignment(assignmentId);
      res.sendStatus(204);
  } catch (error) {
      console.error("Error deleting assignment:", error);
      res.status(500).send("Error deleting assignment");
  }
});

app.put("/api/assignments/:assignmentId", async (req, res) => {
  const { assignmentId } = req.params;
  const assignmentUpdates = req.body;
  try {
      const updatedAssignment = await assignmentsDao.updateAssignment(assignmentId, assignmentUpdates);
      res.json(updatedAssignment);
  } catch (error) {
      console.error("Error updating assignment:", error);
      res.status(500).send("Error updating assignment");
  }
});

app.get("/api/courses/:courseId/assignments/:assignmentId", async (req, res) => {
  const { courseId, assignmentId } = req.params;
  try {
      const assignment = await assignmentsDao.findAssignment(courseId, assignmentId);
      if (assignment) {
          res.json(assignment);
      } else {
          res.status(404).send("Assignment not found");
      }
  } catch (error) {
      console.error("Error finding assignment:", error);
      res.status(500).send("Error finding assignment");
  }
});

  
    
}