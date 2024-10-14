import { useEffect, useState } from 'react';

import { TodoFooter } from './TodoFooter';
import { TodoHeader } from './TodoHeader';
import { TodoList } from './TodoList';

import { Todo } from '../types/Todo';
import { createTodo, deleteTodo } from '../api/todos';

type Props = {
  todos: Todo[];
  setTodos: (todo: Todo[]) => void;
  errorFunction?: (message: string) => void;
};

export const TodoContent: React.FC<Props> = ({
  todos,
  setTodos = () => {},
  errorFunction = () => {},
}) => {
  const [todoList, setTodoList] = useState<Todo[]>(todos);
  const [loading, setLoading] = useState(false);
  // const [loader, setLoader] = useState(false);

  useEffect(() => {
    setTodoList(todos);
  }, [todos]);

  const deleteFunction = (todoId: number) => {
    setLoading(true);

    return deleteTodo(todoId)
      .then(() => setTodos(todos.filter(todo => todo.id !== todoId)))
      .catch(error => {
        errorFunction('Unable to delete a todo');
        throw error;
      })
      .finally(() => setLoading(false));
  };

  const addFunction = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
    return createTodo({ userId, title, completed })
      .then(newTodo => setTodos([newTodo, ...todos]))
      .catch(error => {
        errorFunction('Unable to add a todo');
        throw error;
      });
  };

  return (
    <div className="todoapp__content">
      <TodoHeader
        todos={todos}
        addTodo={addFunction}
        setTodoList={setTodoList}
        loadingFunction={setLoading}
        loadingState={loading}
        errorFunction={errorFunction}
      />

      {todos.length > 0 && (
        <>
          <TodoList
            todoList={todoList}
            loadingState={loading}
            onDelete={deleteFunction}
          />
          <TodoFooter
            filterTodos={setTodoList}
            onDelete={deleteFunction}
            loadingState={loading}
            todos={todos}
          />
        </>
      )}
    </div>
  );
};
