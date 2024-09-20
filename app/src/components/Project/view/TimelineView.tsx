import { Empty, Select, SelectProps, Skeleton } from "antd";
import { DisplayOption, ViewMode } from "gantt-task-react";
import { useState } from "react";
import TaskGanttChart from "../chart/TaskGanttChart";

type TimelineViewProps = {
  data: Task[] | null | undefined;
  isLoading: boolean;
};

export default function TimelineView({ data, isLoading }: TimelineViewProps) {
  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  const handleViewModeChange = (value: ViewMode) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: value,
    }));
  };

  const selectOptions: SelectProps["options"] = [
    {
      label: "Day",
      value: ViewMode.Day,
    },
    {
      label: "Week",
      value: ViewMode.Week,
    },
    {
      label: "Month",
      value: ViewMode.Month,
    },
  ];

  return (
    <div className="px-4 xl:px-6">
      <header className="flex flex-wrap items-center justify-between gap-2 py-5">
        <h1 className="me-2 text-lg font-bold dark:text-white">
          Project Tasks Timeline
        </h1>
        <div className="relative inline-block w-64">
          <Select
            style={{
              width: "100%",
            }}
            options={selectOptions}
            defaultValue={displayOptions.viewMode}
            onChange={handleViewModeChange}
          />
        </div>
      </header>

      {isLoading ? (
        <Skeleton active loading={isLoading} />
      ) : !data ? (
        <Empty rootClassName="flex justify-center items-center flex-col mx-auto" />
      ) : (
        <TaskGanttChart data={data} displayOptions={displayOptions} />
      )}
    </div>
  );
}
