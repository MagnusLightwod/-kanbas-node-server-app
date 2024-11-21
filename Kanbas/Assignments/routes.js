
import * as assignmentsDao from "./dao.js";


export default function AssignmentRoutes(app) {
    // get assignments for the current user course
    app.get("/api/courses/:courseId/assignments", (req, res) => {
        const { courseId } = req.params;
        const assignments = assignmentsDao.findAssignmnetsForCourse(courseId);
        res.json(assignments);
    })

    // create a new assignment
    app.post("/api/courses/:courseid/assignments", (req, res) => {
        const { courseId } = req.params;
        // might edit to be even more similar to the modules route
        const assignment = {...req.body, course: courseId};
        const newAssignment = assignmentsDao.createAssigment(assignment);
        res.status(201).json(newAssignment);
    })

    // not sure exact link, could maybe nee to 
    app.delete("/api/assignments/:assignmentId", (req, res) => {
        const {assignmentId} = req.params;
        assignmentsDao.deleteAssignment(assignmentId);
        res.status(204);
    })

    app.put("/api/assignments/:assignmentId", (req, res) => {
        const { assignmentId } = req.params;
        const assignmentUpdates = req.body;
        const updateAssignment = assignmentsDao.updateAssignment(assignmentId, assignmentUpdates);
        res.json(updateAssignment);
    })

   

// Get a single assignment by courseId and assignmentId
app.get("/api/courses/:courseId/assignments/:assignmentId", (req, res) => {
    const { courseId, assignmentId } = req.params;
    const assignment = assignmentsDao.findAssignment(courseId, assignmentId);
    if (assignment) {
      res.json(assignment);
    } else {
      res.status(404).send("Assignment not found");
    }
  });
  
    
}