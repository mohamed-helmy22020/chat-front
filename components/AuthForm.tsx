"use client";

import { signIn, signUp } from "@/lib/actions/user.actions";
import { convertErrors } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiLoader } from "react-icons/fi";
import { IoAlertCircleSharp } from "react-icons/io5";

import { usePageStore } from "@/store/pageStore";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import CustomInput from "./CustomInput";
import { Alert, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { Form } from "./ui/form";

const AuthForm = ({ type }: { type: "sign-up" | "sign-in" }) => {
  const router = useRouter();
  const tError = useTranslations("Errors");
  const t = useTranslations("Auth");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const setPage = usePageStore((state) => state.setPage);

  const formSchema = z.object({
    //both
    email: z.string().email({ message: tError("InvalidEmail") }),
    password: z.string().min(10, tError("ShortPassword")),

    //sign up
    phone: z.string().optional(),
    fullName: z
      .string()
      .regex(/^[a-zA-Z\s]*$/, {
        message: tError("NameWithNoSpecialChars"),
      })
      .optional(),
    confirmPassword: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phone: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError("");

    try {
      if (type === "sign-up") {
        if (
          !data.fullName ||
          !data.phone ||
          !data.email ||
          !data.password ||
          !data.confirmPassword
        ) {
          setError("FillAllFields");
          return;
        }

        if (data.password !== data.confirmPassword) {
          setError("PasswordsNotMatch");
          return;
        }
        const userData: SignUpDataType = {
          name: data.fullName,
          email: data.email,
          password: data.password,
          phone: data.phone,
        };
        const response: any = await signUp(userData);
        if (!response.success) {
          throw new Error(response.error.msg);
        }
        setPage("chat");
        router.replace("/");
      }
      if (type === "sign-in") {
        const userData: SignInDataType = {
          email: data.email,
          password: data.password,
        };
        const response: any = await signIn(userData);
        if (!response.success) {
          throw new Error(response.error.msg);
        }
        setPage("chat");
        router.replace("/");
      }
    } catch (error: any) {
      setError(convertErrors(error.message));
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className={`mt-16 flex h-full w-full font-lora font-bold`}>
      <section className="relative m-auto flex w-full max-w-md flex-1 items-center shadow-lg transition-all dark:border-gray-600">
        <div className="circle circle-one"></div>
        <div className="form-container flex w-full flex-col gap-1 rounded-md p-8 backdrop-blur-md max-md:gap-3">
          <Image
            src="/imgs/illustration.png"
            fill
            alt="auth-img"
            className="!-end-0.5 !-top-1/3"
          />
          <div className="z-10">
            <h1 className="lg:text-36 mb-10 text-4xl font-semibold dark:text-white">
              {type === "sign-in" ? t("SignIn") : t("SignUp")}
            </h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {type === "sign-up" && (
                  <>
                    <CustomInput
                      control={form.control}
                      name="fullName"
                      label={t("FullName")}
                      placeholder={t("EnterFullName")}
                      type="text"
                    />
                    <CustomInput
                      control={form.control}
                      name="phone"
                      label={t("Phone")}
                      placeholder={t("EnterPhoneNumber")}
                      type="text"
                    />
                  </>
                )}
                <CustomInput
                  control={form.control}
                  name="email"
                  label={t("Email")}
                  placeholder={t("EnterEmail")}
                  type="email"
                />
                <CustomInput
                  control={form.control}
                  name="password"
                  label={t("Password")}
                  placeholder={t("EnterPassword")}
                  type="password"
                />
                {type === "sign-up" && (
                  <CustomInput
                    control={form.control}
                    name="confirmPassword"
                    label={t("ConfirmPassword")}
                    placeholder={t("EnterConfirmPassword")}
                    type="password"
                  />
                )}

                {error && (
                  <Alert variant="destructive">
                    <IoAlertCircleSharp />
                    <AlertTitle>{tError(error)}</AlertTitle>
                  </Alert>
                )}

                <div className="flex flex-col">
                  <div className="flex">
                    <Link
                      href="/forgot-password"
                      className="form-link py-2 text-sm text-blue-600 hover:underline dark:text-blue-500"
                    >
                      {t("ForgotPassword")}
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    variant="main"
                    className="cursor-pointer hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <FiLoader size={20} className="animate-spin" />
                        &nbsp;{t("Loading")}
                      </>
                    ) : type === "sign-in" ? (
                      t("SignIn")
                    ) : (
                      t("SignUp")
                    )}
                  </Button>
                </div>
              </form>
            </Form>
            <footer className="flex items-center justify-center gap-1">
              <div className="mt-4 flex gap-1 text-center text-gray-900 dark:text-gray-300">
                <p className="text-14 font-normal">
                  {type === "sign-in" ? t("NoAccount") : t("HaveAccount")}
                </p>
                <Link
                  href={type === "sign-in" ? "/sign-up" : "/sign-in"}
                  className="form-link cursor-pointer text-blue-500 hover:underline"
                >
                  {type === "sign-in" ? t("SignUp") : t("SignIn")}
                </Link>
              </div>
            </footer>
          </div>
        </div>
        <div className="circle circle-two"></div>
      </section>
    </div>
  );
};

export default AuthForm;
