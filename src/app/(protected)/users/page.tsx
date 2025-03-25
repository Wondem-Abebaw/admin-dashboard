import ServerEntityList from "@/components/common/entity-list/server-entity-list";
import { cookies } from "next/headers";

export async function getStaffs(ctx, { orderBy, direction, page }) {
  const cookieStore = await cookies();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // The base URL from env variable
  const url = `/users/get-users?skip=0&top=10`; // Relative URL
  const method = "GET"; // HTTP method for the request

  // Ensure baseUrl is defined
  if (!baseUrl) {
    throw new Error("API Base URL is missing.");
  }

  // Get the access token from cookies

  const accessToken = cookieStore.get("accessToken")?.value;
  console.log("accToken", accessToken);
  // console.log("refreshToken", Cookies.get("refreshToken"));
  // console.log("CurrentRole", Cookies.get("currentRole"));

  if (!accessToken) {
    throw new Error("Access token is missing or expired.");
  }

  const res = await fetch(baseUrl + url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`, // Use the token from cookies
    },
    cache: "no-store", // Disable caching
  });
  console.log("fetchres", res);

  if (!res.ok) {
    throw new Error("Failed to fetch staff data");
  }

  return res.json();
}

export default async function StaffPage({
  searchParams,
}: {
  searchParams: any;
}) {
  const orderBy = searchParams?.orderBy || "name";
  const direction = searchParams?.direction || "asc";
  const page = Number(searchParams?.page) || 1;

  const staffs = await getStaffs(null, { orderBy, direction, page });

  return (
    <ServerEntityList
      config={{
        rootUrl: "/users",
        selectable: false, // Show checkboxes
        columns: [
          { key: "name", name: "Full Name" },
          { key: "email", name: "Email", hideSort: true }, // No sorting for emails
          {
            key: "createdAt",
            name: "Registered At",
            render: (staff) => new Date(staff.createdAt).toLocaleDateString(),
          },
        ],
      }}
      items={staffs.data}
      total={staffs.total}
      showNewButton={true}
      newButtonText="Add User"
      title="Users"
    />
  );
}
