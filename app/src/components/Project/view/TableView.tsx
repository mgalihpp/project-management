import { TASK_STATUS } from "@/constants";
import {
  Empty,
  Skeleton,
  Space,
  Table,
  TableProps,
  Tag,
  Typography,
} from "antd";
import { format } from "date-fns";

const taskColumns: TableProps["columns"] = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    width: 200,
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    width: 300,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 200,
    render: (status: string) => {
      if (status === TASK_STATUS.ToDo) {
        return <Tag color="processing">{status}</Tag>;
      } else if (status === TASK_STATUS.WorkInProgress) {
        return <Tag color="warning">{status}</Tag>;
      } else if (status === TASK_STATUS.UnderReview) {
        return <Tag color="error">{status}</Tag>;
      } else {
        return <Tag color="success">{status}</Tag>;
      }
    },
  },
  {
    title: "Priority",
    dataIndex: "priority",
    key: "priority",
    width: 200,
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
    title: "Tags",
    dataIndex: "tags",
    key: "tags",
    width: 200,
    render: (tags: string) => {
      let tagList: string[] = [];

      if (tags.includes(",")) {
        tagList = tags.split(",").map((tag) => tag.trim());
      } else {
        tagList = [tags];
      }

      return tagList.map((tag, index) => <Tag key={index}>{tag}</Tag>);
    },
  },
  {
    title: "Start Date",
    dataIndex: "startDate",
    key: "startDate",
    width: 200,
    render: (startDate: string) => {
      return (
        <Typography.Text>
          {format(new Date(startDate), "dd-MMM-yyyy")}
        </Typography.Text>
      );
    },
  },
  {
    title: "Due Date",
    dataIndex: "dueDate",
    key: "dueDate",
    width: 200,
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
    title: "Author",
    dataIndex: "author",
    key: "Author",
    width: 200,
    render: (author: User) => author.username || "Unknown",
  },
  {
    title: "Assignee",
    dataIndex: "assignee",
    key: "Assignee",
    width: 200,
    render: (assignee: User) => assignee.username || "Unassigned",
  },
  {
    title: "Action",
    key: "Action",
    width: 150,
    render: () => (
      <Space>
        <a>Delete</a>
        <a>Edit</a>
      </Space>
    ),
  },
];

interface TaskTableProps {
  data: Task[] | null | undefined;
  isLoading: boolean;
}

export default function TableView({ data, isLoading }: TaskTableProps) {
  return (
    <div className="p-4 xl:px-6">
      {isLoading ? (
        <Skeleton active loading={isLoading} />
      ) : !data ? (
        <Empty rootClassName="flex justify-center items-center flex-col" />
      ) : (
        <Table
          scroll={{ x: 100, y: 300 }}
          loading={isLoading}
          columns={taskColumns}
          dataSource={data}
          rowKey={(task) => task.id}
          virtual
        />
      )}
    </div>
  );
}
