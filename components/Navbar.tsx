import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="navbar sticky top-0 z-10 w-full backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <span className="bg-gradient-to-r from-mainColor-500 to-mainColor-700 bg-clip-text text-2xl font-bold text-transparent">
                  Chat App
                </span>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/sign-up"
              className="rounded-md bg-mainColor-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-mainColor-700"
            >
              Sign up
            </Link>
            <Link
              href="/sign-in"
              className="rounded-md px-4 py-2 text-sm font-medium text-mainColor-600 transition hover:bg-gray-200 dark:hover:bg-slate-700"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
