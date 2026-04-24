// server.js
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// POST task
app.post('/tasks', (req, res) => {
  const { title, project_id, priority, assigned_to } = req.body
  db.query(
    "INSERT INTO tasks (title, project_id, priority, status, assigned_to) VALUES (?, ?, ?, 'À faire', ?)",
    [title, project_id, priority, assigned_to],
    (err, result) => {
      if (err) return res.status(500).json(err)
      res.json({ id: result.insertId, title, project_id, priority, status: 'À faire', assigned_to })
    }
  )
})

// PATCH task status
app.patch('/tasks/:id', (req, res) => {
  const { status } = req.body
  db.query("UPDATE tasks SET status = ? WHERE id = ?", [status, req.params.id], (err) => {
    if (err) return res.status(500).json(err)
    res.json({ success: true })
  })
})

// DELETE task
app.delete('/tasks/:id', (req, res) => {
  db.query("DELETE FROM tasks WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err)
    res.json({ success: true })
  })
})


// GET projects by proprietaire (optional filter)
app.get("/projects", (req, res) => {
  const { proprietaire } = req.query
  let sql = "SELECT * FROM projects"
  const params = []
  if (proprietaire) {
    sql += " WHERE proprietaire = ?"
    params.push(proprietaire)
  }
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
})


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

//login 

app.post('/login', (req, res) => {
  const { email, password } = req.body
  db.query(
    "SELECT id, name, email FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, results) => {
      if (err) return res.status(500).json(err)
      if (results.length === 0) return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
      res.json(results[0])
    }
  )
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