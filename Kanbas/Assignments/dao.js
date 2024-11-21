
import Database from "../Databases/index.js";

export function findAssignmnetsForCourse(courseId) {
    const { assignments } = Database;
    return assignments.filter((assignment) => assignment.course === courseId)
}

export function createAssigment(assignment) {
    const newAssignment = {...assignment, _id: Date.now().toString()};
    Database.assignments.push(newAssignment); 
    //Database.assignments = {...Database.assignments, newAssignment};
    return newAssignment;
}

export function deleteAssignment(assignmentId) {
    const {assignments } = Database;
    Database.assignments = assignments.filter((assignment) => assignmentId !== assignment._id);
}

export function updateAssignment(assignmentId, assignmnetUpdates) {
    const { assignments } = Database;
    const assignment = assignments.find((assignment) => assignment._id === assignmentId);
    Object.assign(assignment, assignmnetUpdates);
    return assignment;
}

export function findAssignment(courseId, assignmentId) {
    const { assignments } = Database;
    return assignments.find(
      (assignment) => assignment.course === courseId && assignment._id === assignmentId
    );
  }