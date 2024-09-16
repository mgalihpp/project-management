import ReasuablePriority from "@/components/Priority/ReusablePriority";
import { useParams } from "react-router-dom";

export default function PriorityPage() {
  const { priority } = useParams();

  const Priority = {
    urgent: "urgent",
    high: "high",
    medium: "medium",
    low: "low",
    backlog: "backlog",
  };

  if (!Object.values(Priority).includes(priority as Priority)) {
    throw new Error(`Invalid priority: ${priority}`);
  }

  return <ReasuablePriority priority={priority!} />;
}
