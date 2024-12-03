import Database from "../Databases/index.js";
import model from "./model.js";

export function findModulesForCourse(courseId) {
  try {
    //console.log("courseID : ", courseId);
    const modules = model.find({ course: courseId });
   // console.log("Fetched modules from database:", modules);
    return modules;
  } catch (error) {
    console.error("Error fetching modules for course:", error);
    throw error;
  }
}

export function createModule(module) {
  // const newModule = { ...module, _id: Date.now().toString() };
  // Database.modules = [...Database.modules, newModule];
  delete module._id;
  return model.create(module);

}

export function deleteModule(moduleId) {
  console.log("Modules dao moduleId: ", moduleId);
  return model.deleteOne({ _id: moduleId });
  // const { modules } = Database;
  // Database.modules = modules.filter((module) => module._id !== moduleId);
 }

 
export function updateModule(moduleId, moduleUpdates) {
  return model.updateOne({ _id: moduleId }, moduleUpdates);
  // const { modules } = Database;
  // const module = modules.find((module) => module._id === moduleId);
  // Object.assign(module, moduleUpdates);
  // return module;
}
