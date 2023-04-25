const express = require("express");
const session = require("express-session");
let RedisStore = require("connect-redis")(session);

const { createClient } = require("redis");
let redisClient = createClient({ legacyMode: true });
redisClient.connect().catch(console.error);

const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schema");

const cors = require("cors");

const data = require("./data");
const cacheData = data.cache;

const utils = require("./utils");

const app = express();
app.use(express.json());

app.use(cors());

// session middleware

app.use(
  session({
    name: "AuthCookie",
    store: new RedisStore({ client: redisClient }),
    secret: "This is a secret.. shhh don't tell anyone",
    resave: false,
    saveUninitialized: true,
  })
);

// log middleware

app.use((req, res, next) => {
  let time = new Date().toUTCString();
  let method = req.method;
  let url = req.originalUrl;
  console.log(`[${time}]: ${method}, ${url}`);

  next();
});

// apollo middleware
const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  context: ({ req }) => {
    console.log(req.session.user);
    return { req };
  },
 });

(async () => {
  await server.start();
  server.applyMiddleware({ app });

  // other routes
  const configRoutes = require("./routes");
  configRoutes(app);

  const port = 4000;
  app.listen(port, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:4000");
  });
})();
