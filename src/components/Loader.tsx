import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  loadingState: boolean;
  todo: Todo;
};

export const Loader: React.FC<Props> = ({ loadingState, todo }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': loadingState,
      })}
    >
      {todo.id === 0 && (
        <>
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </>
      )}
    </div>
  );
};
