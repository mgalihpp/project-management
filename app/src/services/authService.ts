import baseApi from "@/lib/axios";
import { setSession, store } from "@/store";
import Cookies from "js-cookie";

export const fetchAuthSession = async (): Promise<void | null> => {
  return await baseApi
    .get<ApiResponse<User>>("/user", {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    })
    .then((response) => {
      if (!response.data.success || !response.data.data) {
        console.error(response.data.message);
        return null;
      }

      const session = {
        user: response.data.data,
        token: Cookies.get("token") ?? "",
      };

      store.dispatch(setSession(session));
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
};

export const handleSignOut = () => {
  store.dispatch(
    setSession({
      user: null,
      token: null,
    }),
  );
};
