"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { User } from "@/models/user.model";
import { setLoading, setRole } from "@/store/slice/auth-slice/auth-slice";
import { userInfo } from "@/components/auth/api/auth.api";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import js-cookie for cookie management

interface Account {
  email: string;
  phoneNumber?: string;
  password: string;
  type?: string;
}

const userDefault: User = {
  name: "",
  title: "",
  birthDate: "",
  phoneNumber: "",
  email: "",
  companyName: "",
  profileImage: undefined,
  emergencyContact: undefined,
  gender: "",
  enabled: false,
  address: {
    country: "",
    city: "",
    subCity: "",
    woreda: "",
    houseNumber: "",
  },
};

const AuthContext = React.createContext({
  user: userDefault,
  authenticated: false,
  login: (account: Account) => {},
  logOut: () => {},
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [loggingOut, setLoggingOut] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter(); // Changed to useRouter
  const [context, setContext] = useState({
    user: userDefault,
    authenticated: false,
    login: Login,
    logOut: logOut,
  });

  // Login function
  async function Login(account: Account) {
    const data = await userInfo(account);
    if (data?.id) {
      setContext({ ...context, user: data, authenticated: true });
      router.push("/staffs"); // Changed navigate to router.push
    }
  }

  // Log out function
  async function logOut() {
    dispatch(setLoading(true));

    // Assuming `useLogOutMutation` is handled via an API
    const accessToken = Cookies.get("accessToken"); // Get token from cookies
    if (accessToken) {
      // Call API for logout using the access token
      // Replace `useLogOutMutation()` with your API logout logic
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((response) => {
        if (response.ok) {
          // Remove cookies upon successful logout
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          Cookies.remove("userInfo");
          Cookies.remove("currentRole");
          Cookies.remove("userRolePermissions");
          setContext({ ...context, user: userDefault, authenticated: false });
          dispatch(setRole(null));
          dispatch(setLoading(false));
          router.push("/login");
        }
      });
    }
  }

  useEffect(() => {
    const userInfoFromCookies = Cookies.get("userInfo");
    if (userInfoFromCookies) {
      setContext({
        user: JSON.parse(userInfoFromCookies),
        authenticated: true,
        login: Login,
        logOut: logOut,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
