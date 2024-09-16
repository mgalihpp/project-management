import { api } from "@/store/api";
import {
  Button,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Select,
} from "antd";
import React, { useState } from "react";
import dayjs from "dayjs";

interface AddTaskModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Status = {
  ToDo: "To Do",
  WorkInProgress: "Work In Progress",
  UnderReview: "Under Review",
  Completed: "Completed",
};

const Priority = {
  Urgent: "Urgent",
  High: "High",
  Medium: "Medium",
  Low: "Low",
  Backlog: "Backlog",
};

type tagOptions = {
  label: string;
  value: string;
};

const defaultTagOptions: tagOptions[] = [
  { label: "AI", value: "AI" },
  { label: "Training", value: "Training" },
  { label: "Development", value: "Development" },
  { label: "UI/UX", value: "UI/UX" },
  { label: "Cloud", value: "Cloud" },
  { label: "Database", value: "Database" },
  { label: "Security", value: "Security" },
  { label: "Networking", value: "Networking" },
  { label: "Testing", value: "Testing" },
  { label: "Analytics", value: "Analytics" },
  { label: "DevOps", value: "DevOps" },
  { label: "Frontend", value: "Frontend" },
  { label: "Backend", value: "Backend" },
  { label: "Fullstack", value: "Fullstack" },
  { label: "Design", value: "Design" },
  { label: "Machine Learning", value: "Machine Learning" },
  { label: "Data Science", value: "Data Science" },
  { label: "Computer Vision", value: "Computer Vision" },
  { label: "Other", value: "Other" },
];

interface TaskForm {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  tags: string[];
  startDate: string;
  dueDate: string;
  projectId: number;
  authorUserId: number;
  assignedUserId: number;
}

