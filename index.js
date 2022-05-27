require("dotenv").config();
console.clear();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const api = require("./api");
const { errorHandler, notFound, databaseStatus } = require("./middlewares");
const connect = require("./lib/database");
const cookieParser = require("cookie-parser");

// Configs
const { CLIENT, WEB_SERVER, META } = require("./lib/configs");

const app = express();

//Database
connect()
  .then((client) => {
    app.set("database", true);
    app.set("database-client", client);
  })
  .catch((err) => {
    app.set("database", false);
  });

// Middlewares
app.set("trust proxy", 1);
// app.use(morgan("dev"));
app.use(
  cors({
    origin: [
      `${
        WEB_SERVER.ENV === "production"
          ? CLIENT.URL_ORIGIN
          : "http://localhost:3000"
      }`,
    ],
    credentials: true,
    allowedHeaders: "Content-Type,Authorization",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  })
);
app.use(cookieParser());
app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hey");
});

// API route
app.use(`/${META.API_VERSION}`, api);

app.listen(WEB_SERVER.PORT, () => {
  console.log(`Running on port: ${WEB_SERVER.PORT}`);
});

app.use(notFound);
app.use(errorHandler);
