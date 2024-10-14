import { Todo } from '../types/Todo';
import { ToDo } from './Todo';

type Props = {
  todoList: Todo[];
  loadingState: boolean;
  onDelete: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todoList,
  loadingState,
  onDelete = () => {},
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoList.map(todo => (
        <ToDo
          todo={todo}
          loadingState={loadingState}
          onDelete={onDelete}
          key={todo.id}
        />
      ))}
    </section>
  );
};
