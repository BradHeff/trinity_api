const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const data = require("./syncer.json");
const fs = require("fs");
const path = require("path");

const apiPort = 5000;
const api = "http://api.trincloud.cc";
const base = "/v1";

// app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
// REST API to get all products details at once
// With this api the frontend will only get the data
// The frontend cannot modify or update the data
// Because we are only using the GET method here.

app.get(`${base}/data`, (req, res) => {
  res.json(data);
});

app.get(`${base}/data/:section`, (req, res) => {
  const section = req.params.section;

  if (data[section]) {
    res.json(data[section]);
  } else {
    res.status(404).json({ error: "Section not found" });
  }
});

app.post(`${base}/update`, (req, res) => {
  const datas = req.body;
  console.log("Received data:", datas);

  jsonData = { ...data, ...datas };
  console.log("Updated data:", jsonData);
  fs.writeFile(
    path.join(__dirname, "syncer.json"),
    JSON.stringify(jsonData, null, 2),
    (err) => {
      if (err) {
        console.error("Error writing to file", err);
        return res.status(500).json({ message: "Failed to save data" });
      }
      res.json({
        message: "Data received successfully",
        receivedData: jsonData,
      });
    }
  );
});

app.listen(apiPort, () => {
  console.log("Server started on port %d (http://api.trincloud.cc)", apiPort);
});
