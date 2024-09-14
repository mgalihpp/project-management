import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import { ConfigProvider, theme } from "antd";
import { useEffect } from "react";
import { useAppSelector } from "@/store";

const router = createBrowserRouter(routes);

function App() {
  const darkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <ConfigProvider
      theme={{
        cssVar: true,
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
          Layout: {
            lightSiderBg: "#FFF",
            siderBg: "#101214",
          },
        },
      }}
      wave={{ disabled: true }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
