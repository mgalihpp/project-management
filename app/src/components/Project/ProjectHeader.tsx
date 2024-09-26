import { Button, Input, Segmented } from "antd";
import Header from "../Header";
import {
  AppstoreOutlined,
  BarsOutlined,
  ClockCircleOutlined,
  PlusCircleFilled,
  TableOutlined,
} from "@ant-design/icons";
import { Filter, Grid3x3, Share2 } from "lucide-react";
import React, { useState } from "react";
import AddProjectModal from "../Modal/AddProject";

type viewType = "List" | "Table" | "Timeline" | "Board" | string;
interface ProjectHeaderProps {
  setView: React.Dispatch<React.SetStateAction<viewType>>;
}

export default function ProjectHeader({ setView }: ProjectHeaderProps) {
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  return (
    <div className="px-4 xl:px-6">
      <AddProjectModal
        open={isModalNewTaskOpen}
        setOpen={setIsModalNewTaskOpen}
      />
      <div className="pb-6 pt-6 lg:pb-4 lg:pt-8">
        <Header
          name="Project Design Development"
          buttonComponent={
            <Button
              onClick={() => setIsModalNewTaskOpen(true)}
              icon={<PlusCircleFilled />}
            >
              Add Project
            </Button>
          }
        />
      </div>
      <div className="flex flex-wrap-reverse gap-2 border-y border-gray-200 pb-[8px] pt-2 dark:border-stroke-dark md:items-center">
        <Segmented<string>
          defaultValue="List"
          options={[
            {
              title: "Board",
              label: "Board",
              icon: <AppstoreOutlined />,
              value: "Board",
            },
            {
              title: "List",
              label: "List",
              icon: <BarsOutlined />,
              value: "List",
            },
            {
              title: "Table",
              label: "Table",
              className: "flex",
              icon: <TableOutlined />,
              value: "Table",
            },
            {
              title: "Timeline",
              label: "Timeline",
              icon: <ClockCircleOutlined />,
              value: "Timeline",
            },
          ]}
          onChange={(value) => {
            setView(value);
          }}
        />
        <div className="flex items-center gap-2 max-sm:w-full">
          <Button>
            <Filter className="size-5" />
          </Button>
          <Button>
            <Share2 className="size-5" />
          </Button>
          <div className="relative">
            <Input
              placeholder="Search Task"
              type="text"
              styles={{
                affixWrapper: {
                  width: "100%",
                },
              }}
              prefix={<Grid3x3 className="size-5" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
