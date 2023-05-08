import userRoutes from "./users.js";
import conversationRoutes from "./conversation.js";
import messageRoutes from "./messages.js";
import mapRoutes from "./maps.js";
import logbookRoutes from "./logbook.js";
import friendsRoutes from "./friends.js";

const constructRoutes = (app) => {
  app.use("/users", userRoutes);
  app.use("/conversations", conversationRoutes);
  app.use("/messages", messageRoutes);
  app.use("/maps", mapRoutes);
  app.use("/logbook", logbookRoutes);
  app.use("/friends", friendsRoutes);

  app.use("*", (req, res) => {
    res.json({ message: "No matching route found" });
  });
};

export default constructRoutes;
