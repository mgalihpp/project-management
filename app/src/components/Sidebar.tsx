import { useAppSelector } from "@/store";
import { api } from "@/store/api";
import { LockOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Divider,
  Flex,
  Image,
  Menu,
  MenuProps,
  Typography,
} from "antd";
import {
  Home,
  Briefcase,
  Search,
  Settings,
  User,
  Users,
  AlertCircle,
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  Layers3,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const session = useAppSelector((state) => state.global.session);

  const { data: projectsData } = api.useGetProjectsQuery();

  const sideItems: MenuProps["items"] = [
    {
      key: "0",
      icon: <Home className="size-5" />,
      label: <SidebarLink label="Home" href="/" />,
    },
    {
      key: "1",
      icon: <Briefcase className="size-5" />,
      label: <SidebarLink label="Timeline" href="/timeline" />,
    },
    {
      key: "2",
      icon: <Search className="size-5" />,
      label: <SidebarLink label="Search" href="/search" />,
    },
    {
      key: "3",
      icon: <Settings className="size-5" />,
      label: <SidebarLink label="Settings" href="/settings" />,
    },
    {
      key: "4",
      icon: <User className="size-5" />,
      label: <SidebarLink label="Users" href="/users" />,
    },
    {
      key: "5",
      icon: <Users className="size-5" />,
      label: <SidebarLink label="Teams" href="/teams" />,
    },
    {
      key: "6",
      label: (
        <span className={`font-medium text-gray-800 dark:text-gray-100`}>
          Priority
        </span>
      ),
      children: [
        {
          key: `subpriority-1`,
          icon: <AlertCircle className="size-5 dark:fill-red-500" />,
          label: (
            <SidebarLink label="Urgent" href="/priority/urgent" priority />
          ),
        },
        {
          key: `subpriority-2`,
          icon: <ShieldAlert className="size-5 dark:fill-yellow-500" />,
          label: <SidebarLink label="High" href="/priority/high" priority />,
        },
        {
          key: `subpriority-3`,
          icon: <AlertTriangle className="size-5 dark:fill-green-500" />,
          label: (
            <SidebarLink label="Medium" href="/priority/medium" priority />
          ),
        },
        {
          key: `subpriority-4`,
          icon: <AlertOctagon className="size-5" />,
          label: <SidebarLink label="Low" href="/priority/low" priority />,
        },
        {
          key: `subpriority-5`,
          icon: <Layers3 className="size-5 opacity-80" />,
          label: (
            <SidebarLink label="Backlog" href="/priority/backlog" priority />
          ),
        },
      ],
    },
    {
      key: "7",
      label: (
        <span className={`font-medium text-gray-800 dark:text-gray-100`}>
          Projects
        </span>
      ),
      children: projectsData?.data?.map((project) => {
        const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

        return {
          key: `subproject-${project.id}`,
          icon: (
            <Avatar
              style={{
                backgroundColor:
                  COLORS[Math.floor(Math.random() * COLORS.length)],
              }}
            />
          ),
          label: (
            <SidebarLink label={project.name} href={`/project/${project.id}`} />
          ),
        };
      }),
    },
  ];

  return (
    <>
      <Flex className="min-h-[56px] items-center pl-4">
        <div className="text-xl font-bold text-gray-800 dark:text-white">
          EDLIST
        </div>
      </Flex>
      {/* TEAM */}
      <Flex
        gap={20}
        className="items-center border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700"
      >
        <Image
          src="https://assets.ggwp.id/2024/07/Logo-ff-keren-7.jpg"
          alt="Logo"
          width={40}
          height={40}
          preview={false}
          className="rounded-md"
        />
        <div>
          <Typography.Text strong>MGALIHPP TEAM</Typography.Text>
          <Flex gap={8} className="mt-1 items-center">
            <LockOutlined
              className="dark:text-white"
              style={{
                fontWeight: 500,
              }}
            />
            <Typography.Text
              className="self-end"
              style={{
                fontWeight: 500,
                fontSize: 12,
              }}
            >
              Private
            </Typography.Text>
          </Flex>
        </div>
      </Flex>
      <Menu
        mode="inline"
        items={sideItems}
        className="w-full bg-white dark:bg-dark-bg"
        style={{
          borderInlineEnd: 0,
        }}
      />
      <Flex
        vertical
        gap={16}
        className="z-10 mt-32 w-full items-center justify-center px-8 py-4 md:hidden"
      >
        <Divider />
        <Flex className="w-full items-center justify-center">
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
              className="rounded px-2 pt-0.5 text-xs font-bold"
              // onClick={handleSignOut}
            >
              Sign in
            </Button>
          ) : (
            <Button
              type="primary"
              size="small"
              className="rounded px-2 text-xs font-bold"
              // onClick={handleSignOut}
            >
              Sign out
            </Button>
          )}
        </Flex>
      </Flex>
    </>
  );
}

interface SidebarLinkProps {
  href: string;
  label: string;
  priority?: boolean;
}

const SidebarLink = ({ href, label, priority }: SidebarLinkProps) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  return (
    <Link to={href} className="w-full">
      <div
        className={`relative flex cursor-pointer items-center justify-start gap-3 transition-colors`}
      >
        {priority ? (
          label === "Urgent" ? (
            <Typography.Text type={isDarkMode ? "danger" : undefined}>
              {label}
            </Typography.Text>
          ) : label === "High" ? (
            <Typography.Text type={isDarkMode ? "warning" : undefined}>
              {label}
            </Typography.Text>
          ) : label === "Medium" ? (
            <Typography.Text type={isDarkMode ? "success" : undefined}>
              {label}
            </Typography.Text>
          ) : label === "Low" ? (
            <Typography.Text>{label}</Typography.Text>
          ) : (
            <Typography.Text type="secondary">{label}</Typography.Text>
          )
        ) : (
          <span className={`font-medium text-gray-800 dark:text-gray-100`}>
            {label}
          </span>
        )}
      </div>
    </Link>
  );
};
