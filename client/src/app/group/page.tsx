"use client";

import { config } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUsers, FaCircle } from "react-icons/fa";

type Group = {
  _id: string;
  groupID: string;
  groupName: string;
  description?: string;
  creatorID: string;
  welcomeMessage: string;
  santaAllocationStatus?: "allotted" | "pending";
};

export default function MyGroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch groups data
  useEffect(() => {
    async function fetchGroups() {
      try {
        const { data } = await axios.get(
          config.GET_MEMBER_GROUP_URL?.replace("{{email}}", "praveen@gmail.com")
        );
        setGroups(data);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGroups();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading groups...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4 px-6 shadow-md">
        <h1 className="text-xl font-bold">🎄 My Groups</h1>
      </header>

      <div className="p-4 max-w-screen-xl mx-auto">
        {groups.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {groups.map((group) => (
              <div
                onClick={() => router.push(`/group/${group._id}/members`)} // Navigate to group members
                key={group.groupID}
                className="flex items-center gap-4 p-4 bg-white shadow rounded-lg hover:shadow-lg transition"
              >
                {/* Placeholder for group image */}
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  <FaUsers />
                </div>

                {/* Group Details */}
                <div className="flex-1">
                  <h2 className="text-lg font-medium text-gray-800">
                    {group.groupName}
                  </h2>
                  <p className="text-sm text-gray-500 truncate">
                    {group.welcomeMessage}
                  </p>
                  <span
                    className={`text-xs font-medium ${
                      group.santaAllocationStatus === "allotted"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    <FaCircle className="inline-block mr-1" />
                    {group.santaAllocationStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            No groups found. Start creating some groups!
          </div>
        )}
      </div>
    </div>
  );
}
