import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';
import { USER_ID } from '../api/todos';

type Props = {
  todos: Todo[];
  addTodo: ({ userId, title, completed }: Omit<Todo, 'id'>) => Promise<void>;
  loadingState: boolean;
  loadingFunction: (value: boolean) => void;
  errorFunction?: (message: string) => void;
  setTodoList: (TempTodos: Todo[]) => void;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  loadingState,
  addTodo = () => {},
  setTodoList = () => {},
  loadingFunction = () => {},
  errorFunction = () => {},
}) => {
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim();

  const inputRef = useRef<HTMLInputElement>(null);

  const checkActiveTodos = (): boolean => {
    return todos.every(todo => todo.completed === true);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const newValue = event.target.value;

    setQuery(newValue);
    errorFunction('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    loadingFunction(true);

    if (!normalizedQuery) {
      errorFunction('Title should not be empty');
    }

    const tempTodo: Todo = {
      id: 0,
      userId: 0,
      title: normalizedQuery,
      completed: false,
    };

    setTodoList([...todos, tempTodo]);

    const result = addTodo({
      userId: USER_ID,
      title: normalizedQuery,
      completed: false,
    });

    if (result instanceof Promise) {
      result.then(() => setQuery('')).finally(() => loadingFunction(false));
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: checkActiveTodos(),
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={event => handleSubmit(event)}>
        <input
          data-cy="NewTodoField"
          ref={inputRef}
          value={query}
          onChange={event => onInputChange(event)}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={loadingState}
        />
      </form>
    </header>
  );
};
