const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const data = require("./syncer.json");
const fs = require("fs");
const path = require("path");
const http = require("http");

var oas3Tools = require("oas3-tools");
var serverPort = 8080;
var apiPort = 5000;
// app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
// REST API to get all products details at once
// With this api the frontend will only get the data
// The frontend cannot modify or update the data
// Because we are only using the GET method here.

app.get("/v1/get_syncer", (req, res) => {
  res.json(data);
});

app.post("/v1/set_syncer", (req, res) => {
  const datas = [req.body];
  console.log("Received data:", datas);
  fs.writeFile(
    path.join(__dirname, "syncer.json"),
    JSON.stringify(datas, null, 2),
    (err) => {
      if (err) {
        console.error("Error writing to file", err);
        return res.status(500).json({ message: "Failed to save data" });
      }
      res.json({
        message: "Data received successfully",
        receivedData: datas,
      });
    }
  );
  // Send a response back to the client
});

app.listen(apiPort, () => {
  console.log(
    "Server started on port %d (http://api.trincloud.cc)",
    apiPort
  );
});
