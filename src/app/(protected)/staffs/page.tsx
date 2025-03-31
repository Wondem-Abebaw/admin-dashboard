"use client";

import EntityList from "@/components/common/entity-list/entity-list.component";
import Spinner from "@/components/common/spinner/spinner";
import { CollectionQuery, Order } from "@/models/collection.model";
import { EntityConfig, entityViewMode } from "@/models/entity-config.model";
import { Staff } from "@/models/staff.model";
import {
  useDeleteStaffMutation,
  useLazyGetStaffsQuery,
} from "@/rtk-query/staff/staff.query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import NewStaffComponent from "./new/page";
import NewStaffPage from "./new/page";
import EditStaffPage from "./edit/active/[id]/page";
import { Confirmation } from "@/components/common/confirmation/action-confirmation";
import { Button } from "@/components/ui/button";
import { DeleteIcon } from "lucide-react";
import Cookies from "js-cookie";

interface Props {
  children?: React.ReactNode;
}
export default function StaffListPage({ children }: Props) {
  //react-router-hooks
  const params = useParams();
  // console.log("accToken2", Cookies.get("accessToken"));
  // console.log("refreshToken2", Cookies.get("refreshToken"));
  // console.log("CurrentRole2", Cookies.get("currentRole"));
  //Component states
  const [check, setCheck] = useState(false);
  const [viewMode, setViewMode] = useState<entityViewMode>("list");
  const [collection, setCollection] = useState<CollectionQuery>({
    skip: 0,
    top: 10,
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });

  //Rtk hooks
  const [getStaffs, staffs] = useLazyGetStaffsQuery();
  const [deleteStaff, deleteResponse] = useDeleteStaffMutation();

  const onArchivedChecked = (checked: boolean) => {
    setCollection({ ...collection, withArchived: checked });
  };

  useEffect(() => {
    getStaffs(collection);
  }, [collection]);

  useEffect(() => {
    if (params?.id !== undefined) {
      setViewMode("detail");
    } else {
      setViewMode("list");
    }
  }, [setViewMode, params?.id]);

  const config: EntityConfig<Staff> = {
    primaryColumn: {
      key: "name",
      name: "Full Name",
      hideSort: true,
      render: (staff: Staff) => {
        return (
          <div className="flex items-center space-x-1">
            <span>{`${staff?.firstName ?? ""} ${staff?.middleName ?? ""} ${
              staff?.lastName ?? ""
            }`}</span>
          </div>
        );
      },
    },
    rootUrl: "/staffs",
    identity: "id",
    visibleColumn: [
      {
        key: "name",
        name: "Full Name",
        hideSort: true,
        render: (staff: Staff) => {
          return (
            <div className="flex items-center space-x-1">
              <span
                className={
                  staff.deletedAt && "bg-danger p-1  text-white rounded-lg"
                }
              >
                {`${staff?.firstName ?? ""} ${staff?.middleName ?? ""} ${
                  staff?.lastName ?? ""
                }`}
              </span>
            </div>
          );
        },
      },
      {
        key: "email",
        name: "Email",
        hideSort: true,
      },

      { key: "phoneNumber", name: "Phone", hideSort: true },
      { key: "gender", name: "Gender", hideSort: true },
      {
        key: ["emergencyContact", "phoneNumber"],
        name: "Emergency Contact",
        hideSort: true,
        render: (eachStaff: Staff) => {
          return (
            <div className="flex items-center space-x-1">
              <span>
                {eachStaff?.emergencyContact?.name &&
                  eachStaff?.emergencyContact?.name}
                {eachStaff?.emergencyContact?.phoneNumber &&
                  `(${eachStaff.emergencyContact?.phoneNumber})`}
              </span>
            </div>
          );
        },
      },
      {
        key: "createdAt",
        name: "Registered At",
        isDate: true,
      },

      {
        key: "enabled",
        name: "Status",
      },
      {
        key: "actions",
        name: "Actions",
        render: (staff: Staff) => {
          return (
            <Confirmation
              type={"danger"}
              message={"Are you sure you want to delete it permanently?"}
              onYes={() =>
                deleteStaff(`${params?.id}`).then((response) => {
                  if (response) {
                    // navigate(-1);
                  }
                })
              }
              header={`Permanent Delete Confirmation `}
            >
              <Button
                size={"sm"}
                className={"bg-red-500 text-white flex  items-center"}
                // loading={deleteResponse?.isLoading}
              >
                <DeleteIcon />
              </Button>
            </Confirmation>
          );
        },
      },
    ],
    filter: [
      [
        { field: "gender", value: "male", operator: "=", name: "Male" },
        { field: "gender", value: "female", operator: "=", name: "Female" },
      ],
      [
        { field: "enabled", value: true, operator: "=", name: "Active" },
        { field: "enabled", value: false, operator: "=", name: "InActive" },
      ],
    ],
  };

  const data = staffs?.data?.data;

  return (
    <div className="flex">
      <EntityList
        parentStyle="w-full"
        viewMode={viewMode}
        check={check}
        title={"Staffs"}
        tableKey="staff"
        showSelector={false}
        newButtonText="New Staff"
        total={staffs?.data?.count}
        collectionQuery={collection}
        setCollection={setCollection}
        itemsLoading={staffs?.isLoading || staffs?.isFetching}
        config={config}
        items={data}
        initialPage={1}
        onShowArchived={(e) => onArchivedChecked(e)}
        defaultPageSize={collection.top}
        pageSize={[10, 20, 50]}
        onShowSelector={(e) => setCheck(e)}
        onPaginationChange={(skip: number, top: number) => {
          // const after = (skip - 1) * top;
          setCollection({ ...collection, skip: skip, top: top });
        }}
        onSearch={(data: any) => {
          if (data === "") {
            setCollection({
              ...collection,
              search: "",
              searchFrom: [],
            });
          } else {
            setCollection({
              ...collection,
              skip: 0,
              search: data,
              searchFrom: [
                "firstName",
                "middleName",
                "lastName",
                "phoneNumber",
              ],
            });
          }
        }}
        onFilterChange={(data: any) => {
          if (collection?.filter || data.length > 0) {
            setCollection({ ...collection, filter: data });
          }
        }}
        onOrder={(data: Order) =>
          setCollection({ ...collection, orderBy: [data] })
        }
      >
        {/* <NewStaffPage /> */}
        {/* <NewStaffComponent editMode="detail" /> */}
      </EntityList>
    </div>
  );
}
