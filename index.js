const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const data = require(path.join(__dirname, "public", "syncer.json"));
const apiPort = 5000;

const base = "/v1";

// if (process.env.NODE_ENV === "production") {
//   url = "http://api.trincloud.cc";
// } else {
//   url = "localhost";
// }
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Serve the root HTML page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // Adjust path to your HTML file
});

// Serve syncer.json
app.get("/data/example", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "openai.json")); // Adjust path as needed
});

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

app.post(`${base}/data/update`, (req, res) => {
  const datas = req.body;
  console.log("Received data:", datas);

  jsonData = { ...data, ...datas };
  console.log("Updated data:", jsonData);
  fs.writeFile(
    path.join(__dirname, "public", "syncer.json"),
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

// Start the server
app.listen(apiPort, () => {
  console.log(`Server running at http://localhost:${apiPort}/`);
});
