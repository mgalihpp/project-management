// @ts-nocheck
import { handleSignOut } from "@/services/authService";
import { useAppDispatch, useAppSelector } from "@/store";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/store";
import { api } from "@/store/api";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Flex,
  MenuProps,
  Select,
  Typography,
} from "antd";
import { Sun, Moon, Settings, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const session = useAppSelector((state) => state.global.session);
  const dispatch = useAppDispatch();

  const { data: usersData } = api.useGetUsersQuery();
  const { data: projectsData } = api.useGetProjectsQuery();
  const { data: tasksData } = api.useGetTasksQuery({ projectId: 1 });
  const { data: teamsData } = api.useGetTeamsQuery();

  const items: MenuProps["items"] = [
    {
      label: (
        <Typography.Paragraph style={{ margin: 0, textAlign: "center" }}>
          {session.user?.username ?? "Guest"}
        </Typography.Paragraph>
      ),
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: (
        <Typography.Text
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className={`flex cursor-pointer items-center gap-2 rounded p-2`}
        >
          {isDarkMode ? (
            <Sun className="size-4 cursor-pointer dark:text-white" />
          ) : (
            <Moon className="size-4 cursor-pointer dark:text-white" />
          )}

          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </Typography.Text>
      ),
      key: "1",
    },
    {
      label: (
        <Typography.Link
          href="/settings"
          className={`flex cursor-pointer items-center gap-2 rounded p-2`}
        >
          <Settings className="size-4 cursor-pointer dark:text-white" />
          Settings
        </Typography.Link>
      ),
      key: "2",
    },
    {
      label: (
        <Typography.Text className="flex cursor-pointer items-center gap-2 rounded p-2">
          <LogOut className="size-4 cursor-pointer dark:text-white" /> Sign out
        </Typography.Text>
      ),
      key: "3",
    },
  ];

  const handleSearchChange = (
    value: string,
    option:
      | {
          label: JSX.Element;
          title: string;
          options: never[];
        }
      | {
          label: JSX.Element;
          title: string;
          options: never[];
        }[],
  ) => {
    const id = value.split("-")[1];

    switch (
      (option as { label: JSX.Element; data: string; options: never[] }).data
    ) {
      case "task": {
        navigate(`/tasks/${id}`);
        break;
      }
      case "project": {
        navigate(`/projects/${id}`);
        break;
      }
      case "user": {
        navigate(`/users/${id}`);
        break;
      }
      case "team": {
        navigate(`/teams/${id}`);
        break;
      }
      default:
        break;
    }
  };

  return (
    <Flex className="items-center justify-between">
      {/* Search Bar */}
      <Flex gap={8} className="w-full items-center px-2 max-md:justify-between">
        <Button
          type="text"
          icon={
            isSidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
          }
          onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
          style={{
            fontSize: "16px",
          }}
        />
        <Flex className="relative h-min w-[200px]">
          <Select
            className="w-full"
            showSearch
            placeholder="Search..."
            options={[
              {
                label: <span>User</span>,
                title: "user",
                options: usersData?.data.map((user) => ({
                  label: <span>{user.username}</span>,
                  value: `user-${user.userId}`,
                  data: "user",
                })),
              },
              {
                label: <span>Task</span>,
                title: "task",
                options: tasksData?.data.map((task) => ({
                  label: <span>{task.title}</span>,
                  value: `task-${task.id}`,
                  data: "task",
                })),
              },
              {
                label: <span>Project</span>,
                title: "project",
                options: projectsData?.data.map((project) => ({
                  label: <span>{project.name}</span>,
                  value: `project-${project.id}`,
                  data: "project",
                })),
              },
              {
                label: <span>Team</span>,
                title: "team",
                options: teamsData?.data.map((team) => ({
                  label: <span>{team.teamName}</span>,
                  value: team.id,
                  data: "team",
                })),
              },
            ]}
            onChange={handleSearchChange}
          />
        </Flex>

        {/* Icons For Mobile */}
        <div className="md:hidden">
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
            className="cursor-pointer"
          >
            {session.user ? (
              <Avatar src={session.user.profilePictureUrl} />
            ) : (
              <Avatar icon={<User />} />
            )}
          </Dropdown>
        </div>
      </Flex>

      {/* Icons For Desktop */}
      <div className="hidden items-center md:flex">
        <Button
          type="text"
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className={
            isDarkMode
              ? `h-min w-min rounded p-2 dark:hover:bg-gray-700`
              : `h-min w-min rounded p-2 hover:bg-gray-100`
          }
        >
          {isDarkMode ? (
            <Sun className="size-4 cursor-pointer dark:text-white" />
          ) : (
            <Moon className="size-4 cursor-pointer dark:text-white" />
          )}
        </Button>
        <Button
          type="text"
          href="/settings"
          className={
            isDarkMode
              ? `h-min w-min rounded p-2 dark:hover:bg-gray-700`
              : `h-min w-min rounded p-2 hover:bg-gray-100`
          }
        >
          <Settings className="size-4 cursor-pointer dark:text-white" />
        </Button>
        <div className="ml-2 mr-5 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block"></div>
        <div className="hidden items-center justify-between md:flex">
          {session.user ? (
            <Avatar src={session.user.profilePictureUrl} />
          ) : (
            <Avatar icon={<User />} />
          )}
          <span className="mx-3 text-gray-800 dark:text-white">
            {session.user?.username ?? "Guest"}
          </span>
          {!session.user ? (
            <Button
              type="primary"
              size="small"
              href="/signin"
              className="hidden rounded px-2 pt-0.5 text-xs font-bold md:block"
            >
              Sign in
            </Button>
          ) : (
            <Button
              type="primary"
              size="small"
              className="hidden rounded px-2 text-xs font-bold md:block"
              onClick={handleSignOut}
            >
              Sign out
            </Button>
          )}
        </div>
      </div>
    </Flex>
  );
}
