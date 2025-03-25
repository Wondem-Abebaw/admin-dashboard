"use client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie"; // Import js-cookie for cookie management

export interface Theme {
  class: string;
}

const initialState: Theme = {
  class:
    // Retrieve theme from cookies instead of localStorage
    Cookies.get("theme") || "light", // Default to 'light' if no theme is found
};

export const themeSlice = createSlice({
  name: "locale",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<string>): void => {
      state.class = action.payload;
      // Store the theme in cookies when set
      Cookies.set("theme", action.payload); // Save theme to cookies
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
