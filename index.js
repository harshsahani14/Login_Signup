const express = require("express");
const server = express();

require("dotenv").config();
const port = process.env.port || 4000;

const cookieParser = require("cookie-parser");
server.use(cookieParser());

server.use(express.json());

const { dbConnect } = require("./config/database");

dbConnect();

const router = require("./routes/server_routes");

server.use("/v1", router);

server.listen(port, () => {
  console.log("Server activated");
});
