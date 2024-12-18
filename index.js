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


const app = express();

app.use(cors({
    origin: process.env.NETLIFY_URL || "http://localhost:3000", // Allow requests from your client
    credentials: true // If you're using cookies or other authentication like sessions
  })); 

  const sessionOptions = {
    secret: process.env.SESSION_SECRET || 'super secret session phrase', // Use a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
        domain: process.env.NODE_SERVER_DOMAIN.replace('https://', ''),
        maxAge: 5000 * 60, // 5 minutes
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development", // Use secure cookie in production (over HTTPS)
        sameSite: process.env.NODE_ENV === "development" ? 'lax' : 'none', // Use 'none' in production for cross-site cookies
    },
};

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