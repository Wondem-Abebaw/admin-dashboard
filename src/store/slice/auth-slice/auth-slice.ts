"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie"; // Import js-cookie for cookie management

export interface Auth {
  loading: boolean;
  role: any | null;
}

// Function to validate and retrieve role from cookies
const validateJson = () => {
  const currentRole = Cookies.get("currentRole"); // Retrieve role from cookies
  if (currentRole) {
    try {
      return JSON.parse(currentRole); // Parse role if it exists
    } catch (e) {
      Cookies.remove("currentRole"); // Remove invalid role from cookies
      return null;
    }
  }
  return null; // Return null if no role is found
};

const initialState: Auth = {
  loading: false,
  role: validateJson(), // Get role from cookies
};

export const authSlice = createSlice({
  name: "authLoading",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>): void => {
      state.loading = action.payload;
    },
    setRole: (state, action: PayloadAction<any>): void => {
      state.role = action.payload;
      // Store the role in cookies when set
      if (action.payload) {
        Cookies.set("currentRole", JSON.stringify(action.payload));
      } else {
        Cookies.remove("currentRole"); // Remove role from cookies when it's null
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLoading, setRole } = authSlice.actions;
export default authSlice.reducer;
