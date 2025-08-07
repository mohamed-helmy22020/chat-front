// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserData } from "./lib/actions/user.actions";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Only run on login/signup pages
  if (path === "/sign-in" || path === "sign-up") {
    const getUserRes = await getUserData();

    if (getUserRes.success) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}
