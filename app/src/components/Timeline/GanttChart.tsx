import { useAppSelector } from "@/store";
import { DisplayOption, Gantt, Task, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { useMemo } from "react";

interface GanttChartProps {
  data: Project[];
  displayOptions: DisplayOption;
}

export default function GanttChart({ data, displayOptions }: GanttChartProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const ganttTasks = useMemo((): Task[] => {
    return (
      data?.map((project) => ({
        start: new Date(project.startDate as string),
        end: new Date(project.endDate as string),
        name: project.name,
        id: `Project-${project.id}`,
        type: 'project',
        progress: 50,
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
