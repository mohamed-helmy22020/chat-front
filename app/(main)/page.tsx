import HomePage from "@/components/HomePage";
import LandingPage from "@/components/LandingPage";
import Navbar from "@/components/Navbar";
import { getUserData } from "@/lib/actions/user.actions";

export default async function Home() {
  const getUserRes = await getUserData();
  if (getUserRes.success) {
    return <HomePage />;
  }
  return (
    <>
      <Navbar />
      <div>
        <LandingPage />
      </div>
    </>
  );
}
