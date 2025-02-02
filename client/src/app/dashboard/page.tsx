"use client";

import { useRouter } from "next/navigation";
import { FaRegLaughWink } from "react-icons/fa";
import { FcBookmark, FcPlus, FcContacts } from "react-icons/fc";
import { IoGiftSharp } from "react-icons/io5";

export default function DashboardPage() {
  const router = useRouter();
  return (
    <section className="bg-primary-dark">
      <div className="flex items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full shadow md:mt-0 sm:max-w-lg xl:p-0 bg-primary">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            {/* Welcome Section */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">
                🎅 Welcome to Secret Santa! 🎁
              </h1>
              <p className="text-gray-200 mt-2">
                Ready to spread joy and surprises? Let’s create magic together!
              </p>
            </div>

            {/* Countdown Section */}
            <div className="text-center p-4 bg-gradient-to-r from-gray-500 to-green-500 text-white shadow-md rounded-lg">
              <h2 className="text-lg font-semibold">
                🎄 Countdown to Christmas!
              </h2>
              <p className="text-2xl font-bold mt-1">
                20 Days : 05 Hours : 12 Minutes
              </p>
            </div>

            {/* Buttons Section as Grid */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                onClick={() => router.push("/group/create")}
                className="flex flex-col items-center p-4 bg-transparent border border-white text-white font-medium text-sm rounded-lg transition transform hover:scale-105"
              >
                <FcPlus size={32} />
                <span className="mt-2">Create Group</span>
              </button>
              <button
                onClick={() => router.push("/group")}
                className="flex flex-col items-center p-4 bg-transparent border border-white text-white font-medium text-sm rounded-lg transition transform hover:scale-105"
              >
                <FcContacts size={32} />
                <span className="mt-2">View Groups</span>
              </button>
              <button
                onClick={() => router.push("/favorites")}
                className="flex flex-col items-center p-4 bg-transparent border border-white text-white font-medium text-sm rounded-lg transition transform hover:scale-105"
              >
                <FcBookmark size={32} />
                <span className="mt-2">Favorites</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-transparent border border-white text-white font-medium text-sm rounded-lg transition transform hover:scale-105">
                <IoGiftSharp size={32} />
                <span className="mt-2">Claim Gift</span>
              </button>
            </div>

            {/* New Features */}
            <div className="space-y-4 text-center mt-8">
              <div className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">🎁 Random Gift Ideas!</h2>
                <p className="mt-2 text-sm">
                  Need inspiration? Check out our curated gift suggestions for
                  your loved ones!
                </p>
              </div>

              {/* <div className="p-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">
                  📝 Track Your Wishlist
                </h2>
                <p className="mt-2 text-sm">
                  Keep a list of your favorite gift ideas and never miss a
                  surprise!
                </p>
              </div> */}
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 mt-6">
              <p>
                Made with ❤️ by the Secret Santa team{" "}
                <FaRegLaughWink className="inline ml-1 text-lg text-pink-500" />
              </p>
              <p className="mt-2">
                Remember, the magic of giving is in the surprise! ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
