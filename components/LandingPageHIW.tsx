const LandingPageHIW = () => {
  return (
    <section
      id="how-it-works"
      className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 dark:bg-slate-900"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold">How It Works</h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-600 dark:text-slate-300">
            Get started with ChatSphere in just a few simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-site-foreground p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-mainColor-100 dark:bg-mainColor-900/50">
              <span className="text-2xl font-bold text-mainColor-600 dark:text-mainColor-400">
                1
              </span>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Download the App</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Available on the App Store, Google Play, or our website for
              desktop users.
            </p>
          </div>
          <div className="rounded-xl bg-site-foreground p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-mainColor-100 dark:bg-mainColor-900/50">
              <span className="text-2xl font-bold text-mainColor-600 dark:text-mainColor-400">
                2
              </span>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Create Your Account</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Sign up with your email or phone number. It only takes a minute.
            </p>
          </div>
          <div className="rounded-xl bg-site-foreground p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-mainColor-100 dark:bg-mainColor-900/50">
              <span className="text-2xl font-bold text-mainColor-600 dark:text-mainColor-400">
                3
              </span>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Start Connecting</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Find friends, join groups, and enjoy seamless communication.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPageHIW;
