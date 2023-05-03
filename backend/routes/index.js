import userRoutes from "./users.js";
import conversationRoutes from "./conversation.js";
import messageRoutes from './messages.js'
import mapRoutes from "./maps.js";

const constructRoutes = (app) => {
  app.use("/users", userRoutes);
  app.use("/conversations", conversationRoutes);
  app.use("/messages", messageRoutes);
  app.use("/maps", mapRoutes);
  app.use("*", (req, res) => {
    res.json({ message: "No matching route found" });
  });
};

export default constructRoutes;
