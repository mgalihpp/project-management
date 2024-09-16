import Header from "@/components/Header";
import GanttChart from "@/components/Timeline/GanttChart";
import { api } from "@/store/api";
import { Empty, Select, SelectProps, Skeleton } from "antd";
import { DisplayOption, ViewMode } from "gantt-task-react";
import { useState } from "react";

export default function TimelinePage() {
  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  const { data: projectsData, isLoading: isProjectsLoading } =
    api.useGetProjectsQuery();

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
    <div className="max-w-full p-8">
      <header className="mb-4 flex items-center justify-between max-sm:flex-col">
        <Header name="Project Timeline" />
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

      {isProjectsLoading ? (
        <Skeleton loading={isProjectsLoading} active />
      ) : !projectsData?.data ? (
        <Empty rootClassName="flex items-center justify-center flex-col" />
      ) : (
        <GanttChart data={projectsData.data} displayOptions={displayOptions} />
      )}
    </div>
  );
}
