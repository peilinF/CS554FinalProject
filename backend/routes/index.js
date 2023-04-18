import userRoutes from "./users.js";

import mapRoutes from "./maps.js";
const constructRoutes = (app) => {
  app.use("/users", userRoutes);
  app.use("/maps", mapRoutes);
  app.use("*", (req, res) => {
    res.json({ message: "No matching route found" });
  });
};

export default constructRoutes;
