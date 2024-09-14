import {
  ResponsiveContainer,
  Pie,
  Cell,
  Legend,
  PieChart,
  Tooltip,
} from "recharts";

interface ProjectStatusProps {
  data: Project[];
}

export default function ProjectStatus({ data }: ProjectStatusProps) {
  const statusCount = data.reduce(
    (acc: Record<string, number>, project: Project) => {
      const status = project.endDate ? "Completed" : "Active";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {},
  );

  const projectStatus = Object.keys(statusCount).map((key) => ({
    name: key,
    count: statusCount[key],
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
      <h3 className="mb-4 text-lg font-semibold dark:text-white">
        Project Status
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            dataKey="count"
            nameKey="name"
            data={projectStatus}
            fill="#82ca9d"
            label
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
