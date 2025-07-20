// pages/404.js

import NotFound from "@/components/NotFound";

export function generateMetadata() {
  return {
    title: "404 - Page Not Found",
    description:
      "The page you are looking for does not exist. Please return to the homepage.",
    robots: "noindex, nofollow",
  };
}

const Custom404 = () => {
  return <NotFound />;
};

export default Custom404;
