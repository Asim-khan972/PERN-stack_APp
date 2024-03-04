// src/App.js

import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  useEffect(() => {
    // Fetch todos from the server
    axios
      .get("/todos")
      .then((response) => setTodos(response.data))
      .catch((error) => console.error(error));
  }, []);

  const addTodo = () => {
    // Add a new todo to the server
    axios
      .post("/todos", { task })
      .then((response) => {
        setTodos([...todos, response.data]);
        setTask("");
      })
      .catch((error) => console.error(error));
  };

  const toggleCompletion = (id, completed) => {
    // Update the completion status of a todo on the server
    axios
      .patch(`/todos/${id}`, { completed: !completed })
      .then((response) => {
        const updatedTodos = todos.map((todo) =>
          todo.id === id ? response.data : todo
        );
        setTodos(updatedTodos);
      })
      .catch((error) => console.error(error));
  };

  const deleteTodo = (id) => {
    // Delete a todo by its ID on the server
    axios
      .delete(`/todos/${id}`)
      .then((response) => {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>Todo List</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleCompletion(todo.id, todo.completed)}
            />
            {todo.task}{" "}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>
    </div>
  );
}

export default App;
