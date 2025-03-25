import { axiosBaseQuery } from "@/utility/axios-base-query";
import { createApi } from "@reduxjs/toolkit/query/react";


// initialize an empty api service that we'll inject endpoints into later as needed
export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
  tagTypes: [],
});
