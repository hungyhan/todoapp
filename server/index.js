const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = Number(process.env.PORT || 5000);

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: [
      "https://todo.do2602.click",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

// CREATE A TODO
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;

    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description],
    );

    res.status(201).json(newTodo.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Unable to create todo",
    });
  }
});

// GET ALL TODOS
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");

    res.json(allTodos.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Unable to get todos",
    });
  }
});

// GET A TODO
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await pool.query(
      "SELECT * FROM todo WHERE todo_id = $1",
      [id],
    );

    if (todo.rows.length === 0) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Unable to get todo",
    });
  }
});

// UPDATE A TODO
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const result = await pool.query(
      `
      UPDATE todo
      SET description = $1
      WHERE todo_id = $2
      RETURNING *
      `,
      [description, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Unable to update todo",
    });
  }
});

// DELETE A TODO
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM todo WHERE todo_id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    res.json({
      message: "Todo was deleted",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Unable to delete todo",
    });
  }
});

// Route không tồn tại
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});