import React, { useState, useEffect } from 'react';
import './TodoApp.css'; 

const TodoApp = () => {
  // State for todos and new todo input
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage when they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Add a new todo
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim() === '') return;
    
    const newTodoItem = {
      id: Date.now(),
      text: newTodo,
      completed: false,
      date: new Date().toLocaleDateString()
    };
    
    setTodos([...todos, newTodoItem]);
    setNewTodo('');
  };

  // Toggle todo completion status
  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete a todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Edit a todo
  const editTodo = (id, newText) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  // Filter todos based on current filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all' filter
  });

  // Clear all completed todos
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  // Get count of remaining active todos
  const activeTodoCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="container">
      <div className="todo-app">
        <h1 className="app-title">Todo List</h1>
        
        {/* Add todo form */}
        <form onSubmit={handleAddTodo} className="todo-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            className="todo-input"
          />
          <button type="submit" className="add-button">Add</button>
        </form>
        
        {/* Todo list */}
        <div className="todo-list-container">
          {filteredTodos.length === 0 ? (
            <p className="empty-message">No todos here!</p>
          ) : (
            <ul className="todo-list">
              {filteredTodos.map((todo) => (
                <li key={todo.id} className="todo-item">
                  <div className="todo-content">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="todo-checkbox"
                    />
                    <div className="todo-text-container">
                      <p 
                        className={todo.completed ? 'todo-text completed' : 'todo-text'}
                        onClick={() => {
                          const newText = prompt('Edit todo:', todo.text);
                          if (newText !== null && newText.trim() !== '') {
                            editTodo(todo.id, newText);
                          }
                        }}
                      >
                        {todo.text}
                      </p>
                      <span className="todo-date">{todo.date}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Footer */}
        {todos.length > 0 && (
          <div className="todo-footer">
            <span className="items-left">{activeTodoCount} item(s) left</span>
            
            <div className="filter-buttons">
              <button
                className={filter === 'all' ? 'filter-button active' : 'filter-button'}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={filter === 'active' ? 'filter-button active' : 'filter-button'}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button
                className={filter === 'completed' ? 'filter-button active' : 'filter-button'}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>
            
            <button
              className="clear-completed"
              onClick={clearCompleted}
            >
              Clear completed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoApp;