"use client";

import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import {
  generateAvatar,
  Member,
} from "../group/[groupID]/members/group-members-client";
import axios from "axios";
import { useRouter } from "next/navigation";

export function HeaderComponent() {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [member, setMember] = useState<Member | null>(null);

  const getMemberData = async () => {
    try {
      const email = "praveen@gmail.com";

      const { data } = await axios.get(
        `http://localhost:3001/api/member?email=${email}`
      );

      setMember(data);
    } catch (error) {
      console.error("Failed to fetch member:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMemberData();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading member...</div>;
  }

  return (
    <header className="bg-primary shadow sticky">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <div
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img
            className="h-12 w-12 rounded-full"
            src={"/secret-santa.png"}
            alt="Secret Santa Logo"
          />
          <h1 className="text-2xl font-bold text-white">Secret Santa</h1>
        </div>

        {/* Notification and Profile */}
        <div className="flex items-center gap-4 text-white">
          <button className="mt-2 relative p-3 rounded-full hover:bg-white/20">
            <FaBell size={22} />
            <span className="absolute top-0 right-0 bg-red-500 text-xs text-white rounded-full px-2">
              3
            </span>
          </button>

          <div
            onClick={() => router.push("/member/profile/basic-details")}
            className="w-8 h-8 bg-gray-300 rounded-full flex items-center text-2xl text-white cursor-pointer hover:bg-white/20"
          >
            <img
              src={generateAvatar(member!.name)}
              alt={`${member!.name}'s avatar`}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
