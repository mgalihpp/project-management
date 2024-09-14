import {
  Button,
  Card,
  Checkbox,
  Flex,
  Form,
  Grid,
  Image,
  Input,
  message,
  theme,
  Typography,
} from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { api } from "@/store/api";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

export default function SigninPage() {
  const { token } = useToken();
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [signin, { isLoading }] = api.useLoginMutation();
  const session = useAppSelector((state) => state.global.session);

  useEffect(() => {
    if (session.user) {
      navigate("/");
    }
  }, [session.user, navigate]);

  const showMessage = ({
    type = "info",
    content = "",
    duration = 2.5,
  }: {
    type: "loading" | "success" | "error" | "info";
    content: string;
    duration?: number;
  }) => {
    messageApi.open({ type, content, duration });
  };

  const onFinish = async (values: { username: string; password: string }) => {
    showMessage({
      type: "loading",
      content: "Waiting for Response...",
      duration: 0,
    });

    await signin(values)
      .unwrap()
      .then((res) => {
        if (res.success) {
          messageApi.destroy();
          showMessage({
            type: "success",
            content: "Successfully signed in",
            duration: 2.5,
          });
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

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md
        ? `${token.paddingXL}px`
        : `${token.sizeXXL}px ${token.padding}px`,
      width: "380px",
    },
    footer: {
      marginTop: token.marginLG,
      textAlign: "center",
      width: "100%",
    },
    forgotPassword: {
      float: "right",
    },
    header: {
      marginBottom: token.marginXL,
    },
    section: {
      alignItems: "center",
      backgroundColor: token.colorBgContainer,
      display: "flex",
      height: screens.sm ? "100vh" : "auto",
      padding: screens.md ? `${token.sizeXXL}px 0px` : "0px",
    },
    text: {
      color: token.colorTextSecondary,
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
    },
  };

  return (
    <>
      {contextHolder}

      <section style={styles.section}>
        <Card style={styles.container}>
          <div style={styles.header} className="text-center">
            <Image
              src="https://assets.ggwp.id/2024/07/Logo-ff-keren-7.jpg"
              alt="Logo"
              width={40}
              height={40}
              preview={false}
              className="rounded-md"
            />
            <Title style={styles.title}>Sign in</Title>
            <Text style={styles.text}>
              Welcome to ProManage! Please enter your details below to sign in.
            </Text>
          </div>
          <Form
            name="normal_login"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
          >
            <Form.Item
              hasFeedback
              name="username"
              rules={[
                {
                  type: "string",
                  required: true,
                  message: "Please input your Username!",
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              // hasFeedback
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
                {
                  min: 8,
                  required: true,
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Password must be at least 8 characters long, including one uppercase letter, one lowercase letter, one number and one special character",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link
                style={{
                  float: "right",
                }}
                href="/forget-password"
              >
                Forgot password?
              </Link>
            </Form.Item>
            <Form.Item style={{ marginBottom: "0px" }}>
              <Button
                block
                type="primary"
                htmlType="submit"
                loading={isLoading}
              >
                Log in
              </Button>
              <Flex
                vertical
                className="my-4 items-center justify-center space-y-4"
              >
                <Text>OR</Text>
                <Button block disabled>
                  <Google className="size-5" />
                  Continue with Google
                </Button>
              </Flex>
              <div
                style={{
                  marginTop: "10px",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <Text style={styles.text}>Don't have an account?</Text>{" "}
                <Link href="/signup">Sign up now</Link>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </section>
    </>
  );
}

const Google = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="100"
      height="100"
      viewBox="0 0 48 48"
    >
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      ></path>
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      ></path>
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
    </svg>
  );
};
