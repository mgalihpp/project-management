import { Table, TableProps, Tag, Typography } from "antd";
import { format } from "date-fns";

const priorityColumn: TableProps["columns"] = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    width: 150,
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
    width: 150,
    render: (status: string) => {
      const Status = {
        toDo: "To Do",
        workInProgress: "Work In Progress",
        underReview: "Under Review",
        completed: "Completed",
      };

      if (status === Status.toDo) {
        return <Tag color="processing">{status}</Tag>;
      } else if (status === Status.workInProgress) {
        return <Tag color="warning">{status}</Tag>;
      } else if (status === Status.underReview) {
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
    width: 130,
  },
  {
    title: "Tags",
    dataIndex: "tags",
    key: "tags",
    width: 200,
    render: (tags: string) => {
      let tagList: string[] = [];
      const colors = [
        "red",
        "volcano",
        "orange",
        "gold",
        "lime",
        "green",
        "cyan",
        "blue",
        "geekblue",
        "purple",
        "magenta",
      ];

      if (tags.includes(",")) {
        tagList = tags.split(",").map((tag) => tag.trim());
      } else {
        tagList = [tags];
      }

      return tagList.map((tag, index) => (
        <Tag color={colors[index % colors.length]} key={index}>
          {tag}
        </Tag>
      ));
    },
  },
  {
    title: "Start Date",
    dataIndex: "startDate",
    key: "startDate",
    width: 130,
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
    key: "author",
    width: 150,
    render: (author: User) => author.username,
  },
  {
    title: "Assignee",
    dataIndex: "assignee",
    width: 150,
    render: (assignee: User) => assignee.username,
  },
];

interface PriorityTableProps {
  data: Task[];
  loading: boolean;
  priority: string;
}

export default function PriorityTable({
  data,
  loading,
  priority,
}: PriorityTableProps) {
  const filteredTasks = data.filter(
    (task: Task) => task.priority?.toLowerCase() === priority,
  );

  return (
    <div className="w-full">
      <Table
        scroll={{ x: 600, y: 300 }}
        loading={loading}
        columns={priorityColumn}
        dataSource={filteredTasks}
        rowKey={(task) => task.id}
        virtual
      />
    </div>
  );
}
