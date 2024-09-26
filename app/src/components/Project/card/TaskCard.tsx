import { Avatar, Image, Tag } from "antd";
import { format } from "date-fns";
import { EllipsisVertical, MessageSquareMore } from "lucide-react";
import { useDrag } from "react-dnd";

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const taskTagsSplit = task.tags ? task.tags.split(",") : [];

  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "P")
    : "";
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "P")
    : "";

  const numberOfComments = (task.comments && task.comments.length) || 0;

  const PriorityTag = ({ priority }: { priority: Task["priority"] }) =>
    priority === "Urgent" ? (
      <Tag color="error">{priority}</Tag>
    ) : priority === "High" ? (
      <Tag color="warning">{priority}</Tag>
    ) : priority === "Medium" ? (
      <Tag color="processing">{priority}</Tag>
    ) : priority === "Low" ? (
      <Tag color="success">{priority}</Tag>
    ) : (
      <Tag color="default">{priority}</Tag>
    );

  return (
    <div
      ref={(instance) => {
        drag(instance);
      }}
      className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {task.attachments && task.attachments.length > 0 && (
        <Image
          src={task.attachments[0].fileURL}
          alt={task.attachments[0].fileName}
          className="h-auto w-full rounded-t-md"
        />
      )}
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {task.priority && <PriorityTag priority={task.priority} />}
            <div className="flex gap-2">
              {taskTagsSplit.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>
          <button className="flex h-6 w-4 flex-shrink-0 items-center justify-center dark:text-neutral-500">
            <EllipsisVertical size={26} />
          </button>
        </div>

        <div className="my-3 flex justify-between">
          <h4 className="text-md font-bold dark:text-white">{task.title}</h4>
          {typeof task.points === "number" && (
            <div className="text-xs font-semibold dark:text-white">
              {task.points} pts
            </div>
          )}
        </div>

        <div className="text-xs text-neutral-800 dark:text-neutral-200">
          {formattedStartDate && <span>{formattedStartDate} - </span>}
          {formattedDueDate && <span>{formattedDueDate}</span>}
        </div>
        <p className="text-sm text-neutral-800 dark:text-neutral-200">
          {task.description}
        </p>
        <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />

        {/* Users */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex -space-x-[6px] overflow-hidden">
            {task.assignee && (
              <Avatar
                key={task.assignee.userId}
                src={task.assignee.profilePictureUrl}
                alt={task.assignee.username}
                size="small"
              />
            )}
            {task.author && (
              <Avatar
                key={task.author.userId}
                src={task.author.profilePictureUrl}
                alt={task.author.username}
                size="small"
              />
            )}
          </div>
          <div className="flex items-center text-neutral-700 dark:text-neutral-200">
            <MessageSquareMore size={20} />
            <span className="ml-1 text-sm text-neutral-700 dark:text-neutral-200">
              {numberOfComments}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
