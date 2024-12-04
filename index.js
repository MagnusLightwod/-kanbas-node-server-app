import express from 'express';
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import CourseRoutes from "./Kanbas/Courses/routes.js";
import UserRoutes from "./Kanbas/Users/routes.js";
import ModuleRoutes from "./Kanbas/Modules/routes.js";
import AssignmentRoutes from './Kanbas/Assignments/routes.js';
import session from "express-session";
import "dotenv/config";
import EnrollmentsRoutes from './Kanbas/Enrollments/routes.js';
import mongoose from "mongoose";
import "dotenv/config";

// Mongoose connection
const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING
 || "mongodb://127.0.0.1:27017/kanbas" || "=mongodb+srv://Maggy:secretpassword@kanbas.5bl6y.mongodb.net/" || "mongodb+srv://Maggy:secretpassword@kanbas.5bl6y.mongodb.net/"
// mongoose.connect(CONNECTION_STRING);

mongoose.connect(CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB successfully!"))
.catch((err) => console.error("Failed to connect to MongoDB:", err));


const app = express();
app.use(cors({
    origin: process.env.NETLIFY_URL || "http://localhost:3000", // Allow requests from your client
    credentials: true // If you're using cookies or other authentication like sessions
  })); 
    
  // these options are for online deploy
  const sessionOptions = { 

    
    secret: process.env.SESSION_SECRET || 'super secret session phrase', // Use a strong secret key 
    resave: false,
    saveUninitialized: false,
    cookie: {
        domain: process.env.NODE_SERVER_DOMAIN,
        secure: true, // Use secure cookie in production (over HTTPS)
        sameSite: "none", // Use 'none' in production for cross-site cookies
    },
}; 

  // these options are for local deploy
// const sessionOptions = {
//     secret: 'sessionSecret', // Replace with a strong secret key
//     resave: false,
//     httpOnly: true,
//     saveUninitialized: true,

//     cookie: {
//       domain: 'localhost',
//       path: '/',
//       maxAge: 5000 * 60, //5 mnt
//       sameSite: 'lax' // Please use your own value based on requirements.
//     }
//   }

// Set proxy trust if in production, necessary when behind a reverse proxy like Render or Heroku
if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
}


//   if (process.env.NODE_ENV !== "development") {
//     sessionOptions.proxy = true;
//     sessionOptions.cookie.sameSite = 'none';
//     sessionOptions.cookie.secure = true;
//     sessionOptions.cookie.domain = process.env.NODE_SERVER_DOMAIN;
// }
app.use(session(sessionOptions));
app.use(express.json()); // allows for json and http request bodys to send data securely 


UserRoutes(app);
CourseRoutes(app); // course available only using our api. 
EnrollmentsRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
Lab5(app);
Hello(app)

app.listen(process.env.PORT || 4000)