import ReasuablePriority from "@/components/Priority/ReusablePriority";
import { PRIORITY } from "@/constants";
import { useParams } from "react-router-dom";

export default function PriorityPage() {
  const { priority } = useParams();

  const lowerCasePriorities = Object.values(PRIORITY).map(
    (priorityValue) => priorityValue.toLowerCase() as Priority,
  );
  if (!lowerCasePriorities.includes(priority as Priority)) {
    return <div>Invalid priority: {priority}</div>;
  }

  return <ReasuablePriority priority={priority!} />;
}
