const assignment = {
    id: 1, title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10", completed: false, score: 0,
  };

const module ={
    id: 2, name: "moduleName", desacription: "Module test object description", course: "Course: WebDev", completed: "false", score: 100
}
  export default function WorkingWithObjects(app) {
    app.get("/lab5/assignment", (req, res) => {
      res.json(assignment);
    });

    app.get("/lab5/assignment/title", (req, res) => {
        res.json(assignment.title);
      });

    app.get("/lab5/assignment/title/:newTitle", (req, res) => {
    const { newTitle } = req.params;
    assignment.title = newTitle; // changes objects title based on the new title parsed from the link
    res.json(assignment);
    });

    app.get("/lab5/assignment/score/:newScore", (req, res) => {
        const { newScore } = req.params;
        assignment.score = newScore; // changes objects title based on the new title parsed from the link
        res.json(assignment);
        });

        app.get("/lab5/assignment/completed/:completed", (req, res) => {
            const { completed } = req.params;
            assignment.completed = completed === "true"; // Set the completed value based on the string "true" or "false"
            res.json(assignment);
          });

    app.get("/lab5/module", (req, res) => {
        res.json(module);
      });

      app.get("/lab5/module/name", (req, res) => {
        res.json(module.name);
      });

      app.get("/lab5/module/name/:newName", (req, res) => {
        const { newName } = req.params;
        module.name = newName; // changes objects title based on the new title parsed from the link
        res.json(module);
        });
    
    
    
  };
  