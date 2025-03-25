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
import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/action/auth-action";
import { RootState } from "@/store/app.store";
import { useSelector } from "react-redux";
import * as yup from "yup";
import AuthContext from "@/providers/authContext-provider";
interface Account {
  email: string;
  password: string;
  type?: string;
}
interface Props {
  type: string;
}
export function LoginForm(props: Props) {
  const { login } = useContext(AuthContext);

  const loading = useSelector((state: RootState) => state.authReducer.loading);
  const schema = yup
    .object({
      email: yup.string().email().required("Email is required"),
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
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register("email")}
                />
                {errors.email && <span>{errors.email.message}</span>}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register("password")}
                />
                {errors.password && <span>{errors.password.message}</span>}
              </div>
              <Button type="submit" className="w-full">
                Login
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
