/* eslint-disable @typescript-eslint/no-explicit-any */

import { Account } from "@/models/account.model";
import { Activity } from "@/models/activity.model";
import { Collection, CollectionQuery } from "@/models/collection.model";
import { appApi } from "@/store/app.api";
import { collectionQueryBuilder } from "@/utility/collection-builder/collection-query-builder";
import { toast } from "sonner";

const sharedQuery = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivities: builder.query<Collection<Activity>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/activities/get-activities`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch {
          /**
           * Alternatively, on failure you can invalidate the corresponding cache tags
           * to trigger a re-fetch:
           * dispatch(api.util.invalidateTags(['Post']))
           */
        }
      },
    }),
    logOut: builder.mutation<any, string>({
      query: (newData: any) => ({
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
        method: "post",
        data: newData,
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            //
          }
        } catch (error: any) {
          // notification.error({
          //   message: "Error",
          //   description: error?.error?.data?.message
          //     ? error?.error?.data?.message
          //     : "Error try again",
          // });
          toast("Error try again");
        }
      },
    }),
    getAccount: builder.query<Account, string>({
      query: (id: string) => ({
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/get-account/${id}`,
        method: "GET",
      }),
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch {
          /**

           */
        }
      },
    }),
    getAccounts: builder.query<Account, CollectionQuery>({
      query: (data) => ({
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/get-accounts`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            //
          }
        } catch (error: any) {
          // notification.error({
          //   message: "Error",
          //   description: error?.error?.data?.message
          //     ? error?.error?.data?.message
          //     : "Error try again",
          // });
          toast("Error try again");
        }
      },
    }),
  }),
  overrideExisting: true,
});
export const {
  useLazyGetActivitiesQuery,
  useLogOutMutation,
  useLazyGetAccountQuery,
  useLazyGetAccountsQuery,
} = sharedQuery;
