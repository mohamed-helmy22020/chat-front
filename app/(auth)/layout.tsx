import Navbar from "@/components/Navbar";
import { getUserData } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const getUserRes = await getUserData();

  if (getUserRes.success) {
    redirect("/");
  }
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
