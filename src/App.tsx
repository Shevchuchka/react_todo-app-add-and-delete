import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { TodoErrors } from './components/TodoErrors';
import { TodoContent } from './components/TodoContent';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const errorFunction = (message: string) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => errorFunction('Unable to load todos'));
  }, [setTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <TodoContent
        todos={todos}
        setTodos={setTodos}
        errorFunction={errorFunction}
      />
      <TodoErrors errorMessage={errorMessage} closeError={setErrorMessage} />
    </div>
  );
};
