import { createSlice } from "@reduxjs/toolkit";

const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];

const todoSlice = createSlice({
  name: "todos",
  initialState: savedTodos,
  reducers: {
    addTodo: (state, action) => {
      state.push(action.payload);
      localStorage.setItem("todos", JSON.stringify(state));
    },

    deleteTodo: (state, action) => {
      const newState = state.filter(todo => todo.id !== action.payload);
      localStorage.setItem("todos", JSON.stringify(newState));
      return newState;
    },

    toggleStatus: (state, action) => {
      const todo = state.find(t => t.id === action.payload);
      todo.active = !todo.active;
      todo.editedTime = new Date().toLocaleString();
      localStorage.setItem("todos", JSON.stringify(state));
    },

    editTodo: (state, action) => {
      const { id, title } = action.payload;
      const todo = state.find(t => t.id === id);
      todo.title = title;
      todo.editedTime = new Date().toLocaleString();
      localStorage.setItem("todos", JSON.stringify(state));
    }
  }
});

export const { addTodo, deleteTodo, toggleStatus, editTodo } = todoSlice.actions;
export default todoSlice.reducer;
