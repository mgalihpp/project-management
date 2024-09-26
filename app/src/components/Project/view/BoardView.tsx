import AddTaskModal from "@/components/Modal/AddTask";
import TaskCard from "@/components/Project/card/TaskCard";
import { TASK_STATUS } from "@/constants";
import { useAppSelector, useAppDispatch, setTaskModalOpen } from "@/store";
import { api } from "@/store/api";
import { Empty, Flex, Skeleton } from "antd";
import { EllipsisVertical, Plus } from "lucide-react";
import { useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface BoardViewProps {
  data: Task[] | null | undefined;
  isLoading: boolean;
}

interface TaskColumnProps {
  tasks: Task[];
  status: string;
  moveTask: (taskId: number, toStatus: string) => void;
  toggleModal: (value: boolean) => void;
}

const TASK_STATUS_ARRAY = Object.values(TASK_STATUS);

export default function BoardView({ data, isLoading }: BoardViewProps) {
  const isTaskModalOpen = useAppSelector((state) => state.global.taskModalOpen);

  const dispatch = useAppDispatch();

  const toggleModal = (value: boolean) => {
    dispatch(setTaskModalOpen(value));
  };

  const [updateTaskStatus, { isLoading: isUpdating }] =
    api.useUpdateTaskStatusMutation();

  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus });
  };

  useEffect(() => {
    if (isUpdating) {
      document.body.classList.add("cursor-wait");
      document.body.style.pointerEvents = "none";
    } else {
      document.body.style.pointerEvents = "auto";
      document.body.classList.remove("cursor-wait");
    }
  }, [isUpdating]);

  return (
    <div className="p-4 xl:px-6">
      <AddTaskModal open={isTaskModalOpen} setOpen={toggleModal} />
      {isLoading ? (
        <Skeleton active loading={isLoading} />
      ) : !data ? (
        <Empty />
      ) : (
        <div className={`${isUpdating ? "opacity-50" : ""}`}>
          <DndProvider backend={HTML5Backend}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {TASK_STATUS_ARRAY.map((status) => (
                <TaskColumn
                  tasks={data}
                  status={status}
                  moveTask={moveTask}
                  key={status}
                  toggleModal={toggleModal}
                />
              ))}
            </div>
          </DndProvider>
        </div>
      )}
    </div>
  );
}

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  toggleModal,
}: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop({
    accept: "task",
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const tasksCount = tasks.filter((task) => task.status === status).length;

  const statusColor: any = {
    "To Do": "#2563EB",
    "Work In Progress": "#059669",
    "Under Review": "#D97706",
    Completed: "#000000",
  };

  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : ""}`}
    >
      <Flex className="mb-3 w-full">
        <div
          className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`}
          style={{ backgroundColor: statusColor[status] }}
        />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
          <h3 className="line-clamp-1 flex items-center text-lg font-semibold dark:text-white">
            {status}{" "}
            <span
              className="ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary"
              style={{ width: "1.5rem", height: "1.5rem" }}
            >
              {tasksCount}
            </span>
          </h3>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-5 items-center justify-center dark:text-neutral-500">
              <EllipsisVertical size={26} />
            </button>
            <button
              className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
              onClick={() => toggleModal(true)}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </Flex>

      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <Task task={task} key={task.id} />
        ))}
    </div>
  );
};

const Task = ({ task }: { task: Task }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={(instance) => {
        drag(instance);
      }}
      className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <TaskCard task={task} key={task.id} />
    </div>
  );
};
