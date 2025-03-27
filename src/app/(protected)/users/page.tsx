"use server";
import ServerEntityList from "@/components/common/entity-list/server-entity-list";
import UserFilterComponent from "@/components/server-query-param/filter/user-filter";
import { serverCollectionQueryBuilder } from "@/utility/collection-builder/server-collection-query-builder";
import { fetchData } from "@/utility/fetchData";
import dateFormat from "dateformat";
import { CheckIcon, MinusIcon } from "lucide-react";

export async function getStaffs(searchParams: Record<string, string>) {
  const params = new URLSearchParams();
  params.set("skip", "0");
  params.set("top", "10");

  // Convert searchParams object into URLSearchParams format
  Object.entries(searchParams).forEach(([key, value]) => {
    params.set(key, value);
  });

  console.log("updated2222:", params);
  return fetchData<{ data: any[]; count: number }>("/users/get-users", params);
}

export default async function StaffPage(props: { searchParams?: any }) {
  const searchParams = (await props.searchParams) ?? new URLSearchParams();
  const staffs = await getStaffs(searchParams);
  // console.log("searchParams", searchParams);
  console.log("staffs", staffs);

  return (
    <ServerEntityList
      config={{
        rootUrl: "/users",
        selectable: false,
        columns: [
          { key: "name", name: "Full Name" },
          { key: "email", name: "Email", hideSort: true },
          { key: "gender", name: "Gender", hideSort: true },
          {
            key: "createdAt",
            name: "Registered At",
            render: (staff) =>
              dateFormat(staff.createdAt, "ddd, mmm d, yyyy, h:MM TT"),
          },
          {
            key: "enabled",
            name: "Status",
            render: (staff) =>
              staff.enabled ? (
                <CheckIcon className="h-5 w-5 text-green-500" />
              ) : (
                <MinusIcon className="h-5 w-5 text-red-500" />
              ),
          },
        ],
      }}
      items={staffs.data}
      total={staffs.count}
      showNewButton={true}
      newButtonText="Add User"
      title="Users"
      searchFrom={["name", "phoneNumber"]}
      filterComponent={<UserFilterComponent />}
    />
  );
}
