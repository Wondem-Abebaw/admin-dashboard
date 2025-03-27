import { cookies } from "next/headers";
export async function fetchData<T>(
  endpoint: string,
  params?: Record<string, any>,
  options?: RequestInit
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) throw new Error("API Base URL is missing.");

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    throw new Error("Access token is missing or expired.");
  }

  const queryString = new URLSearchParams(params).toString();
  const url = `${baseUrl}${endpoint}${queryString ? `?${params}` : ""}`;

  console.log("accessToken", accessToken);
  console.log("url", url);
  console.log("queryString", params);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  const data = await response.json(); // ✅ Read response only once

  console.log("response", data); // ✅ Log the parsed JSON, not response.json()

  return data; // ✅ Return the parsed JSON
}
