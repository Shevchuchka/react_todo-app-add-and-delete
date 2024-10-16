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
  setTodos,
  errorFunction = () => {},
}) => {
  const [todoList, setTodoList] = useState<Todo[]>(todos);
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTodoList(todos);
  }, [todos]);

  const deleteFunction = (todoId: number) => {
    setLoading(true);

    deleteTodo(todoId)
      .then(() => setTodos(todos.filter(todo => todo.id !== todoId)))
      .catch(error => {
        errorFunction('Unable to delete a todo');
        throw error;
      })
      .finally(() => setLoading(false));
  };

  const addFunction = (
    tempTodoTitle: string,
    { userId, title, completed }: Omit<Todo, 'id'>,
  ) => {
    setLoading(true);

    const tempTodo: Todo = {
      id: 0,
      userId: 0,
      title: tempTodoTitle,
      completed: false,
    };

    setTodoList([...todos, tempTodo]);
    setActiveTodo(tempTodo);

    return createTodo({ userId, title, completed })
      .then(newTodo => setTodos([...todos, newTodo]))
      .catch(error => {
        errorFunction('Unable to add a todo');
        setTodos(todos.filter(todo => todo.id !== tempTodo.id));
        throw error;
      })
      .finally(() => setLoading(false));
    // return createTodo({ userId, title, completed })
    //   .then(newTodo => setTodos([newTodo, ...todos]))
    //   .catch(error => {
    //     errorFunction('Unable to add a todo');
    //     setTodoList(todos.filter(todo => todo.id !== tempTodo.id));
    //     throw error;
    //   })
    //   .finally(() => setLoading(false));
  };

  return (
    <>
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          addTodo={addFunction}
          loadingState={loading}
          errorFunction={errorFunction}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              activeTodo={activeTodo}
              setActiveTodo={setActiveTodo}
              todoList={todoList}
              loadingState={loading}
              onDelete={deleteFunction}
            />
            <TodoFooter
              filterTodos={setTodoList}
              onDelete={deleteFunction}
              setLoading={setLoading}
              loadingState={loading}
              setActiveTodo={setActiveTodo}
              setTodos={setTodos}
              todos={todos}
              errorFunction={errorFunction}
            />
          </>
        )}
      </div>
    </>
  );
};
