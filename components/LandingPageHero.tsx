import Image from "next/image";
import Link from "next/link";
import {
  LuFile,
  LuPaperclip,
  LuPhone,
  LuSend,
  LuSmile,
  LuVideo,
} from "react-icons/lu";

const LandingPageHero = () => {
  return (
    <section className="px-4 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <h1 className="mb-6 text-4xl leading-tight font-bold md:text-5xl">
              Connect with
              <span className="bg-gradient-to-r from-mainColor-500 to-mainColor-700 bg-clip-text text-transparent">
                {" "}
                Everyone{" "}
              </span>
              Seamlessly
            </h1>
            <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">
              ChatSphere brings people together with its intuitive interface,
              end-to-end encryption, and cross-platform compatibility.
              Experience messaging like never before.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/sign-up"
                className="rounded-lg bg-mainColor-600 px-6 py-3 font-medium text-white shadow-lg shadow-mainColor-500/20 transition hover:bg-mainColor-700 hover:shadow-mainColor-500/30"
              >
                Get started now
              </Link>
            </div>
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2">
                <Image
                  width={40}
                  height={40}
                  src="https://randomuser.me/api/portraits/women/12.jpg"
                  className="rounded-full border-2 border-white dark:border-slate-800"
                  alt="user-1"
                />
                <Image
                  width={40}
                  height={40}
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  className="rounded-full border-2 border-white dark:border-slate-800"
                  alt="user-1"
                />
                <Image
                  width={40}
                  height={40}
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  className="rounded-full border-2 border-white dark:border-slate-800"
                  alt="user-1"
                />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Join{" "}
                  <span className="font-bold text-mainColor-600">10,000+</span>{" "}
                  happy users
                </p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="glass overflow-hidden rounded-2xl p-1 shadow-xl">
              <div className="chat-window flex flex-col overflow-hidden rounded-xl bg-white dark:bg-slate-800">
                <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-center">
                    <Image
                      width={40}
                      height={40}
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      className="rounded-full border-2 border-white dark:border-slate-800"
                      alt="user-1"
                    />
                    <div className="ml-3">
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Online
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-700">
                      <LuPhone className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    </button>
                    <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-700">
                      <LuVideo className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-700/30">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Image
                        width={40}
                        height={40}
                        src="https://randomuser.me/api/portraits/women/44.jpg"
                        className="rounded-full border-2 border-white dark:border-slate-800"
                        alt="user-1"
                      />
                      <div>
                        <div className="message-bubble bg-white px-4 py-2 shadow-sm dark:bg-slate-600">
                          <p className="text-sm">
                            Hey there! How are you doing?
                          </p>
                        </div>
                        <p className="mt-1 ml-1 text-xs text-slate-500 dark:text-slate-400">
                          10:30 AM
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start justify-end">
                      <div>
                        <div className="message-bubble self bg-mainColor-100 px-4 py-2 shadow-sm dark:bg-mainColor-900">
                          <p className="text-sm">
                            I am doing great! Just finished that project we were
                            working on.
                          </p>
                        </div>
                        <p className="mt-1 mr-1 text-right text-xs text-slate-500 dark:text-slate-400">
                          10:32 AM
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Image
                        width={40}
                        height={40}
                        src="https://randomuser.me/api/portraits/women/44.jpg"
                        className="rounded-full border-2 border-white dark:border-slate-800"
                        alt="user-1"
                      />
                      <div>
                        <div className="message-bubble bg-white px-4 py-2 shadow-sm dark:bg-slate-600">
                          <p className="text-sm">
                            That is awesome! Can you share the files with me?
                          </p>
                        </div>
                        <p className="mt-1 ml-1 text-xs text-slate-500 dark:text-slate-400">
                          10:33 AM
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start justify-end">
                      <div>
                        <div className="message-bubble self bg-mainColor-100 px-4 py-2 shadow-sm dark:bg-mainColor-900">
                          <div className="flex items-center space-x-2">
                            <LuFile className="h-5 w-5 text-mainColor-600 dark:text-mainColor-400" />
                            <div>
                              <p className="text-sm font-medium">
                                Project_Final.zip
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                24.5 MB
                              </p>
                            </div>
                          </div>
                        </div>
                        <p className="mt-1 mr-1 text-right text-xs text-slate-500 dark:text-slate-400">
                          10:35 AM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-200 p-3 dark:border-slate-700">
                  <div className="flex items-center">
                    <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-700">
                      <LuPaperclip className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    </button>
                    <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-700">
                      <LuSmile className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    </button>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="mx-2 flex-1 rounded-full bg-gray-100 px-4 py-2 focus:ring-2 focus:ring-mainColor-500 focus:outline-none dark:bg-slate-700"
                    />
                    <button className="rounded-full bg-mainColor-600 p-2 text-white hover:bg-mainColor-700">
                      <LuSend className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-4 left-4 -z-10 h-full w-full rounded-2xl bg-mainColor-500/10 dark:bg-mainColor-900/20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPageHero;
