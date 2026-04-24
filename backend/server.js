// server.js
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


// 🔹 GET all projects
app.get("/projects", (req, res) => {
  db.query("SELECT * FROM projects", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    res.json(results);
  });
});


// 🔹 CREATE project
app.post("/projects", (req, res) => {
  const { nom, description, proprietaire } = req.body;

  db.query(
    "INSERT INTO projects (nom, description, proprietaire) VALUES (?, ?, ?)",
    [nom, description, proprietaire],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }

      res.json({
        id: result.insertId,
        nom,
        description,
        proprietaire,
        statut: "À faire"
      });
    }
  );
});


// 🔹 START SERVER
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});