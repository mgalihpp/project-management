import ProjectHeader from "@/components/Project/ProjectHeader";
import BoardView from "@/components/Project/view/BoardView";
import ListView from "@/components/Project/view/ListView";
import TableView from "@/components/Project/view/TableView";
import TimelineView from "@/components/Project/view/TimelineView";
import { api } from "@/store/api";
import { useState } from "react";
import { useParams } from "react-router-dom";

type viewType = "List" | "Table" | "Timeline" | "Board" | string;

export default function ProjectPage() {
  const { id } = useParams();
  const [view, setView] = useState<viewType>("Board");

  const { data: tasksData, isLoading } = api.useGetTasksQuery({
    projectId: parseInt(id!),
  });

  return (
    <div>
      <ProjectHeader setView={setView} />

      {view === "List" ? (
        <ListView data={tasksData?.data} isLoading={isLoading} />
      ) : view === "Table" ? (
        <TableView data={tasksData?.data} isLoading={isLoading} />
      ) : view === "Timeline" ? (
        <TimelineView data={tasksData?.data} isLoading={isLoading} />
      ) : (
        <BoardView data={tasksData?.data} isLoading={isLoading} />
      )}
    </div>
  );
}
