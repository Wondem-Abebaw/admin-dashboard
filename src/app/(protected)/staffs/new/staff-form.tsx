"use client";
import { Staff } from "@/models/staff.model";
import {
  useActivateStaffMutation,
  useArchiveStaffMutation,
  useCreateStaffMutation,
  useDeleteStaffMutation,
  useLazyGetArchivedStaffQuery,
  useLazyGetStaffQuery,
  useResetStaffPasswordMutation,
  useRestoreStaffMutation,
  useUpdateStaffMutation,
  useUpdateStaffProfileMutation,
} from "@/rtk-query/staff/staff.query";
import { downloadUrlParser } from "@/utility/Tools/tools";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { Loader2, Trash2, Save, RefreshCw } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";
import * as yup from "yup";
import { InputWrapper } from "@/components/common/input-wrapper/input-wrapper";
import { ActivityLogWrapperComponent } from "@/components/common/ActivityLog/activityLog-wrapper-component";
import Spinner from "@/components/common/spinner/spinner";
import { yupResolver } from "@hookform/resolvers/yup";

interface Props {
  editMode: "new" | "detail";
}

export default function NewStaffComponent({ editMode }: Props) {
  const nameRegEx =
    /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s'\-]*)$/gi;
  const schema = yup
    .object<Staff>({
      firstName: yup
        .string()
        .required("First Name is required")
        .min(2, "First Name should have at least 2 characters")
        .max(40, "First Name should not be more than 40 characters")
        .matches(nameRegEx, "Remove invalid characters"),
      middleName: yup
        .string()
        .required("Middle Name is required")
        .min(2, "Middle Name should have at least 2 characters")
        .max(40, "Middle Name should not be more than 40 characters")
        .matches(nameRegEx, "Remove invalid characters"),
      lastName: yup
        .string()
        .optional()
        .min(2, "Last Name should have at least 2 characters")
        .max(40, "Last Name should not be more than 40 characters")
        .matches(nameRegEx, "Remove invalid characters"),
      email: yup
        .string()
        .email("Not valid email")
        .test(
          "valid-email",
          "Not valid email",
          (value) => value?.includes("@") && value?.includes(".")
        )
        .required("Email is required"),
      phoneNumber: yup
        .string()
        .test("len", "Phone number must be at least 10 digits", (val) => {
          if (!val) return false;
          const numberWithoutCountryCode = val.substring(4);
          return numberWithoutCountryCode.replace(/[^0-9]/g, "").length === 9; // Checking if the length is exactly 9
        })
        .required("Phone number is required"),
      gender: yup
        .string()
        .oneOf(["male", "female"], "Please select a gender")
        .required("You should have to select gender"),

      address: yup.object({
        city: yup.string().required("City is required"),
        subCity: yup.string().nullable(),
        kebele: yup.string().nullable(),
        woreda: yup.string().required("Woreda/Kebele is required"),
        streetAddress: yup.string().nullable(),
      }),
      emergencyContact: yup.object({
        phoneNumber: yup
          .string()
          .test("len", "Phone number must be at least 10 digits", (val) => {
            if (!val) return false;
            const numberWithoutCountryCode = val.substring(4);
            return numberWithoutCountryCode.replace(/[^0-9]/g, "").length === 9; // Checking if the length is exactly 9
          })
          .required("Phone number is required"),
        name: yup
          .string()
          .required("Emergency contact name is required")
          .test(
            "min-length",
            "Full Name should have at least 5 characters",
            (value: any) => {
              if (!value || value.length === 0) return true; // attachment is optional
              return value.trim().length >= 5;
            }
          )
          .max(100, "Full Name should not be more than 100 characters")
          .matches(nameRegEx, "Remove invalid characters"),
      }),
      verified: yup.boolean().default(false),
    })
    .required();

  const defaultValue: Staff = {
    id: "",
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    emergencyContact: {
      phoneNumber: "",
      name: "",
    },
  };
  const params = useParams();
  //   const { toast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Staff>({
    defaultValues: defaultValue,
    resolver: yupResolver<any>(schema),
    mode: "onBlur",
  });

  const [createStaff, createResponse] = useCreateStaffMutation();
  const [updateStaff, updateResponse] = useUpdateStaffMutation();
  const [getStaff, mystaff] = useLazyGetStaffQuery();

  const [staff, setStaff] = useState<any>();

  function onSubmit(data: Staff) {
    if (editMode === "new") {
      createStaff(data).then((response: any) => {
        if (response?.data) {
          reset();
          //   toast({
          //     title: "Success",
          //     description: "Staff created successfully.",
          //   });
        }
      });
    } else {
      updateStaff({ ...data, id: `${params.id}` });
    }
  }

  useEffect(() => {
    if (editMode === "detail" && params.id) {
      getStaff(params.id).then((response) => {
        if (response?.data) {
          reset(response.data);
          setStaff(response);
        }
      });
    }
  }, [editMode, params.id, getStaff]);

  return (
    <>
      {" "}
      <ActivityLogWrapperComponent
        title={editMode === "detail" ? staff?.data?.name : "New Staff"}
        item={staff}
        path={`/staffs/edit/${params?.type}/${params.id}`}
        id={params.id ?? ""}
      >
        <Spinner
          loading={
            mystaff?.isLoading || mystaff?.isFetching
            // archiveStaffResponse?.isLoading ||
            // archiveStaffResponse?.isFetching
          }
        >
          <Card>
            <CardContent>
              <Tabs defaultValue="main">
                <TabsList>
                  <TabsTrigger value="main">Main</TabsTrigger>
                  {editMode === "detail" && (
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                  )}
                </TabsList>
                <TabsContent value="main">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                          <InputWrapper
                            label="First Name"
                            error={errors?.firstName?.message}
                          >
                            <Input placeholder="John" {...field} />
                          </InputWrapper>
                        )}
                      />
                      <Controller
                        name="middleName"
                        control={control}
                        render={({ field }) => (
                          <InputWrapper
                            label="Middle Name"
                            error={errors?.middleName?.message}
                          >
                            <Input placeholder="Doe" {...field} />
                          </InputWrapper>
                        )}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => reset()}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" /> Reset
                      </Button>
                      <Button
                        type="submit"
                        variant="default"
                        disabled={
                          createResponse?.isLoading || updateResponse?.isLoading
                        }
                      >
                        {createResponse?.isLoading ||
                        updateResponse?.isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="mr-2 h-4 w-4" />
                        )}
                        {editMode === "new" ? "Save" : "Update"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                {editMode === "detail" && (
                  <TabsContent value="profile">
                    Profile details here
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </Spinner>
      </ActivityLogWrapperComponent>
    </>
  );
}
