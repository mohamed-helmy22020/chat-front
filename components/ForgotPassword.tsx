"use client";

import { resetPassword, sendResetCode } from "@/lib/actions/user.actions";
import { convertErrors } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiLoader } from "react-icons/fi";
import { IoAlertCircleSharp } from "react-icons/io5";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import CustomInput from "./CustomInput";
import { Alert, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { Form } from "./ui/form";

const ForgotPassword = () => {
  const tError = useTranslations("Errors");
  const t = useTranslations("Auth");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [state, setState] = useState<"CodeSent" | "PasswordChanged" | "">("");

  const formSchema = z.object({
    email: z.string().email({ message: tError("InvalidEmail") }),
    code: z.string().min(6, tError("ShortCode")),
    password: z.string().min(10, tError("ShortPassword")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError("");

    try {
      if (!data.email || !data.code) {
        setError("FillAllFields");
        return;
      }

      const response: any = await resetPassword(
        data.email,
        data.code,
        data.password,
      );
      if (!response.success) {
        throw new Error(response.error.msg);
      }
      setState("PasswordChanged");
    } catch (error: any) {
      setError(convertErrors(error.message));
    } finally {
      setIsLoading(false);
    }
  }

  const handleSendCode = async () => {
    const email = form.getValues("email");
    if (!email) {
      setError("FillAllFields");
      return;
    }
    setError("");
    setIsLoading(true);
    const sendResetCodeRes = await sendResetCode(email);
    setIsLoading(false);
    if (!sendResetCodeRes.success) {
      setError(convertErrors(sendResetCodeRes.error.msg));
      return;
    }
    setState("CodeSent");
  };
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
              {t("ForgotPasswordTitle")}
            </h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <CustomInput
                  control={form.control}
                  name="email"
                  label={t("Email")}
                  placeholder={t("EnterEmail")}
                  type="email"
                />
                {state === "CodeSent" && (
                  <>
                    <CustomInput
                      control={form.control}
                      name="code"
                      label={t("Code")}
                      placeholder={t("EnterResetCode")}
                      type="text"
                    />
                    <CustomInput
                      control={form.control}
                      name="password"
                      label={t("Password")}
                      placeholder={t("EnterPassword")}
                      type="password"
                    />
                  </>
                )}

                {error && (
                  <Alert variant="destructive">
                    <IoAlertCircleSharp />
                    <AlertTitle>{tError(error)}</AlertTitle>
                  </Alert>
                )}
                {state && !isLoading && !error && (
                  <Alert variant="default" className="bg-green-700">
                    <IoAlertCircleSharp />
                    <AlertTitle>{t(state)}</AlertTitle>
                  </Alert>
                )}

                <div className="flex flex-col">
                  {state === "" && (
                    <Button
                      type="button"
                      variant="main"
                      onClick={handleSendCode}
                      className="cursor-pointer hover:opacity-90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <FiLoader size={20} className="animate-spin" />
                          &nbsp;{t("Loading")}
                        </>
                      ) : (
                        t("SendCode")
                      )}
                    </Button>
                  )}
                  {state === "CodeSent" && (
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
                      ) : (
                        t("ResetPassword")
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
            <footer className="flex items-center gap-1">
              <div className="flex w-full justify-between gap-1">
                <Link
                  href="/sign-in"
                  className="form-link py-2 text-sm text-blue-600 hover:underline dark:text-blue-500"
                >
                  {t("SignIn")}
                </Link>
                <Link
                  href="/sign-up"
                  className="form-link py-2 text-sm text-blue-600 hover:underline dark:text-blue-500"
                >
                  {t("SignUp")}
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

export default ForgotPassword;
