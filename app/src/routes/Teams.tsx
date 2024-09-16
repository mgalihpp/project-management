import Header from "@/components/Header";
import { api } from "@/store/api";
import { Empty, Skeleton, Space, Table, TableProps } from "antd";

const userColumns: TableProps["columns"] = [
  {
    title: "ID",
    dataIndex: "id",
    key: "teamId",
    width: 100,
  },
  {
    title: "Team Name",
    dataIndex: "teamName",
    width: 200,
  },
  {
    title: "Product Owner",
    dataIndex: "productOwnerUsername",
    key: "productOwnerUsername",
  },
  {
    title: "Project Manager",
    dataIndex: "productManagerUsername",
    key: "projectManagerUsername",
  },
  {
    title: "Action",
    key: "Action",
    render: () => {
      return (
        <Space>
          <a>View Profile</a>
          <a>Delete</a>
        </Space>
      );
    },
  },
];

export default function TeamsPage() {
  const { data: teamsData, isLoading } = api.useGetTeamsQuery();

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Users" />
      <div
        style={{
          height: 650,
          width: "100%",
        }}
      >
        {isLoading ? (
          <Skeleton active loading={isLoading} />
        ) : !teamsData?.data ? (
          <Empty rootClassName="flex flex-col items-center justify-center" />
        ) : (
          <Table
            scroll={{ x: 600, y: 300 }}
            loading={isLoading}
            columns={userColumns}
            dataSource={teamsData.data}
            rowKey={(team) => team.id}
            virtual
          />
        )}
      </div>
    </div>
  );
}
