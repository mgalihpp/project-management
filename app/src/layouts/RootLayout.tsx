import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAppDispatch, useAppSelector } from "@/store";
import { setIsSidebarCollapsed } from "@/store";
import { Drawer, Layout, theme } from "antd";
import React, { useEffect } from "react";

import { Outlet, useNavigate } from "react-router-dom";

const { Sider, Header, Content } = Layout;
const { useToken } = theme;

const fixedSiderbarStyles: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarColor: "unset",
};

export default function RootLayout() {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const session = useAppSelector((state) => state.global.session);
  const dispatch = useAppDispatch();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const theme = useToken();

  const onClose = () => {
    dispatch(setIsSidebarCollapsed(true));
  };

  const navigate = useNavigate();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!session.user || !session.token) {
      navigate("/signin");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.user, session.token]);

  return (
    <Layout className="min-h-screen bg-white dark:bg-dark-bg">
      {/* Siderbar for desktop */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={isSidebarCollapsed}
          breakpoint="lg"
          width={256}
          collapsedWidth={0}
          style={{
            background: isDarkMode
              ? theme.token.Layout?.siderBg
              : theme.token.Layout?.lightSiderBg,
            borderRight: 1 + "px solid" + theme.token.colorBorderSecondary,
            ...fixedSiderbarStyles,
          }}
        >
          <Sidebar />
        </Sider>
      )}
      <Layout className="bg-white dark:bg-dark-bg">
        <Header
          style={{
            background: isDarkMode
              ? theme.token.Layout?.siderBg
              : theme.token.Layout?.lightSiderBg,
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
          className="bg-white px-2"
        >
          <Navbar />

          {/* Siderbar for mobile */}
          {isMobile && (
            <Drawer
              placement="left"
              open={!isSidebarCollapsed}
              onClose={onClose}
              style={{
                background: isDarkMode
                  ? theme.token.Layout?.siderBg
                  : theme.token.Layout?.lightSiderBg,
              }}
              styles={{
                body: {
                  padding: 0,
                },
              }}
            >
              <Sidebar />
            </Drawer>
          )}
        </Header>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
