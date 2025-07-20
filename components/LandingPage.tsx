import Link from "next/link";
import LandingPageFeatures from "./LandingPageFeatures";
import LandingPageHero from "./LandingPageHero";
import LandingPageHIW from "./LandingPageHIW";

const LandingPage = () => {
  return (
    <>
      <LandingPageHero />
      <LandingPageFeatures />
      <LandingPageHIW />
      <section className="bg-gradient-to-r from-mainColor-600 to-mainColor-800 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="mb-6 text-3xl font-bold">
            Ready to Transform Your Communication?
          </h2>
          <p className="mx-auto mb-8 max-w-3xl text-xl">
            Join thousands of happy users who are already enjoying seamless,
            secure messaging with Chat App.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="rounded-lg bg-white px-8 py-3 font-medium text-mainColor-600 shadow-lg transition hover:bg-gray-100"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
