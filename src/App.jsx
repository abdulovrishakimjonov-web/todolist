import { createSlice, configureStore } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { Check, X, Plus, Clock, Edit2, Trash2 } from 'lucide-react';

const todoSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      state.push(action.payload);
    },
    deleteTodo: (state, action) => {
      return state.filter(todo => todo.id !== action.payload);
    },
    toggleStatus: (state, action) => {
      const todo = state.find(t => t.id === action.payload);
      if (todo) {
        todo.active = !todo.active;
        todo.editedTime = new Date().toLocaleString('uz-UZ');
      }
    },
    editTodo: (state, action) => {
      const { id, title } = action.payload;
      const todo = state.find(t => t.id === id);
      if (todo) {
        todo.title = title;
        todo.editedTime = new Date().toLocaleString('uz-UZ');
      }
    }
  }
});

const { addTodo, deleteTodo, toggleStatus, editTodo } = todoSlice.actions;

// Redux Store
const store = configureStore({
  reducer: {
    todos: todoSlice.reducer
  }
});

// Main App Component
function TodoApp() {
  const todos = useSelector(state => state.todos);
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return todo.active;
    if (filter === 'inactive') return !todo.active;
    return true;
  });

  const handleAdd = () => {
    if (!text.trim()) return;
    dispatch(addTodo({
      id: Date.now().toString(),
      title: text,
      active: true,
      createdTime: new Date().toLocaleString('uz-UZ'),
      editedTime: '—'
    }));
    setText('');
  };

  const activeCount = todos.filter(t => t.active).length;
  const completedCount = todos.filter(t => !t.active).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            ✨ Todo Manager
          </h1>
          <p className="text-gray-600">Redux Toolkit bilan qurilgan zamonaviy vazifalar menejeri</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-purple-100">
            <div className="text-3xl font-bold text-purple-600">{todos.length}</div>
            <div className="text-sm text-gray-600">Jami vazifalar</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-green-100">
            <div className="text-3xl font-bold text-green-600">{activeCount}</div>
            <div className="text-sm text-gray-600">Aktiv</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-100">
            <div className="text-3xl font-bold text-gray-600">{completedCount}</div>
            <div className="text-sm text-gray-600">Tugallangan</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6 border border-gray-100">
          <div className="flex gap-3">
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleAdd()}
              placeholder="Yangi vazifa qo'shish..."
              className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-lg transition-all"
            />
            <button
              onClick={handleAdd}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              Qo'shish
            </button>
          </div>
        </div>

        <div className="flex gap-3 mb-6 justify-center">
          {[
            { key: 'all', label: 'Barchasi', color: 'purple' },
            { key: 'active', label: 'Aktiv', color: 'green' },
            { key: 'inactive', label: 'Tugallangan', color: 'gray' }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                filter === f.key
                  ? `bg-${f.color}-600 text-white shadow-lg transform scale-105`
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl shadow-lg">
              <div className="text-6xl mb-4">📝</div>
              <div className="text-xl text-gray-600">Hozircha vazifalar yo'q</div>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <div
                key={todo.id}
                className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-all hover:shadow-xl ${
                  todo.active ? 'border-green-200' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <button
                    onClick={() => dispatch(toggleStatus(todo.id))}
                    className={`mt-1 p-2 rounded-full transition-all ${
                      todo.active
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {todo.active ? <Check size={20} /> : <X size={20} />}
                  </button>

                  <div className="flex-1">
                    <input
                      value={todo.title}
                      onChange={e => dispatch(editTodo({ id: todo.id, title: e.target.value }))}
                      className={`w-full text-lg font-medium bg-transparent border-b-2 border-transparent focus:border-purple-500 focus:outline-none pb-1 mb-2 transition-all ${
                        !todo.active ? 'line-through text-gray-400' : 'text-gray-800'
                      }`}
                    />
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>Tahrirlandi: {todo.editedTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => dispatch(toggleStatus(todo.id))}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        todo.active
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {todo.active ? 'Tugallash' : 'Qayta faollashtirish'}
                    </button>
                    <button
                      onClick={() => dispatch(deleteTodo(todo.id))}
                      className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Root Component with Provider
export default function App() {
  return (
    <Provider store={store}>
      <TodoApp />
    </Provider>
  );
}