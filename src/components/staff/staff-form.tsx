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
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  Trash2,
  Save,
  RefreshCw,
  RotateCcw,
  Router,
  Archive,
  Key,
  Paintbrush,
} from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";
import * as yup from "yup";
import { InputWrapper } from "@/components/common/input-wrapper/input-wrapper";
import { ActivityLogWrapperComponent } from "@/components/common/ActivityLog/activityLog-wrapper-component";
import Spinner from "@/components/common/spinner/spinner";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { countryJson } from "@/lib/constants/country-json";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { IMaskInput } from "react-imask";
import { cn } from "@/lib/utils";
import {
  addisAbabaSubCities,
  Constants,
  ethiopianCities,
} from "@/lib/constants/constant";
import { Confirmation } from "../common/confirmation/action-confirmation";

interface Props {
  editMode: "new" | "detail";
}
const countryCodes = countryJson.map((country: any) => {
  return { value: country.dial_code, label: country.name };
});
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
  const params = useParams<{ id: string; type: string }>();
  const router = useRouter();

  const [countryCode, setCountryCode] = useState<string>("+251");
  //   const { toast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<Staff>({
    defaultValues: defaultValue,
    resolver: yupResolver<any>(schema),
    mode: "onBlur",
  });
  const selectedCity = watch("address.city");
  const [getStaff, mystaff] = useLazyGetStaffQuery();
  const [getArchivedStaff, archiveStaffResponse] =
    useLazyGetArchivedStaffQuery();
  const [createStaff, createResponse] = useCreateStaffMutation();
  const [updateStaff, updateResponse] = useUpdateStaffMutation();
  const [archiveStaff, archiveResponse] = useArchiveStaffMutation();
  const [restoreStaff, restoreResponse] = useRestoreStaffMutation();
  const [deleteStaff, deleteResponse] = useDeleteStaffMutation();
  const [toogleActivateStaff, toogleActivateResponse] =
    useActivateStaffMutation();
  const [updateStaffProfile, updateProfileResponse] =
    useUpdateStaffProfileMutation();
  const [resetStaffPassword, resetStaffPasswordResponse] =
    useResetStaffPasswordMutation();

  const [staff, setStaff] = useState<any>();

  function onSubmit(data: Staff) {
    if (editMode === "new") {
      createStaff({ ...data, lastName: "Lakew" }).then((response: any) => {
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
    if (editMode === "detail") {
      if (params.type === "active") {
        getStaff(params?.id?.toString() || "").then((response) => {
          if (response?.data) {
            reset(response.data);

            // if (response?.data?.profileImage) {
            //   const pdata = {
            //     originalname: response?.data?.profileImage?.originalname,
            //     path: response?.data?.profileImage?.path,
            //     filename: response?.data?.profileImage?.filename,
            //     mimetype: response?.data?.profileImage?.mimetype,
            //   };

            //   setPreviewProfile(downloadUrlParser(pdata));
            //   // setProfilePic(response.data.profileImage);
            // }
          }
        });
      } else {
        getArchivedStaff(params?.id?.toString() || "").then((response) => {
          if (response?.data) {
            reset(response.data);

            // if (response?.data?.profileImage) {
            //   const pdata = {
            //     originalname: response?.data?.profileImage?.originalname,
            //     path: response?.data?.profileImage?.path,
            //     filename: response?.data?.profileImage?.filename,
            //     mimetype: response?.data?.profileImage?.mimetype,
            //   };
            //   setPreviewProfile(downloadUrlParser(pdata));
            //   // setProfilePic(response.data.profileImage);
            // }
          }
        });
      }
    } else {
      reset(defaultValue);
    }
  }, [params.id, editMode, params.type]);

  return (
    <>
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
                  <Collapsible open={true}>
                    <CollapsibleTrigger>Basic Information</CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="flex flex-col mt-4 lg:flex-row lg:space-x-8 sm:space-y-3 lg:space-y-0">
                        <div className="flex space-x-2 w-full">
                          {" "}
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
                        <div className="flex w-full">
                          {" "}
                          <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                              <InputWrapper
                                label="Email"
                                error={errors?.email?.message}
                              >
                                <Input
                                  placeholder="John@gmail.com"
                                  {...field}
                                  type="email"
                                />
                              </InputWrapper>
                            )}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col mt-4 lg:flex-row lg:space-x-8 sm:space-y-3 lg:space-y-0">
                        <Controller
                          name="phoneNumber"
                          control={control}
                          render={({ field }) => (
                            <InputWrapper
                              label="Phone Number"
                              required
                              error={errors?.phoneNumber?.message}
                              className="w-full"
                            >
                              <div className="flex w-full">
                                {/* Country Code Select */}
                                <Select
                                  onValueChange={(value) =>
                                    setCountryCode(value)
                                  }
                                  defaultValue={countryCode}
                                  disabled
                                >
                                  <SelectTrigger className="w-24 rounded-r-none">
                                    <SelectValue placeholder="Code" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {countryCodes.map(({ value, label }) => (
                                      <SelectItem key={value} value={value}>
                                        {label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <IMaskInput
                                  mask={`${countryCode}000000000`}
                                  placeholder={`${countryCode}999999999`}
                                  {...field}
                                  value={field.value || `${countryCode} `}
                                  onAccept={(value) => field.onChange(value)}
                                  autoComplete="off"
                                  className={cn(
                                    "rounded-l-none border dark:bg-transparent dark:border-black border-gray-300 rounded-r w-full px-2 py-1",
                                    errors?.phoneNumber ? "border-red-500" : ""
                                  )}
                                />
                              </div>
                            </InputWrapper>
                          )}
                        />

                        <Controller
                          name="gender"
                          control={control}
                          render={({ field }) => (
                            <InputWrapper
                              label="Gender"
                              required
                              error={errors?.gender?.message}
                            >
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="male" id="r1" />
                                  <span>Male</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="female" id="r2" />
                                  <span>Female</span>
                                </div>
                              </RadioGroup>
                            </InputWrapper>
                          )}
                        />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  <Collapsible open={true}>
                    <CollapsibleTrigger>Address</CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="flex flex-col mt-4 lg:flex-row lg:space-x-8 sm:space-y-3 lg:space-y-0">
                        <Controller
                          name="address.city"
                          control={control}
                          render={({ field }) => (
                            <InputWrapper
                              label="City"
                              required
                              error={errors?.address?.city?.message}
                            >
                              <Select
                                onValueChange={(value) => field.onChange(value)}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select or enter city" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ethiopianCities.map(({ value, label }) => (
                                    <SelectItem key={value} value={value}>
                                      {label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </InputWrapper>
                          )}
                        />

                        <Controller
                          name="address.subCity"
                          control={control}
                          render={({ field }) => (
                            <InputWrapper
                              label="Sub city"
                              error={errors?.address?.subCity?.message}
                            >
                              {selectedCity === "Addis Ababa" ? (
                                <Select
                                  onValueChange={(value) =>
                                    field.onChange(value)
                                  }
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select sub city" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {addisAbabaSubCities.map(
                                      ({ value, label }) => (
                                        <SelectItem key={value} value={value}>
                                          {label}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Input
                                  placeholder="Enter sub city"
                                  className="w-full"
                                  {...field}
                                />
                              )}
                            </InputWrapper>
                          )}
                        />
                      </div>

                      <div className="flex flex-col mt-4 lg:flex-row lg:space-x-8 sm:space-y-3 lg:space-y-0">
                        <Controller
                          name="address.woreda"
                          control={control}
                          render={({ field }) => (
                            <InputWrapper
                              label="Woreda/Kebele"
                              required
                              error={errors?.address?.woreda?.message}
                            >
                              <Input
                                placeholder="Enter woreda/kebele"
                                className="w-full"
                                {...field}
                              />
                            </InputWrapper>
                          )}
                        />

                        <Controller
                          name="address.specificLocation"
                          control={control}
                          render={({ field }) => (
                            <InputWrapper
                              label="Specific Location"
                              error={errors?.address?.specificLocation?.message}
                            >
                              <Input
                                placeholder="Enter specific location"
                                className="w-full"
                                {...field}
                              />
                            </InputWrapper>
                          )}
                        />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  <Collapsible open={true}>
                    <CollapsibleTrigger>
                      Emergency Contact Information
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="flex flex-col mt-4 lg:flex-row lg:space-x-8 sm:space-y-3 lg:space-y-0">
                        <Controller
                          name="emergencyContact.name"
                          control={control}
                          render={({ field }) => (
                            <InputWrapper
                              label="Full Name"
                              required
                              error={errors?.emergencyContact?.name?.message}
                            >
                              <Input
                                placeholder="John Doe"
                                className="w-full"
                                {...field}
                              />
                            </InputWrapper>
                          )}
                        />
                        <Controller
                          name="emergencyContact.phoneNumber"
                          control={control}
                          render={({ field }) => (
                            <InputWrapper
                              label="Phone Number"
                              required
                              error={
                                errors?.emergencyContact?.phoneNumber?.message
                              }
                              className="w-full"
                            >
                              <div className="flex w-full">
                                {/* Country Code Select */}
                                <Select
                                  onValueChange={(value) =>
                                    setCountryCode(value)
                                  }
                                  defaultValue={countryCode}
                                  disabled
                                >
                                  <SelectTrigger className="w-24 rounded-r-none">
                                    <SelectValue placeholder="Code" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {countryCodes.map(({ value, label }) => (
                                      <SelectItem key={value} value={value}>
                                        {label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <IMaskInput
                                  mask={`${countryCode}000000000`}
                                  placeholder={`${countryCode}999999999`}
                                  {...field}
                                  value={field.value || `${countryCode} `}
                                  onAccept={(value) => field.onChange(value)}
                                  autoComplete="off"
                                  className={cn(
                                    "rounded-l-none border dark:bg-transparent dark:border-black border-gray-300 rounded-r w-full px-2 py-1",
                                    errors?.emergencyContact?.phoneNumber
                                      ? "border-red-500"
                                      : ""
                                  )}
                                />
                              </div>
                            </InputWrapper>
                          )}
                        />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <div className="flex justify-end w-full mt-4 space-x-2">
                    {editMode === "detail" && (
                      <>
                        {(params?.type === "archived" &&
                          archiveStaffResponse?.data?.deletedAt) ||
                        (params?.type === "active" &&
                          mystaff?.data?.deletedAt) ? (
                          <>
                            {/* //////////////restore/////////////////// */}

                            <Confirmation
                              header={"Restore Confirmation"}
                              message={"Are you sure you want to restore it?"}
                              type={"notify"}
                              onYes={() => restoreStaff(`${params?.id}`)}
                            >
                              <Button
                                type="button"
                                className={"bg-green-500"}
                                // loading={restoreResponse?.isLoading}
                              >
                                <RotateCcw /> Restore
                              </Button>
                            </Confirmation>

                            {/* /////////delete permantlt/////////// */}

                            <Confirmation
                              type={"danger"}
                              message={
                                "Are you sure you want to delete it permanently?"
                              }
                              onYes={() =>
                                deleteStaff(`${params?.id}`).then(
                                  (response) => {
                                    if (response) {
                                      router.push("/staffs");
                                    }
                                  }
                                )
                              }
                              header={`Permanent Delete Confirmation `}
                            >
                              <Button
                                type="button"
                                className={
                                  "bg-danger text-white flex  items-center"
                                }
                                // loading={deleteResponse?.isLoading}
                              >
                                <Trash2 /> Delete
                              </Button>
                            </Confirmation>
                          </>
                        ) : (
                          <>
                            {/* -/////////////archive uesr///////////// */}

                            <Confirmation
                              type="danger"
                              header="Archive Confirmation"
                              message={
                                "Are you sure you want to archive this staff?"
                              }
                              result={"single"}
                              resultRequired={true}
                              selectorLabel={"Please select a reason"}
                              labelDescription={
                                "Why are you archiving this staff?"
                              }
                              options={Constants.UserArchiveReason.map(
                                (reason) => {
                                  return { label: reason, value: reason };
                                }
                              )}
                              customInput={true}
                              yesText="Archive"
                              onYes={(data: string) => {
                                archiveStaff({
                                  id: `${params.id}`,
                                  reason: data,
                                });
                              }}
                            >
                              <Button
                                type="button"
                                className="text-white shadow-none bg-danger"

                                // loading={archiveResponse?.isLoading}
                              >
                                <Archive /> Archive
                              </Button>
                            </Confirmation>

                            {/* -/////////////activate uesr///////////// */}

                            <Confirmation
                              header={
                                (mystaff?.data?.enabled ||
                                archiveStaffResponse?.data?.enabled
                                  ? "Deactivate"
                                  : "Activate") + " Confirmation"
                              }
                              message={
                                "Are you sure you want to " +
                                (mystaff?.data?.enabled ||
                                archiveStaffResponse?.data?.enabled
                                  ? "deactivate"
                                  : "activate") +
                                " this staff?"
                              }
                              type={
                                mystaff?.data?.enabled ||
                                archiveStaffResponse?.data?.enabled
                                  ? "danger"
                                  : "notify"
                              }
                              yesText={
                                mystaff?.data?.enabled ||
                                archiveStaffResponse?.data?.enabled
                                  ? "Deactivate"
                                  : "Activate"
                              }
                              onYes={(): void => {
                                toogleActivateStaff(`${params.id?.toString()}`);
                              }}
                            >
                              <Button
                                className={
                                  mystaff?.data?.enabled ||
                                  archiveStaffResponse?.data?.enabled
                                    ? "bg-danger"
                                    : "bg-green-500"
                                }
                                type="button"
                                // loading={toogleActivateResponse?.isLoading}
                              >
                                <span className="h-4 w-">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 fill-current"
                                    viewBox="0 0 48 48"
                                  >
                                    <path d="M23.5 5C17.16639 5 12 10.16639 12 16.5C12 18.130861 12.341389 19.689962 12.957031 21.099609 A 1.50015 1.50015 0 1 0 15.707031 19.900391C15.252673 18.860038 15 17.713139 15 16.5C15 11.78761 18.78761 8 23.5 8C28.21239 8 32 11.78761 32 16.5C32 17.08427 31.94138 17.652314 31.830078 18.201172 A 1.50015 1.50015 0 1 0 34.769531 18.798828C34.92023 18.055686 35 17.28573 35 16.5C35 10.16639 29.83361 5 23.5 5 z M 23.5 12C21.032499 12 19 14.032499 19 16.5L19 25.759766L18.138672 25.404297C14.483804 23.900444 10.334734 26.436466 10.005859 30.375 A 1.50015 1.50015 0 0 0 10.693359 31.765625L19.957031 37.667969C20.601036 38.078718 21.151526 38.620029 21.576172 39.255859L23.033203 41.441406 A 1.50015 1.50015 0 0 0 23.035156 41.441406C23.803886 42.591886 25.189849 43.186167 26.554688 42.945312L31.882812 42.005859C33.603893 41.703285 34.998876 40.422039 35.449219 38.734375 A 1.50015 1.50015 0 0 0 35.451172 38.726562L37.832031 29.576172C38.653863 26.49462 36.64066 23.318721 33.501953 22.748047L28 21.748047L28 16.5C28 14.032499 25.967501 12 23.5 12 z M 23.5 15C24.346499 15 25 15.653501 25 16.5L25 23 A 1.50015 1.50015 0 0 0 26.232422 24.476562L32.964844 25.699219C34.424137 25.964545 35.315668 27.370273 34.933594 28.802734 A 1.50015 1.50015 0 0 0 34.929688 28.8125L32.550781 37.960938C32.399124 38.529274 31.940201 38.949356 31.363281 39.050781 A 1.50015 1.50015 0 0 0 31.363281 39.052734L26.033203 39.992188C25.834042 40.027338 25.642567 39.944908 25.529297 39.775391L24.072266 37.591797C23.417016 36.610136 22.565912 35.77367 21.570312 35.138672 A 1.50015 1.50015 0 0 0 21.568359 35.138672L13.251953 29.835938C13.814585 28.352335 15.413607 27.528548 16.996094 28.179688L19.929688 29.386719 A 1.50015 1.50015 0 0 0 22 28L22 16.5C22 15.653501 22.653501 15 23.5 15 z" />
                                  </svg>
                                </span>
                                {mystaff?.data?.enabled ||
                                archiveStaffResponse?.data?.enabled
                                  ? "Deactivate"
                                  : "Activate"}
                              </Button>
                            </Confirmation>

                            {mystaff?.data?.enabled && (
                              <Confirmation
                                type={"danger"}
                                message={
                                  "Are you sure you want to reset this staff's password?"
                                }
                                onYes={() =>
                                  resetStaffPassword({
                                    phoneNumber: mystaff?.data?.phoneNumber,
                                    type: "employee",
                                  })
                                }
                                header={`Reset Password Confirmation `}
                              >
                                <Button
                                  type="button"
                                  className={
                                    "bg-danger text-white flex  items-center"
                                  }
                                  // loading={
                                  //   resetStaffPasswordResponse?.isLoading
                                  // }
                                >
                                  <Key /> Reset Password
                                </Button>
                              </Confirmation>
                            )}
                          </>
                        )}
                      </>
                    )}

                    {!mystaff?.data?.deletedAt &&
                      !archiveStaffResponse?.data?.deletedAt && (
                        <>
                          {editMode === "new" && (
                            <Button
                              // disabled={
                              //   editMode === "detail" && !mystaff?.data?.enabled
                              // }

                              type="button"
                              onClick={() => reset(defaultValue)}
                            >
                              <Paintbrush /> Reset
                            </Button>
                          )}

                          <Button
                            // disabled={
                            //   editMode === "detail" && !mystaff?.data?.enabled
                            // }

                            className="flex items-center rounded shadow-none bg-primary"
                            type="submit"
                            // loading={
                            //   editMode === "new"
                            //     ? createResponse?.isLoading
                            //     : updateResponse?.isLoading
                            // }
                          >
                            <Save /> {editMode === "new" ? "Save" : "Update"}
                          </Button>
                        </>
                      )}
                  </div>
                </form>
              </TabsContent>
              {editMode === "detail" && (
                <TabsContent value="profile">Profile details here</TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </Spinner>
    </>
  );
}
