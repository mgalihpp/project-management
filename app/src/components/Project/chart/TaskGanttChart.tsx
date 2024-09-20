import { useAppSelector } from "@/store";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { useMemo } from "react";

interface TaskGanttChartProps {
  data: Task[];
  displayOptions: DisplayOption;
}

type TaskTypeItems = "task" | "milestone" | "project";

export default function TaskGanttChart({
  data,
  displayOptions,
}: TaskGanttChartProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const ganttTasks = useMemo(() => {
    return (
      data?.map((task) => ({
        start: new Date(task.startDate as string),
        end: new Date(task.dueDate as string),
        name: task.title,
        id: `Task-${task.id}`,
        type: "task" as TaskTypeItems,
        progress: task.points ? (task.points / 10) * 100 : 0,
        isDisabled: false,
      })) || []
    );
  }, [data]);

  return (
    <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
      <div className="timeline overflow-auto">
        <Gantt
          tasks={ganttTasks}
          {...displayOptions}
          columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
          listCellWidth="180px"
          projectProgressColor={isDarkMode ? "#1f2937" : "#aeb8c2"}
          projectProgressSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
        />
      </div>
    </div>
  );
}
