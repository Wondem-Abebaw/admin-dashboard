"use client";
import React from "react";
import StaffListPage from "../page";
import NewStaffComponent from "./staff-form";

export default function NewStaffPage() {
  return (
    <StaffListPage>
      <NewStaffComponent editMode="new" />
    </StaffListPage>
  );
}
