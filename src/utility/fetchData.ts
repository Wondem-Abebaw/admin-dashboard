import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";

// Refresh token logic to handle token expiry
const refreshToken = async () => {
  const config: AxiosRequestConfig = {
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
    method: "post",
    headers: {
      "x-refresh-token": (await cookies()).get("refreshToken")?.value || "", // Get refresh token from cookies
    },
  };
  try {
    const { data } = await axios(config);
    // Save the new access token to cookies
    (await cookies()).set("accessToken", data?.accessToken, { expires: 7 });
  } catch (error) {
    console.error("Error refreshing token:", error);
    // Handle refresh token failure (logout or redirect)
    (await cookies()).remove("accessToken");
    (await cookies()).remove("refreshToken");
    (await cookies()).remove("userInfo");
    window.location.href = "/login"; // Redirect to login page
  }
};

export async function fetchData<T>(
  endpoint: string,
  params?: Record<string, any>,
  options?: AxiosRequestConfig
): Promise<T> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) throw new Error("API Base URL is missing.");

    const cookieStore = await cookies(); // Ensure cookies are fetched asynchronously
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      throw new Error("Access token is missing or expired.");
    }

    // Construct query string from params
    const queryString = params ? new URLSearchParams(params).toString() : "";
    const url = `${baseUrl}${endpoint}${queryString ? `?${queryString}` : ""}`;

    console.log("Fetching data from:", url);
    console.log("Query params:", queryString);
    console.log("Access Token:", accessToken);

    const config: AxiosRequestConfig = {
      url: url,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      ...options, // Include any other options passed to the function
    };

    const response = await axios(config);

    console.log("Response Data:", response.data);

    return response.data; // ✅ Return the response data
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error in fetchData:", err);

    // If the error is due to an expired token (401), refresh the token
    if (err.response?.status === 401) {
      await refreshToken();
      // Retry the request with the new access token
      const retryConfig = {
        ...err.config,
        headers: {
          ...err.config.headers,
          Authorization: `Bearer ${
            (await cookies()).get("accessToken")?.value || ""
          }`,
        },
      };
      const retryResponse = await axios(retryConfig);
      return retryResponse.data;
    }

    throw new Error(`Failed to fetch data: ${err.message}`);
  }
}