export default function AddTaskModal({ open, setOpen }: AddTaskModalProps) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [tagName, setTagName] = useState<tagOptions>({
    label: "",
    value: "",
  });
  const [tagOptions, setTagOptions] = useState<tagOptions[]>(defaultTagOptions);

  const [createTask, { isLoading }] = api.useCreateTaskMutation();
  const { data: usersData } = api.useGetUsersQuery();
  const { data: projectsData } = api.useGetProjectsQuery();

  const showMessage = ({
    type = "info",
    content = "",
    duration = 2.5,
  }: {
    type: "loading" | "success" | "error" | "info";
    content: string | string[];
    duration?: number;
  }) => {
    messageApi.open({ type, content: JSON.stringify(content), duration });
  };

  const handleSubmit = async (values: TaskForm) => {
    showMessage({
      type: "loading",
      content: "Waiting for Response...",
      duration: 0,
    });

    const formatStartDate = dayjs(values.startDate).format(
      "YYYY-MM-DDTHH:mm:ss.SSSZ",
    );
    const formatDueDate = dayjs(values.dueDate).format(
      "YYYY-MM-DDTHH:mm:ss.SSSZ",
    );

    const formatTags = values.tags.join(", ");

    await createTask({
      title: values.title,
      description: values.description,
      status: values.status,
      priority: values.priority,
      tags: formatTags,
      startDate: formatStartDate,
      dueDate: formatDueDate,
      authorUserId: values.authorUserId,
      assignedUserId: values.assignedUserId,
      projectId: values.projectId,
    })
      .unwrap()
      .then((res) => {
        if (res.success) {
          messageApi.destroy();
          showMessage({
            type: "success",
            content: "Task created successfully",
            duration: 2.5,
          });
          form.resetFields();
          setOpen(false);
        } else {
          messageApi.destroy();
          showMessage({
            type: "error",
            content: res.message!,
            duration: 2.5,
          });
        }
      })
      .catch((err) => {
        if (err instanceof Error) {
          messageApi.destroy();
          showMessage({
            type: "error",
            content: err.message!,
            duration: 2.5,
          });
        } else {
          messageApi.destroy();
          showMessage({
            type: "error",
            content: err.data.message,
            duration: 2.5,
          });
        }
      });
  };

  return (
    <>
      {contextHolder}
      <Modal
        forceRender
        open={open}
        onCancel={() => setOpen(false)}
        title="Add Task"
        centered
        confirmLoading={isLoading}
        footer={[
          [
            <Button
              key="cancel"
              onClick={() => {
                setOpen(false);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>,
          ],
          [
            <Button
              form="add_task"
              type="primary"
              key="submit"
              htmlType="submit"
              loading={isLoading}
            >
              Add
            </Button>,
          ],
        ]}
      >
        <Form
          form={form}
          name="add_task"
          layout="vertical"
          requiredMark="optional"
          onFinish={handleSubmit}
        >
          <Form.Item
            hasFeedback
            name="title"
            label="Title"
            tooltip="Enter the title of the task"
            rules={[
              {
                type: "string",
                required: true,
                message: "Please input the title!",
              },
            ]}
          >
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item
            hasFeedback
            name="description"
            label="Description"
            tooltip="Enter the description of the task"
            rules={[
              {
                type: "string",
                required: true,
                message: "Please input the description!",
              },
            ]}
          >
            <Input.TextArea placeholder="Description" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            tooltip="Select the status of the task"
            rules={[{ required: true, message: "Please select the status!" }]}
          >
            <Select
              placeholder="Select Status"
              onChange={(value) => {
                form.setFieldValue("status", value);
              }}
              options={[
                {
                  label: Status.ToDo,
                  value: Status.ToDo,
                },
                {
                  label: Status.WorkInProgress,
                  value: Status.WorkInProgress,
                },
                {
                  label: Status.UnderReview,
                  value: Status.UnderReview,
                },
                {
                  label: Status.Completed,
                  value: Status.Completed,
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="priority"
            label="Priority"
            tooltip="Select the priority of the task"
            rules={[{ required: true, message: "Please select the priority!" }]}
          >
            <Select
              placeholder="Select Priority"
              onChange={(value) => {
                form.setFieldValue("priority", value);
              }}
              options={[
                {
                  label: Priority.Urgent,
                  value: Priority.Urgent,
                },
                {
                  label: Priority.High,
                  value: Priority.High,
                },
                {
                  label: Priority.Medium,
                  value: Priority.Medium,
                },
                {
                  label: Priority.Low,
                  value: Priority.Low,
                },
                {
                  label: Priority.Backlog,
                  value: Priority.Backlog,
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="tags"
            label="Tags"
            tooltip="Enter the tags of the task"
            rules={[
              {
                required: true,
                message: "Please input the tags!",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select Tags"
              options={tagOptions}
              dropdownRender={(menu) => {
                return (
                  <>
                    {menu}
                    <Divider style={{ margin: "8px 0" }} />
                    <Flex
                      gap={8}
                      style={{ padding: "0 8px 4px", width: "100%" }}
                    >
                      <Input
                        placeholder="Enter new tag"
                        onChange={(e) => {
                          setTagName({
                            label: e.target.value,
                            value: e.target.value,
                          });
                        }}
                        onKeyDown={(e) => e.stopPropagation()}
                        style={{ width: "100%" }}
                      />
                      <Button
                        onClick={() => {
                          if (tagName.value === "" || tagName.label === "") {
                            showMessage({
                              type: "error",
                              content: "Please input the tag name!",
                              duration: 2.5,
                            });
                            return;
                          }

                          setTagOptions((prev) => [...prev, tagName]);
                        }}
                      >
                        Add
                      </Button>
                    </Flex>
                  </>
                );
              }}
            />
          </Form.Item>
          <Flex gap={8}>
            <Form.Item
              name="startDate"
              label="Start Date"
              tooltip="Enter the start date of the task"
              rules={[
                {
                  type: "date",
                  required: true,
                  message: "Please input the start date!",
                },
              ]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              name="dueDate"
              label="Due Date"
              tooltip="Enter the due date of the task"
              rules={[
                {
                  type: "date",
                  required: true,
                  message: "Please input the due date!",
                },
              ]}
            >
              <DatePicker />
            </Form.Item>
          </Flex>
          <Form.Item
            name="authorUserId"
            label="Author"
            tooltip="Select the author of the task"
            rules={[
              {
                required: true,
                message: "Please input the author!",
              },
            ]}
          >
            <Select
              onChange={(value) => form.setFieldValue("authorUserId", value)}
              placeholder="Select Author"
              options={usersData?.data?.map((user) => ({
                label: user.username,
                value: user.userId,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="assignedUserId"
            label="Assignee"
            tooltip="Select the assignee for the task"
            rules={[
              {
                required: true,
                message: "Please input the assignee!",
              },
            ]}
          >
            <Select
              onChange={(value) => form.setFieldValue("assignedUserId", value)}
              placeholder="Select Assignee"
              options={usersData?.data?.map((user) => ({
                label: user.username,
                value: user.userId,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="projectId"
            label="Project ID"
            tooltip="ID of the project"
            rules={[
              {
                type: "number",
                required: true,
                message: "Please input the projectId!",
              },
            ]}
          >
            <Select
              placeholder="Select Project"
              options={projectsData?.data?.map((project) => ({
                label: project.name,
                value: project.id,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
