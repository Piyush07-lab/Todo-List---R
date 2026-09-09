import React, { Fragment, useState } from "react";
import { TodoItem, PriorityLevel, PRIORITY_LABELS } from "../types/todo";
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon, TrashIcon, ChevronUpIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { GroupByOption } from './TodoList';

interface TodoItemsProps {
  entries: TodoItem[];
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdatePriority: (id: number, priority: PriorityLevel) => void;
  onUpdateCategory: (id: number, category: string) => void;
  groupBy?: GroupByOption;
  isHistory?: boolean;
}

const TodoItemRow: React.FC<{
  item: TodoItem;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdatePriority: (id: number, priority: PriorityLevel) => void;
  onUpdateCategory: (id: number, category: string) => void;
  isHistory: boolean;
}> = ({ item, onToggleComplete, onDelete, onUpdatePriority, onUpdateCategory, isHistory }) => {
  const [menuView, setMenuView] = useState<'main' | 'priority' | 'category'>('main');
  const [categoryInput, setCategoryInput] = useState(item.category || '');

  return (
    <li className="relative">
      <Disclosure>
        {({ open }) => (
          <div className="bg-white/40 rounded-xl shadow-sm border border-white/20 transition-all duration-200">
            
            {/* Main Task Row */}
            <div className="flex items-center justify-between p-4">
              
              {/* Left Side: Checkbox and Text */}
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={item.status}
                  onChange={() => onToggleComplete(item.id)}
                  className="w-5 h-5 cursor-pointer accent-indigo-600 rounded-md"
                />
                
                {/* Disclosure Button to toggle accordion */}
                <Disclosure.Button className="flex-1 text-left flex items-center justify-between outline-none">
                  <div className="flex flex-col">
                    <span className={`text-lg select-none transition-colors ${item.status ? 'line-through text-gray-400' : 'text-gray-800 font-medium'}`}>
                      {item.text}
                    </span>
                    {item.category && (
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-100/50 w-max px-2 py-0.5 rounded mt-1">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-400 transition-transform`} />
                </Disclosure.Button>
              </div>

              {/* Options Menu Button (Headless UI Menu) */}
              <div className="ml-2 shrink-0 relative">
                <Menu as="div" className="relative inline-block text-left">
                  {({ close }) => (
                    <>
                      <Menu.Button 
                        onClick={() => setMenuView('main')}
                        className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors outline-none focus:ring-2 focus:ring-indigo-400">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20 overflow-hidden">
                          {menuView === 'main' && (
                            <>
                              {!isHistory && (
                                <div className="px-1 py-1">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={(e) => { e.preventDefault(); setMenuView('category'); }}
                                        className={`${active ? 'bg-indigo-500 text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium`}
                                      >
                                        Category
                                      </button>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={(e) => { e.preventDefault(); setMenuView('priority'); }}
                                        className={`${active ? 'bg-indigo-500 text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium`}
                                      >
                                        Priority
                                      </button>
                                    )}
                                  </Menu.Item>
                                </div>
                              )}
                              <div className="px-1 py-1">
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={() => onDelete(item.id)}
                                      className={`${active ? 'bg-red-500 text-white' : 'text-red-600'} group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium`}
                                    >
                                      <TrashIcon className={`mr-2 h-4 w-4 ${active ? 'text-white' : 'text-red-400'}`} />
                                      Delete
                                    </button>
                                  )}
                                </Menu.Item>
                              </div>
                            </>
                          )}

                          {menuView === 'priority' && (
                            <div className="px-1 py-1">
                              <button
                                onClick={(e) => { e.preventDefault(); setMenuView('main'); }}
                                className="text-xs text-gray-500 font-semibold uppercase tracking-wider px-2 py-2 flex items-center hover:bg-gray-50 w-full rounded-md"
                              >
                                <ChevronLeftIcon className="w-3 h-3 mr-1" /> Back
                              </button>
                              {[1, 2, 3, 4, 5].map((level) => {
                                const pLevel = level as PriorityLevel;
                                const label = PRIORITY_LABELS[pLevel];
                                return (
                                  <Menu.Item key={level}>
                                    {({ active }) => (
                                      <button
                                        onClick={() => {
                                          onUpdatePriority(item.id, pLevel);
                                          close();
                                        }}
                                        className={`${
                                          active ? 'bg-indigo-500 text-white' : 'text-gray-900'
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm ${item.priority === level && !active ? 'bg-indigo-50 font-bold text-indigo-700' : ''}`}
                                      >
                                        <span className="mr-2">{label.icon}</span>
                                        {label.name}
                                      </button>
                                    )}
                                  </Menu.Item>
                                );
                              })}
                            </div>
                          )}

                          {menuView === 'category' && (
                            <div className="px-1 py-2">
                               <button
                                onClick={(e) => { e.preventDefault(); setMenuView('main'); }}
                                className="text-xs text-gray-500 font-semibold uppercase tracking-wider px-2 py-1 flex items-center hover:bg-gray-50 w-full rounded-md mb-1"
                              >
                                <ChevronLeftIcon className="w-3 h-3 mr-1" /> Back
                              </button>
                              <div className="px-2 pb-1" onClick={(e) => e.stopPropagation()}>
                                <form 
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    const cat = categoryInput.trim().split(' ')[0];
                                    if(cat) {
                                      onUpdateCategory(item.id, cat);
                                    } else if (categoryInput.trim() === '') {
                                      onUpdateCategory(item.id, '');
                                    }
                                    close();
                                  }}
                                  className="flex flex-col gap-2"
                                >
                                  <input 
                                    type="text"
                                    value={categoryInput}
                                    onChange={(e) => setCategoryInput(e.target.value)}
                                    placeholder="1 word category"
                                    className="w-full text-sm px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    autoFocus
                                  />
                                  <button type="submit" className="bg-indigo-600 text-white text-xs py-1.5 rounded font-medium hover:bg-indigo-700">Save</button>
                                </form>
                              </div>
                            </div>
                          )}

                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
              </div>
            </div>

            {/* Expanded Details View */}
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel className="px-4 pb-4 pt-2 text-sm text-gray-600 border-t border-gray-100 bg-white/50 rounded-b-xl">
                <p className="flex justify-between py-1">
                  <span className="font-semibold text-gray-500">Created</span> 
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                </p>
                {item.completedAt && (
                  <p className="flex justify-between py-1">
                    <span className="font-semibold text-gray-500">Completed</span> 
                    <span className="text-green-600 font-medium">{new Date(item.completedAt).toLocaleString()}</span>
                  </p>
                )}
                <p className="flex justify-between py-1 mt-1">
                  <span className="font-semibold text-gray-500">Priority</span> 
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <span>{PRIORITY_LABELS[item.priority].icon}</span>
                    {PRIORITY_LABELS[item.priority].name}
                  </span>
                </p>
              </Disclosure.Panel>
            </Transition>
          </div>
        )}
      </Disclosure>
    </li>
  );
};

