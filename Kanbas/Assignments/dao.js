
import Database from "../Databases/index.js";
import model from "./model.js";

export async function findAssignmnetsForCourse(courseId) {
    try {
        console.log("courseID : ", courseId);
        const assignments = await model.find({ course: courseId });
        console.log("Fetched modules from database:", assignments);
        return assignments;
      } catch (error) {
        console.error("Error fetching modules for course:", error);
        throw error;
      }
}

export async function createAssigment(assignment) {
    // const newAssignment = {...assignment, _id: Date.now().toString()};
    // Database.assignments.push(newAssignment); 
    // //Database.assignments = {...Database.assignments, newAssignment};
    // return newAssignment;
    delete assignment._id;
    return await model.create(assignment)
}

export function deleteAssignment(assignmentId) {
    // const {assignments } = Database;
    // Database.assignments = assignments.filter((assignment) => assignmentId !== assignment._id);
    return model.deleteOne({_id: assignmentId});
}

export function updateAssignment(assignmentId, assignmentUpdates) {
    // const { assignments } = Database;
    // const assignment = assignments.find((assignment) => assignment._id === assignmentId);
    // Object.assign(assignment, assignmnetUpdates);
    // return assignment;

    return model.findByIdAndUpdate(assignmentId, assignmentUpdates, { new: true });
}

export async function findAssignment(courseId, assignmentId) {
    // const { assignments } = Database;
    // return assignments.find(
    //   (assignment) => assignment.course === courseId && assignment._id === assignmentId
    // );

    try {
        return await model.findOne({
            course: courseId,
            _id: assignmentId
        });
    }
    catch (error) {
        console.error("error finding assignment: ", error );
    }
  }