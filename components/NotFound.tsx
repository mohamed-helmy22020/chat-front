"use client";
import animationData from "@/public/icons/animated-icons/404-animation.json";
import dynamic from "next/dynamic";
import Link from "next/link";
import LoaderComponent from "./LoaderComponent";
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <LoaderComponent />,
});

const NotFound = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-site-background transition-all">
      {/* Lottie Animation */}
      <div className="w-full max-w-lg p-4">
        <Lottie loop animationData={animationData} className="h-80 w-full" />
      </div>

      {/* 404 Text */}
      <h1 className="mt-4 text-4xl font-bold text-gray-800 dark:text-gray-100">
        Oops! Page not found
      </h1>
      <p className="mt-2 text-center text-gray-600 dark:text-gray-300">
        It looks like you got lost. Don’t worry, we’ll help you get back on
        track.
      </p>

      {/* Go Home Button */}
      <Link
        href="/"
        className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white shadow transition hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