const TodoItems: React.FC<TodoItemsProps> = ({ entries, onToggleComplete, onDelete, onUpdatePriority, onUpdateCategory, groupBy = 'none', isHistory = false }) => {
  
  const renderItemList = (items: TodoItem[]) => (
    <ul className="list-none p-0 w-full space-y-3">
      {items.map((item) => (
        <TodoItemRow 
          key={item.id} 
          item={item} 
          onToggleComplete={onToggleComplete} 
          onDelete={onDelete} 
          onUpdatePriority={onUpdatePriority} 
          onUpdateCategory={onUpdateCategory} 
          isHistory={isHistory} 
        />
      ))}
    </ul>
  );

  if (groupBy === 'none' || isHistory) {
    return renderItemList(entries);
  }

  // Grouping Logic
  const groups: Record<string, TodoItem[]> = {};
  entries.forEach(item => {
    let key = 'Other';
    if (groupBy === 'priority') {
      key = `${PRIORITY_LABELS[item.priority].icon} ${PRIORITY_LABELS[item.priority].name}`;
    } else if (groupBy === 'category') {
      key = item.category || 'Uncategorized';
    } else if (groupBy === 'date') {
      key = new Date(item.createdAt).toLocaleDateString();
    }
    
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([groupName, groupItems]) => (
        <div key={groupName}>
          <h3 className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-3 border-b border-white/10 pb-2 px-1">
            {groupName} <span className="text-white/40 ml-2">({groupItems.length})</span>
          </h3>
          {renderItemList(groupItems)}
        </div>
      ))}
    </div>
  );
};

export default TodoItems;