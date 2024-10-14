/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useState } from 'react';
import { Loader } from './Loader';

type Props = {
  todo: Todo;
  onDelete: (todoId: number) => void;
  loadingState: boolean;
};

export const ToDo: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  loadingState,
}) => {
  const [onEdit] = useState(false);

  const completedTodo = todo.completed === true;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completedTodo })}
    >
      <label htmlFor={`${todo.id}`} className="todo__status-label">
        <input
          id={`${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completedTodo}
        />
      </label>

      {!onEdit ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => onDelete(todo.id)}
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <Loader loadingState={loadingState} todo={todo} />
    </div>
  );
};
