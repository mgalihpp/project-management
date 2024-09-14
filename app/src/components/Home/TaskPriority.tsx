import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Bar,
  Tooltip,
  BarChart,
} from "recharts";

interface TaskPriorityProps {
  data: Task[];
  chartColors: {
    bar: string;
    barGrid: string;
    pieFill: string;
    text: string;
  };
}

export default function TaskPriority({ data, chartColors }: TaskPriorityProps) {
  const priorityCount = data.reduce(
    (acc: Record<string, number>, task: Task) => {
      const { priority } = task;
      acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
      return acc;
    },
    {},
  );

  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }));

  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
      <h3 className="mb-4 text-lg font-semibold dark:text-white">
        Task Priority Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={taskDistribution}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.barGrid} />
          <XAxis dataKey="name" stroke={chartColors.text} />
          <YAxis stroke={chartColors.text} />
          <Tooltip
            contentStyle={{
              width: "min-content",
              height: "min-content",
            }}
          />
          <Legend />
          <Bar dataKey="count" fill={chartColors.bar} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
