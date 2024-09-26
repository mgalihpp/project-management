import { api } from "@/store/api";
import { Button, DatePicker, Flex, Form, Input, message, Modal } from "antd";
import dayjs from "dayjs";

interface AddProjectModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ProjectForm {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

export default function AddProjectModal({
  open,
  setOpen,
}: AddProjectModalProps) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [createProject, { isLoading }] = api.useCreateProjectMutation();

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

  const handleSubmit = async (values: ProjectForm) => {
    showMessage({
      type: "loading",
      content: "Waiting for Response...",
      duration: 0,
    });

    const formatStartDate = dayjs(values.startDate).format(
      "YYYY-MM-DDTHH:mm:ss.SSSZ",
    );
    const formatEndDate = dayjs(values.endDate).format(
      "YYYY-MM-DDTHH:mm:ss.SSSZ",
    );

    await createProject({
      name: values.title,
      description: values.description,
      startDate: formatStartDate,
      endDate: formatEndDate,
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
        title="Add Project"
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
          //   form={form}
          name="add_task"
          layout="vertical"
          requiredMark="optional"
          onFinish={handleSubmit}
        >
          <Form.Item
            hasFeedback
            name="title"
            label="Title"
            tooltip="Enter the title of the project"
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
            tooltip="Enter the description of the project"
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
              name="endDate"
              label="End Date"
              tooltip="Enter the end date of the task"
              rules={[
                {
                  type: "date",
                  required: true,
                  message: "Please input the end date!",
                },
              ]}
            >
              <DatePicker />
            </Form.Item>
          </Flex>
        </Form>
      </Modal>
    </>
  );
}
