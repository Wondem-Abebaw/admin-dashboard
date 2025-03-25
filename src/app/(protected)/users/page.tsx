import ServerEntityList from "@/components/common/entity-list/server-entity-list";
import { serverCollectionQueryBuilder } from "@/utility/collection-builder/server-collection-query-builder";
import { fetchData } from "@/utility/fetchData";
import { orderBy } from "lodash-es";

export async function getStaffs(
  searchParams: Record<string, string | string[] | undefined>
) {
  const params: Record<string, any> = {
    skip: searchParams.skip ? Number(searchParams.skip) : 0,
    top: searchParams.top ? Number(searchParams.top) : 10,
    // orderBy: searchParams.orderBy ?? [
    //   { field: "createdAt", direction: "desc" },
    // ],
    ...searchParams, // Merge existing params
  };

  console.log("params", params);

  return fetchData<{ data: any[]; count: number }>(
    "/users/get-users",
    serverCollectionQueryBuilder(params)
  );
}

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const staffs = await getStaffs(searchParams);
  console.log("searchParams", searchParams);
  console.log("staffs", staffs);

  return (
    <ServerEntityList
      config={{
        rootUrl: "/users",
        selectable: false,
        columns: [
          { key: "name", name: "Full Name" },
          { key: "email", name: "Email", hideSort: true },
          {
            key: "createdAt",
            name: "Registered At",
            render: (staff) => new Date(staff.createdAt).toLocaleDateString(),
          },
        ],
      }}
      items={staffs.data}
      total={staffs.count}
      showNewButton={true}
      newButtonText="Add User"
      title="Users"
      searchFrom={["name", "phoneNumber"]}
    />
  );
}
