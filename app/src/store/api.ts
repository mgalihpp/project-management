// @ts-nocheck
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
    createProject: build.mutation<ApiResponse<Project>, Partial<Project>>({
      query: (project) => ({
        url: "project",
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
    getTasksByUser: build.query<ApiResponse<Task[]>, number>({
      query: (userId) => `task/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? result.data.map(({ id }) => ({ type: "Tasks", id }))
          : [{ type: "Tasks", id: userId }],
    }),
    createTask: build.mutation<ApiResponse<Task>, Partial<Task>>({
      query: (task) => ({
        url: "task",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      query: ({ taskId, status }) => ({
        url: `task/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
      ],
    }),
    getUsers: build.query<ApiResponse<User[]>, void>({
      query: () => "user/all",
      providesTags: ["Users"],
    }),
    getTeams: build.query<ApiResponse<Team[]>, void>({
      query: () => "team",
      providesTags: ["Teams"],
    }),
    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),
  }),
});
