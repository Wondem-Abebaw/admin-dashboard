"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/action/auth-action";
import { RootState } from "@/store/app.store";
import { useSelector } from "react-redux";
import * as yup from "yup";
import AuthContext from "@/providers/authContext-provider";
import { Eye, EyeOff, Loader2 } from "lucide-react";
interface Account {
  email: string;
  phoneNumber?: string;
  password: string;
  type?: string;
}
interface Props {
  type: string;
}
export function LoginForm(props: Props) {
  const { login } = useContext(AuthContext);

  const loading = useSelector((state: RootState) => state.authReducer.loading);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const schema = yup
    .object({
      // email: yup.string().email().required("Email is required"),
      // .test('len', 'Invalid phone number length', (val) => {
      //   if (!val) return false;
      //   const numberWithoutCountryCode = val.substring(4);
      //   return numberWithoutCountryCode.replace(/[^0-9]/g, '').length === 9; // Checking if the length is exactly 9
      // }),
      password: yup
        .string()
        .min(6, "Password length must be at least 6 characters")
        .max(25, "Password length must be 25 and less")
        .required("Enter password"),
    })
    .required();

  const {
    handleSubmit,
    control,
    getValues,
    register,
    formState: { errors },
  } = useForm<Account>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  function onSubmit(data: Account) {
    login({ ...data, type: props.type });
  }

  return (
    <div className={cn("flex flex-col gap-6")} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register("email")}
                />
                {errors.email && <span>{errors.email.message}</span>}
              </div> */}
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone</Label>
                <Input
                  id="phoneNumber"
                  type="phoneNumber"
                  placeholder="+251948261915"
                  required
                  {...register("phoneNumber")}
                />
                {errors.phoneNumber && (
                  <span>{errors.phoneNumber.message}</span>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={() => setPasswordVisible((prev) => !prev)}
                    className="text-sm"
                  >
                    {passwordVisible ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    required
                    {...register("password")}
                  />
                </div>
                {errors.password && <span>{errors.password.message}</span>}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Login"
                )}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              <a
                href="#"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
