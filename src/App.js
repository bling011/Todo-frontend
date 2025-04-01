import React, { useState, useEffect } from 'react';
import { getTodos, addTodo, updateTodo, deleteTodo } from './api';
import { Sun, Moon, Trash2, CheckCircle, Edit, CirclePlus, Save } from 'lucide-react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('All');
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem('darkMode')) || false
  );
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const fetchTodos = async () => {
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const newTodoData = await addTodo(newTodo);
      setTodos(prevTodos => [...prevTodos, newTodoData]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      // Update in backend first before updating UI
      const updatedTodo = await updateTodo(id, { completed: !completed });
      
      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === id ? updatedTodo : todo))
      );
    } catch (error) {
      console.error('Error updating completion status:', error);
    }
  };

  const handleDelete = async (id) => {
    const prevTodos = [...todos];
    setTodos(todos.filter(todo => todo.id !== id));
    try {
      await deleteTodo(id);
    } catch (error) {
      setTodos(prevTodos);
      console.error('Error deleting todo:', error);
    }
  };

  const handleEdit = (id, title) => {
    setEditingId(id);
    setEditText(title);
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    setIsSaving(true);
    try {
      const updatedTodo = await updateTodo(editingId, { title: editText });
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === editingId ? updatedTodo : todo
        )
      );
      setEditingId(null);
      setEditText('');
    } catch (error) {
      console.error('Error updating todo:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'Completed') return todo.completed;
    if (filter === 'Pending') return !todo.completed;
    return true;
  });

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <button className="toggle-dark-mode" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <h1>To-Do List</h1>
      <div className="todo-input">
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
        />
        <button onClick={handleAddTodo} disabled={!newTodo.trim()}>
          <CirclePlus size={20} />
        </button>
      </div>
      <div className="filters">
        <button onClick={() => setFilter('All')}>All</button>
        <button onClick={() => setFilter('Completed')}>Completed</button>
        <button onClick={() => setFilter('Pending')}>Pending</button>
      </div>
      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <li key={todo.id} className="todo-item">
            {editingId === todo.id ? (
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                autoFocus
              />
            ) : (
              <span
                className={`todo-text ${todo.completed ? 'completed' : ''}`}
                onClick={() => handleToggleComplete(todo.id, todo.completed)}
              >
                {todo.title}
              </span>
            )}
            <div className="todo-actions">
              <button onClick={() => handleToggleComplete(todo.id, todo.completed)}>
                {todo.completed ? <CheckCircle size={20} /> : <CirclePlus size={20} />}
              </button>
              {editingId === todo.id ? (
                <button onClick={handleSaveEdit} disabled={isSaving}>
                  <Save size={20} />
                </button>
              ) : (
                <button onClick={() => handleEdit(todo.id, todo.title)}>
                  <Edit size={20} />
                </button>
              )}
              <button onClick={() => handleDelete(todo.id)} disabled={isSaving}>
                <Trash2 size={20} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
