import {
  LuImage as ImageIcon,
  LuCalendar,
  LuCpu,
  LuLock,
  LuMessageSquare,
  LuPhone,
} from "react-icons/lu";

const LandingPageFeatures = () => {
  return (
    <section
      id="features"
      className="bg-site-foreground px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold">Amazing Features</h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-600 dark:text-slate-300">
            ChatSphere comes packed with powerful features to enhance your
            messaging experience
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-site-background p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-mainColor-100 dark:bg-mainColor-900/50">
              <LuLock className="h-6 w-6 text-mainColor-600 dark:text-mainColor-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">
              End-to-End Encryption
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Your messages are secured with military-grade encryption, ensuring
              only you and the recipient can read them.
            </p>
          </div>
          <div className="rounded-xl bg-site-background p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-mainColor-100 dark:bg-mainColor-900/50">
              <LuCpu className="h-6 w-6 text-mainColor-600 dark:text-mainColor-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Cross-Platform</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Seamlessly switch between devices with our apps for iOS, Android,
              Windows, and Mac.
            </p>
          </div>
          <div className="rounded-xl bg-site-background p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-mainColor-100 dark:bg-mainColor-900/50">
              <LuCalendar className="h-6 w-6 text-mainColor-600 dark:text-mainColor-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Message Scheduling</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Schedule messages to be sent at a later time, perfect for
              birthdays, reminders, or working across timezones.
            </p>
          </div>
          <div className="rounded-xl bg-site-background p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-mainColor-100 dark:bg-mainColor-900/50">
              <ImageIcon className="h-6 w-6 text-mainColor-600 dark:text-mainColor-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Media Sharing</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Share high-quality photos, videos, and files without compression
              or size limits.
            </p>
          </div>
          <div className="rounded-xl bg-site-background p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-mainColor-100 dark:bg-mainColor-900/50">
              <LuMessageSquare className="h-6 w-6 text-mainColor-600 dark:text-mainColor-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Group Chats</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Create groups with up to 500 members, with admin controls and
              customizable settings.
            </p>
          </div>
          <div className="rounded-xl bg-site-background p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-mainColor-100 dark:bg-mainColor-900/50">
              <LuPhone className="h-6 w-6 text-mainColor-600 dark:text-mainColor-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Voice & Video Calls</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Crystal clear voice and video calls with noise cancellation and
              background blur.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPageFeatures;
