import { Todo } from '../types/Todo';
import {
  deleteTodo,
  getActiveTodos,
  getCompletedTodos,
  getTodos,
} from '../api/todos';
import { useCallback, useState } from 'react';
import classNames from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  todos: Todo[];
  setLoading: (value: boolean) => void;
  setActiveTodo: (todo: Todo) => void;
  setTodos: (todos: Todo[]) => void;
  filterTodos: (filteredTodos: Todo[]) => void;
  onDelete: (todoId: number) => void;
  errorFunction: (message: string) => void;
  loadingState: boolean;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  setActiveTodo,
  setLoading,
  setTodos,
  filterTodos,
  errorFunction = () => {},
  loadingState,
}) => {
  const [filterType, setFilterType] = useState<Filter>(Filter.All);

  const filteredTodosList = useCallback(
    (todosType: Filter): Todo[] => {
      const value = todosType === Filter.Active ? false : true;

      return todos.filter(todo => todo.completed === value);
    },
    [todos],
  );

  const clearFunction = async (completed: Todo[]) => {
    for (const completedTodo of completed) {
      setActiveTodo(completedTodo);

      try {
        await deleteTodo(completedTodo.id);
      } catch (error) {
        errorFunction('Unable to delete a todo');
        throw error;
      }
    }
  };

  const handleClear = () => {
    const completedTodos = filteredTodosList(Filter.Completed);
    const completedIds = completedTodos.map(actives => actives.id);

    setLoading(true);

    return clearFunction(completedTodos)
      .then(() =>
        setTodos(todos.filter(todo => !completedIds.includes(todo.id))),
      )
      .finally(() => setLoading(false));
  };

  const filterFunction = (filter: Filter) => {
    setFilterType(filter);

    switch (filter) {
      case Filter.All:
        getTodos().then(filterTodos);
        break;

      case Filter.Active:
        getActiveTodos().then(filterTodos);
        break;

      case Filter.Completed:
        getCompletedTodos().then(filterTodos);
        break;

      default:
        getTodos().then(filterTodos);
    }
  };

  const findFilterKey = (value: string): string | undefined => {
    return Object.keys(Filter).find(
      key => Filter[key as keyof typeof Filter] === value,
    );
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {filteredTodosList(Filter.Active).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filter => (
          <a
            key={filter}
            href={`#/${filter}`}
            className={classNames('filter__link', {
              selected: filterType === filter,
            })}
            onClick={() => filterFunction(filter)}
            data-cy={`FilterLink${findFilterKey(filter)}`}
          >
            {findFilterKey(filter)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => handleClear()}
        disabled={
          filteredTodosList(Filter.Completed).length === 0 || loadingState
        }
      >
        Clear completed
      </button>
    </footer>
  );
};
