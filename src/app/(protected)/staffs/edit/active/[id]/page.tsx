"use client";
import React from "react";
import NewStaffComponent from "../../../new/staff-form";
import StaffListPage from "../../../page";

export default function EditStaffPage() {
  return (
    <StaffListPage>
      <NewStaffComponent editMode="detail" />
    </StaffListPage>
  );
}
