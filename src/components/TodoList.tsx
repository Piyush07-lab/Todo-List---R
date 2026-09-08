import React from 'react';
import TodoItems from './TodoItems';

const TodoList: React.FC = () => {
  return (
    <div className="todoListMain">
      <div className="header">
        <form>
          <input placeholder="enter task" />
          <button type="button">add</button>
        </form>
        <TodoItems />
      </div>
    </div>
  );
};

export default TodoList;
