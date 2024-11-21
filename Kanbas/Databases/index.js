// server/Databases/index.js

import courses from "./courses.js";
import modules from "./modules.js";
import assignments from "./assignments.js";
import users from "./users.js";
import enrollments from "./enrollments.js";

// Create a single shared mutable object
const Database = {
  courses: courses,
  modules: modules,
  assignments: assignments,
  users: users,
  enrollments: enrollments,
};

export default Database;
