import ServerEntityList from "@/components/common/entity-list/server-entity-list";
import { serverCollectionQueryBuilder } from "@/utility/collection-builder/server-collection-query-builder";
import { fetchData } from "@/utility/fetchData";

export async function getStaffs(
  searchParams: Record<string, string | string[] | undefined>
) {
  const params: Record<string, any> = {
    skip: 0,
    top: 10,
  };

  // // Dynamically add params if they exist in searchParams
  // if (searchParams?.search) params.search = searchParams.search.toString();
  // if (searchParams?.orderBy) params.orderBy = searchParams.orderBy.toString();
  // if (searchParams?.direction)
  //   params.direction = searchParams.direction.toString();

  // if (searchParams?.searchFrom) {
  //   const searchFrom =
  //     typeof searchParams.searchFrom === "string"
  //       ? searchParams.searchFrom.split(",")
  //       : Array.isArray(searchParams.searchFrom)
  //       ? searchParams.searchFrom
  //       : [searchParams.searchFrom.toString()];

  //   searchFrom.forEach((field, index) => {
  //     params[`searchFrom[${index}]`] = field;
  //   });
  // }

  console.log("params", params);
  return fetchData<{ data: any[]; count: number }>(
    "/users/get-users",
    serverCollectionQueryBuilder(searchParams)
  );
}

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const staffs = await getStaffs(searchParams);
  console.log("searchParams", await searchParams);
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
