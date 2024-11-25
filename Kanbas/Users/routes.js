import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

function UserRoutes(app) {


  // Route to create a new user
  const createUser = async (req, res) => { 
    const user = await dao.createUser(req.body);
    res.json(user);
  };

  // Route to delete a user by ID
  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
      res.json(status);

  };

  // Route to find all users
  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }
    if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }


    const users = await dao.findAllUsers();
    res.json(users);
  };


  // Route to find a user by ID
  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    if (user) {
      res.json(user);
    } else {
      res.sendStatus(404);
    }
  };

  // Route to update a user by ID
  const updateUser = async (req, res) => {  
    const userId = req.params.userId;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);
    const currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === userId) {
      req.session["currentUser"] = { ...currentUser, ...userUpdates };
    }
 
    res.json(currentUser);
  };


  // sign n and sign up are now asynchronous waiting on reponse from mongo
  // Route to handle user signup
  const signup = async (req, res) => {
    //console.log("Signup requested");
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  // Route to handle user signin
  const signin = async (req, res) => { 
    //console.log("sign in requested")
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    console.log(currentUser)
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };

  // Route to handle user signout
  const signout = (req, res) => {
    console.log("Signout endpoint hit");
    req.session.destroy();
    res.sendStatus(200);
  };

  // Route to fetch the current user's profile
  const profile = (req, res) => { 
    //console.log("User routes, getting current user profile");
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
       //console.log("No user profile found");
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  // Route to find courses enrolled by the current user
  const findCoursesForEnrolledUser = (req, res) => {
    //console.log("Users Route enters to find courses for enrolled user");
    let { userId } = req.params;
    
    if (userId === "current") {
      //console.log("userId == current");
      const currentUser = req.session["currentUser"];
      //console.log("Current user data below when finding enrolled courses");
      //console.log(currentUser);
      if (!currentUser) {
        console.log("Not current user, return status 401");
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }

   // console.log("Return enrolled courses");
    const courses = courseDao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };

  //  // Route to find courses enrolled by the current user
  //  const findCurrentUserenrollments = (req, res) => {
  //   console.log("Users Route enters to find courses for enrolled user");
  //   let { userId } = req.params;
    
  //   if (userId === "current") {
  //     console.log("userId == current");
  //     const currentUser = req.session["currentUser"];
  //     console.log("Current user data below when finding enrolled courses");
  //     console.log(currentUser);
  //     if (!currentUser) {
  //       console.log("Not current user, return status 401");
  //       res.sendStatus(401);
  //       return;
  //     }
  //     userId = currentUser._id;
  //   }

  //   console.log("Return enrolled courses");
  //   const enrollments = enrollmentsDao.findEnrollmentsByUser(userId);
  //   res.json(enrollments);
  // };

  // Route to create a new course for the current user (faculty)
  const createCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") {
      return res.status(403).json({ message: "Only faculty members can create courses" });
    }
    const newCourse = courseDao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };

  // Registering all the routes
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin); // issue here?
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.post("/api/users/current/courses", createCourse);
  app.get("/api/users/")
}

export default UserRoutes;
