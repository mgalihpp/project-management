import TaskCard from "@/components/Card/TaskCard";
import Header from "@/components/Header";
import AddTaskModal from "@/components/Modal/AddTask";
import { Button, Empty, Skeleton } from "antd";
import { useState } from "react";

interface ListViewProps {
  data: Task[] | null | undefined;
  isLoading: boolean;
}

export default function ListView({ data, isLoading }: ListViewProps) {
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  return (
    <div className="px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <AddTaskModal
          open={isModalNewTaskOpen}
          setOpen={setIsModalNewTaskOpen}
        />
        <Header
          name="List"
          buttonComponent={
            <Button onClick={() => setIsModalNewTaskOpen(true)}>
              Add Task
            </Button>
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
