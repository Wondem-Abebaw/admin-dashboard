import axios from "axios";
import { store } from "../../../store/app.store";
import { setLoading } from "../../../store/slice/auth-slice/auth-slice";
import { toast } from "sonner";
import Cookies from "js-cookie"; // Import js-cookie for cookie management

export let loading = false;

async function getAccessToken(account: any) {
  store.dispatch(setLoading(true));
  await axios
    .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, account)
    .then((response: any) => {
      // Store tokens in cookies
      Cookies.set("accessToken", response.data?.accessToken, { expires: 7 });
      Cookies.set("refreshToken", response.data?.refreshToken, { expires: 7 });
      return response.data?.accessToken;
    })
    .catch(function (error: any) {
      store.dispatch(setLoading(false));
      if (error.response) {
        toast(`${error.response?.data?.message ?? "Error"}`);
      } else if (error.request) {
        toast("Check your internet connection");
      } else {
        console.log("Error", error.message);
      }
    });
}

export async function userInfo(account: any) {
  store.dispatch(setLoading(true));
  await getAccessToken(account);

  return axios
    .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/get-user-info`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken") || ""}`, // Retrieve token from cookies
      },
    })
    .then((response) => {
      store.dispatch(setLoading(false));
      // Store user info in cookies
      Cookies.set("userInfo", JSON.stringify(response.data), { path: "" });
      console.log("userInfoData", response.data);
      return response.data;
    })
    .catch(function (error) {
      store.dispatch(setLoading(false));
      if (error.response) {
        // Handle response error
      } else if (error.request) {
        toast("Check your internet connection");
      } else {
        console.log("Error", error.message);
      }
    });
}

export async function switchRole(roleId: string) {
  return axios
    .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/switch-role/${roleId}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken") || ""}`, // Retrieve token from cookies
      },
    })
    .then((response: any) => {
      // Store new tokens and data in cookies
      Cookies.set("accessToken", response.data?.accessToken, { expires: 7 });
      Cookies.set("refreshToken", response.data?.refreshToken, { expires: 7 });
      Cookies.set("currentRole", JSON.stringify(response?.data?.currentRole), {
        path: "",
      });
      Cookies.set(
        "userRolePermissions",
        JSON.stringify(response?.data?.permissions),
        { path: "" }
      );
      return response.data;
    })
    .catch(function (error) {
      if (error.response) {
        // Handle response error
      } else if (error.request) {
        toast("Check your internet connection");
      } else {
        console.log("Error", error.message);
      }
    });
}
