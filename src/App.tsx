import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import TodoItems from './components/TodoItems';
import { TodoItem, PriorityLevel } from './types/todo';

const App: React.FC = () => {
  const [items, setItems] = useState<TodoItem[]>(() => {
    const saved = localStorage.getItem('todo_items');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('todo_items', JSON.stringify(items));
  }, [items]);

  const deleteItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const toggleComplete = (id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newStatus = !item.status;
          return { ...item, status: newStatus, completedAt: newStatus ? Date.now() : undefined };
        }
        return item;
      })
    );
  };

  const updatePriority = (id: number, priority: PriorityLevel) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, priority } : item
      )
    );
  };

  const updateCategory = (id: number, category: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, category } : item
      )
    );
  };

  const historyItems = items
    .filter(item => item.status)
    .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

  return (
    <main className="min-h-screen flex flex-col xl:flex-row items-center justify-center gap-6 xl:gap-12 p-4 xl:p-8 overflow-hidden">


      <aside className="hidden xl:flex flex-col w-80 h-[80vh] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="text-center mb-4 shrink-0">
          <h2 className="text-xl font-bold text-white mb-2 tracking-wide">Stay Organized</h2>
          <p className="text-sm text-indigo-200">
            Your tasks, perfectly prioritized and always accessible.
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar relative border-t border-white/10 pt-4 mt-2">
          <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-widest text-center">History</h3>
          {historyItems.length === 0 ? (
             <div className="text-center text-white/50 text-sm mt-10">No completed tasks.</div>
          ) : (
            <TodoItems
              entries={historyItems}
              onDelete={deleteItem}
              onToggleComplete={toggleComplete}
              onUpdatePriority={updatePriority}
              onUpdateCategory={updateCategory}
              isHistory={true}
            />
          )}
        </div>
      </aside>


      <section className="w-full max-w-md shrink-0">
        <TodoList 
          items={items}
          setItems={setItems}
          deleteItem={deleteItem}
          toggleComplete={toggleComplete}
          updatePriority={updatePriority}
          updateCategory={updateCategory}
        />
      </section>


      <aside className="hidden xl:flex flex-col justify-center w-80 h-[80vh] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl text-indigo-50">
        <h3 className="text-md font-bold text-white mb-6 uppercase tracking-widest text-center border-b border-white/10 pb-4">
          Smart Syntax
        </h3>

        <p className="text-xs leading-relaxed mb-6 opacity-90">
          Automate your workflow. Assign priority levels or categories directly from the input box by appending <code className="bg-indigo-900/50 px-1.5 py-0.5 rounded text-indigo-300 font-mono">/priority</code> or <code className="bg-indigo-900/50 px-1.5 py-0.5 rounded text-indigo-300 font-mono">/Category</code>.
        </p>

        <div className="bg-white/10 rounded-lg p-4 mb-6 border border-white/10">
          <p className="text-xs font-semibold text-indigo-300 mb-2 uppercase tracking-wide">Example</p>
          <p className="text-sm font-medium italic">"Buy groceries /1 /Home"</p>
        </div>

        <ul className="space-y-3 text-xs opacity-90 font-medium">
          <li className="flex items-center gap-3"><span className="text-md drop-shadow-sm">🔴</span> Priority 1: Critical</li>
          <li className="flex items-center gap-3"><span className="text-md drop-shadow-sm">🟠</span> Priority 2: High</li>
          <li className="flex items-center gap-3"><span className="text-md drop-shadow-sm">🟡</span> Priority 3: Medium</li>
          <li className="flex items-center gap-3"><span className="text-md drop-shadow-sm">🟢</span> Priority 4: Low</li>
          <li className="flex items-center gap-3"><span className="text-md drop-shadow-sm">⚪</span> Priority 5: Very Low</li>
        </ul>
      </aside>

    </main>
  );
};

export default App;