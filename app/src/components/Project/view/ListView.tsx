import TaskCard from "@/components/Card/TaskCard";
import Header from "@/components/Header";
import AddTaskModal from "@/components/Modal/AddTask";
import { useAppSelector, useAppDispatch, setTaskModalOpen } from "@/store";
import { Button, Empty, Skeleton } from "antd";

interface ListViewProps {
  data: Task[] | null | undefined;
  isLoading: boolean;
}

export default function ListView({ data, isLoading }: ListViewProps) {
  const isTaskModalOpen = useAppSelector((state) => state.global.taskModalOpen);

  const dispatch = useAppDispatch();

  const toggleModal = (value: boolean) => {
    dispatch(setTaskModalOpen(value));
  };

  return (
    <div className="p-4 xl:px-6">
      <div className="pt-5">
        <AddTaskModal open={isTaskModalOpen} setOpen={toggleModal} />
        <Header
          name="List"
          buttonComponent={
            <Button onClick={() => toggleModal(true)}>Add Task</Button>
          }
          isSmallText
        />
      </div>
      {isLoading ? (
        <Skeleton active loading={isLoading} />
      ) : !data ? (
        <Empty rootClassName="flex justify-center items-center flex-col" />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {data.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
