"use client";
import { Permission } from "@/models/permission.model";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie"; // Import js-cookie for cookie management

// Refresh token logic using cookies
const refreshToken = async () => {
  const config: AxiosRequestConfig = {
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
    method: "post",
    headers: {
      "x-refresh-token": Cookies.get("refreshToken") || "", // Get refresh token from cookies
    },
  };
  try {
    const { data } = await axios(config);
    Cookies.set("accessToken", data?.accessToken, { expires: 7 }); // Save the new access token to cookies
  } catch (error) {
    const err = error as AxiosError;
    if (err.response?.status === 401) {
      // Clear cookies and redirect to login if refresh fails
      Cookies.remove("refreshToken");
      Cookies.remove("accessToken");
      Cookies.remove("userInfo");
      window.location.href = `${window.location.origin}/login`;
    }
  }
};

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      headers?: AxiosRequestConfig["headers"];
      params?: AxiosRequestConfig["params"];
      responseType?: AxiosRequestConfig["responseType"];
      permission?: string;
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, permission, headers, responseType }) => {
    try {
      let grant = false;
      const permissions = Cookies.get("userRolePermissions"); // Get user role permissions from cookies
      const currentRole = Cookies.get("currentRole"); // Get current role from cookies
      if (
        currentRole &&
        !(
          url.includes("get-user-roles") ||
          url.includes("get-user-permissions-by-role-id")
        ) &&
        JSON.parse(currentRole)?.key !== "super_admin"
      ) {
        if (permission && permissions && JSON.parse(permissions)?.length > 0) {
          JSON.parse(permissions)?.forEach((element: Permission) => {
            if (element.key === `${permission}`) {
              grant = true;
            }
          });

          if (!grant) {
            return {
              error: {
                status: 403,
                data: { message: `You don't have ${permission} permission ` },
              },
            };
          }
        }
      }

      const config: AxiosRequestConfig = {
        url: baseUrl + url,
        method: method,
        data: data,
        params: params,
        responseType: responseType,
        headers: {
          ...headers,
          Authorization: `Bearer ${Cookies.get("accessToken") || ""}`, // Get access token from cookies
        },
      };

      const result = await axios(config);
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      if (err.response?.status === 401) {
        // Try to get a new token and retry the request
        await refreshToken();
        const result = await axios({
          ...err.config,
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken") || ""}`, // Use new access token from cookies
            "Content-Type": "application/json",
          },
        });
        return { data: result.data };
      }
      return {
        error: { status: err.response?.status, data: err.response?.data },
      };
    }
  };
