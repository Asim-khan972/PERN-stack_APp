const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: "postgres",
  password: "shahmeer12",
  host: "localhost",
  port: 5432,
  database: "pertodo",
});

app.get("/todos", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM todos");
    const todos = result.rows;
    client.release();
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching todos");
  }
});

app.post("/todos", async (req, res) => {
  try {
    const { task } = req.body;
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO todos(task) VALUES($1) RETURNING *",
      [task]
    );
    const newTodo = result.rows[0];
    client.release();
    res.json(newTodo);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding todo");
  }
});

app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM todos WHERE id = $1", [
      id,
    ]);
    const todo = result.rows[0];
    client.release();

    if (!todo) {
      return res.status(404).send("Todo not found");
    }

    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching todo");
  }
});

app.patch("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    const client = await pool.connect();
    const result = await client.query(
      "UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *",
      [completed, id]
    );
    const updatedTodo = result.rows[0];
    client.release();

    if (!updatedTodo) {
      return res.status(404).send("Todo not found");
    }

    res.json(updatedTodo);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating todo");
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();
    const result = await client.query(
      "DELETE FROM todos WHERE id = $1 RETURNING *",
      [id]
    );
    const deletedTodo = result.rows[0];
    client.release();

    if (!deletedTodo) {
      return res.status(404).send("Todo not found");
    }

    res.json({ message: "Todo deleted successfully", todo: deletedTodo });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting todo");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
