import Header from "@/components/Header";
import { api } from "@/store/api";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Empty, Skeleton, Space, Table, TableProps } from "antd";

const userColumns: TableProps["columns"] = [
  {
    title: "ID",
    dataIndex: "userId",
    key: "userId",
    width: 100,
  },
  {
    title: "Profile Picture",
    dataIndex: "profilePictureUrl",
    key: "profilePictureUrl",
    width: 100,
    render: (src: string, record) => {
      console.log(record);

      return (
        <div className="flex w-full items-center justify-center">
          {!src ? (
            <Avatar icon={<UserOutlined />} />
          ) : (
            <Avatar src={src} alt={`${record.username} Picture`} />
          )}
        </div>
      );
    },
  },
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
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

export default function UsersPage() {
  const { data: usersData, isLoading } = api.useGetUsersQuery();

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
        ) : !usersData?.data ? (
          <Empty rootClassName="flex flex-col items-center justify-center" />
        ) : (
          <Table
            scroll={{ x: 600, y: 300 }}
            loading={isLoading}
            columns={userColumns}
            dataSource={usersData.data}
            rowKey={(user) => user.userId}
            virtual
          />
        )}
      </div>
    </div>
  );
}
