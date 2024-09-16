import { useAppSelector } from "@/store";
import { api } from "@/store/api";
import { useState } from "react";
import Header from "../Header";
import { Button, Empty, Segmented, Skeleton } from "antd";
import PriorityList from "./PriorityList";
import PriorityTable from "./PriorityTable";
import AddTaskModal from "../Modal/AddTask";

interface Priority {
  priority: string;
}

export default function ReasuablePriority({ priority }: Priority) {
  const [view, setView] = useState("List");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  const session = useAppSelector((state) => state.global.session);

  const { data: tasksData, isLoading } = api.useGetTasksByUserQuery(1, {
    skip: !session.user,
  });

  return (
    <div className="mb-5 p-4">
      <AddTaskModal open={isModalNewTaskOpen} setOpen={setIsModalNewTaskOpen} />
      <Header
        name={`${priority.charAt(0).toUpperCase()}${priority.slice(1)} Priority`}
        buttonComponent={
          <Button onClick={() => setIsModalNewTaskOpen(true)}>Add Task</Button>
        }
      />
      <div className="mb-4 flex justify-start">
        <Segmented<string>
          defaultValue="List"
          options={["List", "Table"]}
          onChange={(value) => {
            setView(value);
          }}
        />
      </div>

      {isLoading ? (
        <Skeleton active loading={isLoading} />
      ) : !tasksData?.data ? (
        <Empty rootClassName="flex justify-center items-center" />
      ) : view === "List" ? (
        <PriorityList data={tasksData.data} priority={priority} />
      ) : (
        <PriorityTable
          data={tasksData.data}
          loading={isLoading}
          priority={priority}
        />
      )}
    </div>
  );
}
