import { Space, Table, TableProps, Typography } from "antd";

const taskColumns: TableProps["columns"] = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Priority",
    dataIndex: "priority",
    key: "priority",
    render: (priority: string) => {
      if (priority === "Urgent") {
        return <Typography.Text type="danger">{priority}</Typography.Text>;
      } else if (priority === "High") {
        return <Typography.Text type="warning">{priority}</Typography.Text>;
      } else {
        return <Typography.Text type="success">{priority}</Typography.Text>;
      }
    },
  },
  {
    title: "Due Date",
    dataIndex: "dueDate",
    key: "dueDate",
    render: (dueDate: string) => {
      const today = new Date();
      const deadline = new Date(dueDate);
      const diffTime = deadline.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const text =
        diffDays <= 0 ? "Already deadline" : `${diffDays} days remaining`;

      if (diffDays <= 0) {
        return <Typography.Text type="danger">{text}</Typography.Text>;
      } else if (diffDays <= 7) {
        return <Typography.Text type="warning">{text}</Typography.Text>;
      } else {
        return <Typography.Text type="success">{text}</Typography.Text>;
      }
    },
  },
  {
    title: "Action",
    key: "Action",
    render: () => (
      <Space>
        <a>Delete</a>
        <a>Edit</a>
      </Space>
    ),
  },
];

interface UserTaskTableProps {
  data: Task[];
  loading: boolean;
}

export default function UserTaskTable({ data, loading }: UserTaskTableProps) {
  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-2">
      <h3 className="mb-4 text-lg font-semibold dark:text-white">Your Tasks</h3>
      <div style={{ maxHeight: 400, width: "100%" }}>
        <Table
          scroll={{ x: 600, y: 300 }}
          loading={loading}
          columns={taskColumns}
          dataSource={data}
          rowKey={(task) => task.id}
          virtual
        />
      </div>
    </div>
  );
}
