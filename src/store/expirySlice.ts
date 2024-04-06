import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface ExpiryResponse {
  expiryDates: string[];
}

export const expiryApi = createApi({
  reducerPath: "expiryApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getExpiryDates: builder.query<
      ExpiryResponse,
      { collectionName: string; instrument: string }
    >({
      query: ({ collectionName, instrument }) => ({
        url: `/expiryDates`,
        params: { collectionName, instrument },
      }),
    }),
  }),
});

export const { useGetExpiryDatesQuery } = expiryApi;
