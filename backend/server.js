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


// get tasks
app.get('/tasks', (req, res) => {
  const sql = `
    SELECT t.*, p.nom as projet
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
  `

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err)
    res.json(result)
  })
})

// assigne tasks 
app.put('/tasks/:id/assign', (req, res) => {
  const { assignee } = req.body

  const sql = `UPDATE tasks SET assigned_to = ? WHERE id = ?`

  db.query(sql, [assignee, req.params.id], (err) => {
    if (err) return res.status(500).json(err)
    res.json({ message: 'assigned' })
  })
})

// unassigne tasks

app.put('/tasks/:id/unassign', (req, res) => {
  const sql = `UPDATE tasks SET assigned_to = NULL WHERE id = ?`

  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json(err)
    res.json({ message: 'unassigned' })
  })
})

// invitation 
app.post('/invitations', (req, res) => {
  const { email, projet } = req.body

  const sql = `INSERT INTO invitations (email, project_id, status)
               SELECT ?, id, 'en attente' FROM projects WHERE nom = ?`

  db.query(sql, [email, projet], (err) => {
    if (err) return res.status(500).json(err)
    res.json({ message: 'invited' })
  })
})

// get users

app.get('/users', (req, res) => {
  db.query("SELECT id, name FROM users", (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
})




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