/* eslint-disable @typescript-eslint/no-explicit-any */

import { Collection, CollectionQuery } from "@/models/collection.model";
import { Staff } from "@/models/staff.model";
import { appApi } from "@/store/app.api";
import { STAFF_ENDPOINT } from "./staff.endpoint";
import { collectionQueryBuilder } from "@/utility/collection-builder/collection-query-builder";
import { Role } from "@/models/role.model";
import { toast } from "sonner";
import { Permission } from "@/models/permission.model";

let staffCollection: CollectionQuery;
let archivedStaffCollection: CollectionQuery;
let rolePermissionsListCollection: any;
const staffQuery = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaff: builder.query<Staff, string>({
      query: (id: string) => ({
        url: `${STAFF_ENDPOINT.detail}/${id}`,
        method: "get",
      }),
    }),

    getArchivedStaff: builder.query<Staff, string>({
      query: (id: string) => ({
        url: `${STAFF_ENDPOINT.archivedStaff}/${id}`,
        method: "get",
      }),
    }),

    getArchivedStaffs: builder.query<Collection<Staff>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${STAFF_ENDPOINT.archivedStaff}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            archivedStaffCollection = param;
          }
        } catch (error: any) {
          // notification.error({
          //   message: 'Error',
          //   description: error?.error?.data?.message
          //     ? error?.error?.data?.message
          //     : 'Error try again',
          // });
          toast("Error try again");
        }
      },
    }),

    getStaffs: builder.query<Collection<Staff>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${STAFF_ENDPOINT.list}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            staffCollection = param;
          }
        } catch (error: any) {
          // notification.error({
          //   message: 'Error',
          //   description: error?.error?.data?.message
          //     ? error?.error?.data?.message
          //     : 'Error try again',
          // });
          toast("Error try again");
        }
      },
    }),
    getRoles: builder.query<Collection<Role>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${STAFF_ENDPOINT.roles}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          //
        } catch (error: any) {
          // notification.error({
          //   message: 'Error',
          //   description: error?.error?.data?.message
          //     ? error?.error?.data?.message
          //     : 'Error try again',
          // });
          toast("Error try again");
        }
      },
    }),
    getStaffRoles: builder.query<Collection<Role>, string>({
      query: (id: string) => ({
        url: `${STAFF_ENDPOINT.staff_role}/${id}`,
        method: "GET",
      }),
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          //
        } catch (error: any) {
          // notification.error({
          //   message: 'Error',
          //   description: error?.error?.data?.message
          //     ? error?.error?.data?.message
          //     : 'Error try again',
          // });
          toast("Error try again");
        }
      },
    }),

    createStaff: builder.mutation<Staff, Staff>({
      query: (newData: any) => ({
        url: `${STAFF_ENDPOINT.create}`,
        method: "post",
        data: newData,
        permission: "manage-staffs",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            // notification.success({
            //   message: 'Success',
            //   description: 'Successfully created',
            // });
            toast("Successfully created");
            dispatch(
              staffQuery.util.updateQueryData(
                "getStaffs",
                staffCollection,
                (draft) => {
                  if (data) {
                    draft.data.unshift(data);
                    draft.count += 1;
                  }
                }
              )
            );
          }
        } catch (error: any) {
          // notification.error({
          //   message: 'Error',
          //   description: error?.error?.data?.message
          //     ? error?.error?.data?.message
          //     : 'Error try again',
          // });
          toast("Error try again");
        }
      },
    }),

    updateStaff: builder.mutation<Staff, Staff>({
      query: (newData: any) => ({
        url: `${STAFF_ENDPOINT.update}`,
        method: "put",
        data: newData,
        permission: "manage-staffs",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            // notification.success({
            //   message: 'Success',
            //   description: 'Successfully updated ',
            // });
            toast("Successfully updated");
            dispatch(
              staffQuery.util.updateQueryData(
                "getStaffs",
                staffCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((staff) => {
                      if (staff.id === data.id) return data;
                      else {
                        return staff;
                      }
                    });
                  }
                }
              )
            );
          }
        } catch (error: any) {
          // notification.error({
          //   message: 'Error',
          //   description: error?.error?.data?.message
          //     ? error?.error?.data?.message
          //     : 'Error try again',
          // });
          toast("Error try again");
        }
      },
    }),

    updateStaffProfile: builder.mutation<Staff, any>({
      query: (newData: any) => ({
        url: `${STAFF_ENDPOINT.updateProfile}` + newData.id,
        method: "post",
        data: newData.data,
        permission: "manage-staffs",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            // notification.success({
            //   message: "Success",
            //   description: "Successfully updated ",
            // });
            toast("Error try again");
            dispatch(
              staffQuery.util.updateQueryData(
                "getStaffs",
                staffCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((staff) => {
                      if (staff.id === data.id) return data;
                      else {
                        return staff;
                      }
                    });
                  }
                }
              )
            );
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

    activateStaff: builder.mutation<Staff, string>({
      query: (id: string) => ({
        url: `${STAFF_ENDPOINT.toggleStatus}/${id}`,
        method: "post",
        permission: "activate-or-block-staffs",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              staffQuery.util.updateQueryData(
                "getStaffs",
                staffCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((staff) => {
                      if (staff.id === data.id) return data;
                      else {
                        return staff;
                      }
                    });
                  }
                }
              )
            );
            dispatch(
              staffQuery.util.updateQueryData("getStaff", param, (draft) => {
                draft.enabled = data.enabled;
              })
            );
            dispatch(
              staffQuery.util.updateQueryData(
                "getArchivedStaff",
                param,
                (draft) => {
                  draft.enabled = data.enabled;
                }
              )
            );
            // notification.success({
            //   message: "Success",
            //   description: "Successfully updated status",
            // });
            toast("Successfully updated status");
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

    archiveStaff: builder.mutation<Staff, { id: string; reason: string }>({
      query: (data) => ({
        url: `${STAFF_ENDPOINT.archive}`,
        method: "delete",
        data: data,
        permission: "manage-staffs",
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              staffQuery.util.updateQueryData(
                "getStaffs",
                staffCollection,
                (draft) => {
                  draft.data = draft?.data?.map((provider) => {
                    if (provider.id === arg.id) {
                      return data;
                    } else {
                      return provider;
                    }
                  });
                }
              )
            );
            dispatch(
              staffQuery.util.updateQueryData("getStaff", arg?.id, (draft) => {
                draft.deletedAt = data?.deletedAt;
              })
            );
            dispatch(
              staffQuery.util.updateQueryData(
                "getArchivedStaff",
                arg?.id,
                (draft) => {
                  draft.deletedAt = data?.deletedAt;
                }
              )
            );
            // notification.success({
            //   message: "Success",
            //   description: "Successfully archived",
            // });
            toast("Successfully archived");
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

    deleteStaff: builder.mutation<boolean, string>({
      query: (id: string) => ({
        url: `${STAFF_ENDPOINT.delete}/${id}`,
        method: "delete",
        permission: "manage-staffs",
      }),

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            // notification.success({
            //   message: "Success",
            //   description: "Successfully deleted",
            // });
            toast("Successfully deleted");
            dispatch(
              staffQuery.util.updateQueryData(
                "getStaffs",
                staffCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft.data.filter((staff) => staff.id !== id);
                    draft.count -= 1;
                  }
                }
              )
            );
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

    restoreStaff: builder.mutation<Staff, string>({
      query: (id: string) => ({
        url: `${STAFF_ENDPOINT.restore}/${id}`,
        method: "post",
        permission: "manage-staffs",
      }),

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              staffQuery.util.updateQueryData(
                "getStaffs",
                staffCollection,
                (draft) => {
                  draft.data = draft?.data?.map((provider) => {
                    if (provider.id === id) {
                      return data;
                    } else {
                      return provider;
                    }
                  });
                }
              )
            );
            dispatch(
              staffQuery.util.updateQueryData("getStaff", id, (draft) => {
                draft.deletedAt = data?.deletedAt;
              })
            );
            dispatch(
              staffQuery.util.updateQueryData(
                "getArchivedStaff",
                id,
                (draft) => {
                  draft.deletedAt = data?.deletedAt;
                }
              )
            );
            // notification.success({
            //   message: "Success",
            //   description: "Successfully restored",
            // });
            toast("Successfully restored");
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
    getRolePermissionsList: builder.query<Collection<Permission>, any>({
      query: (data: { roleId: string; collection: CollectionQuery }) => ({
        url: `${STAFF_ENDPOINT.role_permissions_list}/${data.roleId}`,
        method: "GET",
        params: collectionQueryBuilder(data.collection),
      }),
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          rolePermissionsListCollection = param;
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
    getStaffRolePermissions: builder.query<Permission[], any>({
      query: (data: { roleId: string; accountId: string }) => ({
        url: `${STAFF_ENDPOINT.staff_role_permissions}/${data.accountId}/${data.roleId}`,
        method: "GET",
      }),
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          //
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
    addRoleToAccount: builder.mutation<Role[], any>({
      query: (data: any) => ({
        url: `${STAFF_ENDPOINT.add_account_role}`,
        method: "post",
        data: data,
        permission: "manage-account-roles",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              staffQuery.util.updateQueryData(
                "getStaffRoles",
                param.accountId,
                (draft) => {
                  if (data) {
                    const combinedArray = [...data, ...draft.data];
                    const uniqueIds = new Set();
                    const uniqueArray = combinedArray.filter((obj) => {
                      if (!uniqueIds.has(obj.id)) {
                        uniqueIds.add(obj.id);
                        return true;
                      }
                      return false;
                    });
                    draft.data = uniqueArray;
                    draft.count += data.length;
                  }
                }
              )
            );
            // notification.success({
            //   message: "Success",
            //   description: "Successfully assigned",
            // });
            toast("Successfully assigned");
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
    addAccountRolePermissions: builder.mutation<any, any>({
      query: (data: any) => ({
        url: `${STAFF_ENDPOINT.add_account_role_permission}`,
        method: "post",
        data: data,
        permission: "manage-account-permissions",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              staffQuery.util.updateQueryData(
                "getStaffRolePermissions",
                { roleId: param.roleId, accountId: param.accountId },
                (draft) => {
                  if (data) {
                    draft = draft.concat(data);
                  }
                }
              )
            );
            // notification.success({
            //   message: "Success",
            //   description: "Permission Successfully assigned",
            // });
            toast("Permission Successfully assigned");
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
    removeAccountRole: builder.mutation<any, any>({
      query: (data: { roleId: string; accountId: string }) => ({
        url: `${STAFF_ENDPOINT.remove_account_role}`,
        method: "DELETE",
        data: data,
        permission: "manage-account-roles",
      }),
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data) {
            dispatch(
              staffQuery.util.updateQueryData(
                "getStaffRoles",
                param.accountId,
                (draft) => {
                  if (data) {
                    draft.data = draft.data.filter(
                      (role) => role?.id !== param?.roleId
                    );
                    draft.count -= 1;
                  }
                }
              )
            );

            {
              rolePermissionsListCollection.roleId === param.roleId &&
                dispatch(
                  staffQuery.util.updateQueryData(
                    "getRolePermissionsList",
                    rolePermissionsListCollection,
                    (draft) => {
                      const emptyData: any[] = [];
                      draft.data = emptyData;
                      draft.data.length = 0;
                    }
                  )
                );
            }

            // notification.success({
            //   message: "success",
            //   description: "Successfully removed",
            // });
            toast(" Successfully removed");
          }
        } catch (error: any) {
          // notification.error({
          //   message: "error",
          //   description: "error try again",
          // });
          toast("Error try again");
        }
      },
    }),
    resetStaffPassword: builder.mutation<any, any>({
      query: (data: any) => ({
        url: `${STAFF_ENDPOINT.reset_staff_password}`,
        method: "POST",
        data: data,
      }),
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // notification.success({
          //   message: "success",
          //   description: "Password reseted successfully",
          // });
          toast("Password reseted successfully");
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
    checkSecurity: builder.mutation<boolean, { password: string }>({
      query: (newData: any) => ({
        url: `${STAFF_ENDPOINT.securiy_check}`,
        method: "post",
        data: newData,
        permission: "manage-staffs",
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
        }
      },
    }),
  }),
  overrideExisting: true,
});
export const {
  useLazyGetStaffQuery,
  useLazyGetArchivedStaffQuery,
  useLazyGetStaffsQuery,
  useLazyGetArchivedStaffsQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useUpdateStaffProfileMutation,
  useArchiveStaffMutation,
  useActivateStaffMutation,
  useRestoreStaffMutation,
  useDeleteStaffMutation,
  useLazyGetRolesQuery,
  useLazyGetStaffRolesQuery,
  useLazyGetRolePermissionsListQuery,
  useAddRoleToAccountMutation,
  useLazyGetStaffRolePermissionsQuery,
  useAddAccountRolePermissionsMutation,
  useRemoveAccountRoleMutation,
  useResetStaffPasswordMutation,
  useCheckSecurityMutation,
} = staffQuery;
