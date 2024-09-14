import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { RootState } from ".";
import { fetchAuthSession } from "@/services/authService";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: async (headers, { getState }) => {
      const sessionToken = (getState() as RootState).global.session.token;

      if (sessionToken) {
        headers.set("Authorization", `Bearer ${sessionToken}`);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: ["Projects", "Tasks", "Users", "Teams"],
  endpoints: (build) => ({
    // getAuthUser: build.query({
    //   queryFn: async (_, _queryApi, _extraoptions, fetchWithBQ) => {
    //     try {
    //       //   const user = await getCurrentUser();
    //       //   const session = await fetchAuthSession();
    //       const user = {};
    //       const session = {
    //         userSub: "some user sub",
    //         tokens: {
    //           accessToken: "some token",
    //         },
    //       };
    //       if (!session) throw new Error("No session found");
    //       const { userSub } = session;
    //       const { accessToken } = session.tokens ?? {};

    //       const userDetailsResponse = await fetchWithBQ(`users/${userSub}`);
    //       const userDetails = userDetailsResponse.data as User;

    //       return { data: { user, userSub, userDetails } };
    //     } catch (error) {
    //       if (error instanceof Error) {
    //         return {
    //           error: error.message || "Could not fetch user data",
    //         };
    //       }
    //     }
    //   },
    // }),
    login: build.mutation<
      ApiResponse<string>,
      { username: string; password: string }
    >({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, api) {
        try {
          const { data } = await api.queryFulfilled;
          Cookies.set("token", data.data as string, {
            expires: 7,
            secure: true,
          });

          await fetchAuthSession();
        } catch (error) {
          console.error("Login failed", error);
        }
      },
    }),
    signup: build.mutation<
      ApiResponse<string>,
      { username: string; password: string }
    >({
      query: (userData) => ({
        url: "auth/register",
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(_, api) {
        try {
          const { data } = await api.queryFulfilled;
          Cookies.set("token", data.data as string, {
            expires: 7,
            secure: true,
          });
        } catch (error) {
          console.error("Error on signup mutation:", error);
        }
      },
    }),
    getProjects: build.query<ApiResponse<Project[]>, void>({
      query: () => "project",
      providesTags: ["Projects"],
    }),
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),
    getTasks: build.query<ApiResponse<Task[]>, { projectId: number }>({
      query: ({ projectId }) => `task?projectId=${projectId}`,
      providesTags: (result) =>
        result?.data
          ? result.data.map(({ id }) => ({ type: "Tasks" as const, id }))
          : [{ type: "Tasks" as const }],
    }),
    getTasksByUser: build.query<Task[], number>({
      query: (userId) => `tasks/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks", id }))
          : [{ type: "Tasks", id: userId }],
    }),
    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
      ],
    }),
    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),
    getTeams: build.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
    }),
    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),
  }),
});
