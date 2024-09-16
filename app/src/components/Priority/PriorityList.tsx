import { Empty } from "antd";
import TaskCard from "../Card/TaskCard";

interface PriorityListProps {
  data: Task[];
  priority: string;
}

export default function PriorityList({ data, priority }: PriorityListProps) {
  const filteredTasks = data.filter(
    (task: Task) => task.priority?.toLowerCase() === priority,
  );

  if (filteredTasks.length <= 0) {
    return <Empty />;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {filteredTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
