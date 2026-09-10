import { useState, useRef, useEffect, Fragment } from 'react';
import { TodoItem, PriorityLevel } from '../types/todo';
import TodoItems from './TodoItems';
import { ChevronDownIcon, InformationCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';

export type GroupByOption = 'none' | 'priority' | 'category' | 'date';

interface TodoListProps {
  items: TodoItem[];
  setItems: React.Dispatch<React.SetStateAction<TodoItem[]>>;
  deleteItem: (id: number) => void;
  toggleComplete: (id: number) => void;
  updatePriority: (id: number, priority: PriorityLevel) => void;
  updateCategory: (id: number, category: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ items, setItems, deleteItem, toggleComplete, updatePriority, updateCategory }) => {
  const [currentText, setCurrentText] = useState<string>('');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [isMobileInfoOpen, setIsMobileInfoOpen] = useState(false);
  const [isMobileHistoryOpen, setIsMobileHistoryOpen] = useState(false);

  const [groupBy, setGroupBy] = useState<GroupByOption>('none');
  const [filterPriority, setFilterPriority] = useState<'all' | 1 | 2 | 3 | 4 | 5>('all');

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = scrollRef.current;
      setShowScrollIndicator(scrollHeight > clientHeight && Math.ceil(scrollTop + clientHeight) < scrollHeight);
    }
  };

  useEffect(() => {
    checkScroll();
  }, [items, currentText, groupBy, filterPriority]);

  const addItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = currentText.trim();
    if (!trimmed) return;

    let taskText = trimmed;
    let taskPriority: PriorityLevel = 3;
    let taskCategory: string | undefined = undefined;

    const parts = trimmed.split(/\s+\//);
    taskText = parts[0].trim();

    for (let i = 1; i < parts.length; i++) {
      const part = parts[i].trim();
      if (/^[1-5]$/.test(part)) {
        taskPriority = parseInt(part, 10) as PriorityLevel;
      } else if (part.length > 0) {
        taskCategory = part;
      }
    }
    
    if (!taskText) return;

    const newItem: TodoItem = {
      id: Date.now(),
      text: taskText,
      status: false,
      createdAt: Date.now(),
      priority: taskPriority,
      category: taskCategory,
    };

    setItems((prevItems) => [...prevItems, newItem]);
    setCurrentText('');
  };

 
  const processedItems = items
    .filter(item => {
      if (item.status) return false;
      if (filterPriority !== 'all' && item.priority !== filterPriority) return false;
      return true;
    })
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return b.createdAt - a.createdAt;
    });

  const historyItems = items
    .filter(item => item.status)
    .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

  return (
    <>
      <div className='w-full max-w-md h-[80vh] flex flex-col bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl relative overflow-hidden'>
        
        {/* Header Form */}
        <div className="p-6 pb-4 bg-white/5 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white tracking-wide">Tasks</h1>
            <div className="flex items-center gap-3 xl:hidden">
              <button 
                className="text-white/70 hover:text-white transition-colors"
                onClick={() => setIsMobileHistoryOpen(true)}
                title="History"
              >
                <ClockIcon className="w-7 h-7" />
              </button>
              <button 
                className="text-white/70 hover:text-white transition-colors"
                onClick={() => setIsMobileInfoOpen(true)}
                title="Smart Syntax"
              >
                <InformationCircleIcon className="w-7 h-7" />
              </button>
            </div>
          </div>
          
          <form onSubmit={addItem} className='flex gap-2'>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              className='flex-1 p-3 text-sm bg-white/10 text-white placeholder-slate-300 border border-white/20 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 transition-all'
            />
            <button
              type='submit'
              className='px-5 py-3 text-sm font-semibold bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-400 transition-all'
            >
              Add
            </button>
          </form>
        </div>

        {/* Controls Section */}
        <div className="px-6 pb-4 bg-white/5 border-b border-white/10 shrink-0">
           {/* Group & Filter */}
           <div className="flex gap-2">
             <select 
               value={groupBy}
               onChange={(e) => setGroupBy(e.target.value as GroupByOption)}
               className="flex-1 bg-white/10 border border-white/10 text-white text-xs rounded-md p-2 outline-none focus:ring-1 focus:ring-indigo-400"
             >
               <option value="none" className="text-black">Group: None</option>
               <option value="priority" className="text-black">Group: Priority</option>
               <option value="category" className="text-black">Group: Category</option>
               <option value="date" className="text-black">Group: Date</option>
             </select>

             <select 
               value={filterPriority}
               onChange={(e) => setFilterPriority(e.target.value === 'all' ? 'all' : parseInt(e.target.value) as any)}
               className="flex-1 bg-white/10 border border-white/10 text-white text-xs rounded-md p-2 outline-none focus:ring-1 focus:ring-indigo-400"
             >
               <option value="all" className="text-black">Filter: All Priorities</option>
               <option value="1" className="text-black">Filter: Priority 1</option>
               <option value="2" className="text-black">Filter: Priority 2</option>
               <option value="3" className="text-black">Filter: Priority 3</option>
               <option value="4" className="text-black">Filter: Priority 4</option>
               <option value="5" className="text-black">Filter: Priority 5</option>
             </select>
           </div>
        </div>

        {/* Scrollable List Container */}
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex-1 overflow-y-auto no-scrollbar relative p-4"
        >
          {processedItems.length === 0 ? (
            <div className="h-full flex items-center justify-center text-white/50 text-sm">
              No tasks found.
            </div>
          ) : (
            <TodoItems 
              entries={processedItems} 
              onDelete={deleteItem} 
              onToggleComplete={toggleComplete}
              onUpdatePriority={updatePriority}
              onUpdateCategory={updateCategory}
              groupBy={groupBy}
              isHistory={false}
            />
          )}
        </div>

        {/* Scroll Indicator */}
        {showScrollIndicator && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none z-10">
            <div className="bg-indigo-500 text-white rounded-full p-1.5 shadow-lg animate-bounce border border-indigo-400">
              <ChevronDownIcon className="w-5 h-5" />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Info Modal */}
      <Transition appear show={isMobileInfoOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 xl:hidden" onClose={() => setIsMobileInfoOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-2">
                    Smart Syntax
                  </Dialog.Title>
                  <div className="mt-2 text-sm text-gray-500 space-y-2">
                    <p>Assign priority levels or categories directly from the input box by appending <code className="bg-gray-100 px-1 py-0.5 rounded text-indigo-600 font-semibold">/priority</code> or <code className="bg-gray-100 px-1 py-0.5 rounded text-indigo-600 font-semibold">/Category</code>.</p>
                    <p><strong>Example:</strong><br />"Buy groceries /1 /Home"</p>
                    <ul className="mt-3 space-y-1">
                      <li>🔴 1: Critical</li>
                      <li>🟠 2: High</li>
                      <li>🟡 3: Medium</li>
                      <li>🟢 4: Low</li>
                      <li>⚪ 5: Very Low</li>
                    </ul>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 w-full"
                      onClick={() => setIsMobileInfoOpen(false)}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Mobile History Modal */}
      <Transition appear show={isMobileHistoryOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 xl:hidden" onClose={() => setIsMobileHistoryOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-sm max-h-[80vh] flex flex-col transform overflow-hidden rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-white mb-4 uppercase tracking-widest text-center border-b border-white/10 pb-4">
                    History
                  </Dialog.Title>
                  
                  <div className="flex-1 overflow-y-auto no-scrollbar relative min-h-[50vh]">
                    {historyItems.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-white/50 text-sm">
                        No completed tasks.
                      </div>
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

                  <div className="mt-6 shrink-0">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-500/20 px-4 py-2 text-sm font-medium text-indigo-300 hover:bg-indigo-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 w-full"
                      onClick={() => setIsMobileHistoryOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default TodoList;