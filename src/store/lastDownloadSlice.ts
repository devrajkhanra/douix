// apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const lastDownload = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getLastUpdatedDate: builder.query<{ date: string }, void>({
      query: () => "lastUpdatedDate",
    }),
  }),
});

export const { useGetLastUpdatedDateQuery } = lastDownload;
