import Header from "@/components/Header";
import { useAppSelector } from "@/store";
import { api } from "@/store/api";
import { Empty, Skeleton } from "antd";
import TaskPriority from "@/components/Home/TaskPriority";
import ProjectStatus from "@/components/Home/ProjectStatus";
import UserTaskTable from "@/components/Home/UserTaskTable";

export default function HomePage() {
  const { data: tasksData, isLoading: isTasksLoading } = api.useGetTasksQuery({
    projectId: 1,
  });

  const { data: projectsData, isLoading: isProjectsLoading } =
    api.useGetProjectsQuery();

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const chartColors = isDarkMode
    ? {
        bar: "#8884d8",
        barGrid: "#303030",
        pieFill: "#4A90E2",
        text: "#FFFFFF",
      }
    : {
        bar: "#8884d8",
        barGrid: "#E0E0E0",
        pieFill: "#82ca9d",
        text: "#000000",
      };

  return (
    <section className="container h-full w-full bg-gray-100 bg-transparent p-8">
      <Header name="ProManage Dashboard" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {isTasksLoading ? (
          <Skeleton active loading={isTasksLoading} />
        ) : !tasksData?.data ? (
          <Empty rootClassName="flex items-center justify-center flex-col" />
        ) : (
          <TaskPriority data={tasksData.data} chartColors={chartColors} />
        )}
        {isProjectsLoading ? (
          <Skeleton active loading={isTasksLoading} />
        ) : !projectsData?.data ? (
          <Empty rootClassName="flex items-center justify-center flex-col" />
        ) : (
          <ProjectStatus data={projectsData.data} />
        )}
        {isTasksLoading ? (
          <Skeleton active loading={isTasksLoading} />
        ) : !tasksData?.data ? (
          <Empty rootClassName="flex items-center justify-center flex-col" />
        ) : (
          <UserTaskTable data={tasksData.data} loading={isTasksLoading} />
        )}
      </div>
    </section>
  );
}
