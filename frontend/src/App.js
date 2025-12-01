import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [status, setStatus] = useState("pending");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  // Render Backend URL
const apiUrl = "https://updated-todo-backendss.onrender.com/todos";

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(apiUrl);
      setTodos(res.data);
    } catch (error) {
      console.error("Error fetching todos", error);
    }
  };

  const addTodo = async () => {
    if (!task || !date || !venue) {
      alert("Please fill in all fields!");
      return;
    }
    try {
      await axios.post(apiUrl, { task, date, venue, status });
      resetForm();
      fetchTodos();
    } catch (error) {
      console.error("Error adding todo", error);
    }
  };

  const updateTodo = async () => {
    if (!editId) return;
    try {
      await axios.put(`${apiUrl}/${editId}`, { task, date, venue, status });
      resetForm();
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo", error);
    }
  };

  const deleteTodo = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`${apiUrl}/${id}`);
        fetchTodos();
      } catch (error) {
        console.error("Error deleting todo", error);
      }
    }
  };

  const editTodo = (todo) => {
    setEditId(todo._id);
    setTask(todo.task);
    setDate(todo.date);
    setVenue(todo.venue);
    setStatus(todo.status);
  };

  const resetForm = () => {
    setEditId(null);
    setTask("");
    setDate("");
    setVenue("");
    setStatus("pending");
  };

  return (
    <>
      <nav className="navbar navbar-dark bg-primary shadow">
        <div className="container">
          <span className="navbar-brand fs-4 fw-bold">
            📘 Todo Management System
          </span>
        </div>
      </nav>

      <div className="container mt-5">
        {/* 🔎 Search bar */}
        <input
          type="text"
          className="form-control mb-4"
          placeholder="🔍 Search tasks..."
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Add / Update Form */}
        <div className="card p-4 shadow mb-4">
          <h5 className="text-center fw-bold mb-3">
            {editId ? "✏ Update Todo" : "➕ Add New Todo"}
          </h5>

          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Task</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Venue</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="text-center mt-4">
            {editId ? (
              <>
                <button className="btn btn-success me-2" onClick={updateTodo}>
                  <FaEdit className="me-1" /> Update
                </button>
                <button className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={addTodo}>
                <FaPlus className="me-2" /> Add Task
              </button>
            )}
          </div>
        </div>

        {/* Todo List */}
        <div className="card p-4 shadow">
          <h5 className="text-center fw-bold mb-3">📋 Todo List</h5>
          <table className="table table-hover table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Task</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Status</th>
                <th style={{ width: "120px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {todos
                .filter((t) =>
                  t.task.toLowerCase().includes(search.toLowerCase())
                )
                .map((todo) => (
                  <tr key={todo._id}>
                    <td>{todo.task}</td>
                    <td>{todo.date}</td>
                    <td>{todo.venue}</td>
                    <td>
                      <span
                        className={`badge px-3 py-2 ${
                          todo.status === "done"
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {todo.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => editTodo(todo)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => deleteTodo(todo._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
