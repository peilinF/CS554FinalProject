const usersRoutes = require("./users");

const constructRoutes = (app) => {
  app.use("/", usersRoutes)
  app.use("*", (req, res) => {
    res.json({ message: "No matching route found" });
  });
};

module.exports = constructRoutes;
