"use client";

import { useEffect, useState } from "react";
import {
  generateAvatar,
  Member,
} from "@/app/group/[groupID]/members/group-members-client";
import axios from "axios";
import { getParamGroupIDAndMemberID } from "../wishlists/page";
import { usePathname } from "next/navigation";
import { FaCrown } from "react-icons/fa";

type GroupMember = {
  addedBy: string;
  addedAt: Date;
} & Member;

export default function BasicDetailsPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [member, setMember] = useState<GroupMember | null>(null);

  const { memberID, groupID } = getParamGroupIDAndMemberID(usePathname());

  const updateRole = async (rolePath: "admin" | "revoke-admin") => {
    try {
      const { data } = await axios.patch(
        `http://localhost:3001/api/group/members/${rolePath}`,
        {
          groupID,
          memberID,
          adminID: "677a8e65ed9cec6c6df559d2",
        }
      );

      setMember((prevMember) =>
        prevMember ? { ...prevMember, role: data.role } : null
      );

      console.log(data);
    } catch (e) {
      console.log("Error updating role", e);
    }
  };

  const getMemberData = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/group/${groupID}/member/${memberID}`
      );

      const formattedMember: GroupMember = {
        _id: data.memberID._id,
        addedAt: data.createdAt,
        addedBy: data.addedBy.name,
        email: data.memberID.email,
        name: data.memberID.name,
        role: data.role,
        status: data.status,
      };

      setMember(formattedMember);
    } catch (error) {
      console.error("Failed to fetch member:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMemberData();
  }, [member?.role]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">Loading member...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Header */}
      <h1 className="text-4xl font-extrabold mb-8 text-blue-400">
        Member Details
      </h1>

      {/* User Avatar and Name */}
      <div className="flex items-center gap-6 bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <div className="w-28 h-28">
          <img
            src={generateAvatar(member!.name)}
            alt={`${member?.name ?? ""}'s avatar`}
            className="w-full h-full object-cover rounded-full border-4 border-blue-500"
          />
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">{member?.name}</h2>
            {member?.role === "admin" && (
              <span className="text-xl text-blue-400">
                <FaCrown className="inline-block mr-1 text-yellow-500" />
                {member?.role}
              </span>
            )}
          </div>
          <div className="flex mt-5">
            <button
              onClick={async () => {
                if (member?.role === "admin") {
                  await updateRole("revoke-admin");
                } else {
                  await updateRole("admin");
                }
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                member?.role === "admin"
                  ? "bg-red-500 hover:bg-red-700"
                  : "bg-green-700 hover:bg-green-800"
              }`}
            >
              {member?.role === "admin" ? "Dismiss Admin" : "Make Admin"}
            </button>
          </div>
        </div>
      </div>

      {/* User Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailItem label="Name" value={member?.name ?? ""} />
        <DetailItem label="Email" value={member?.email ?? ""} />
        <DetailItem
          label="Date of Joining"
          value={new Date(member?.addedAt ?? "").toLocaleDateString()}
        />
        <DetailItem label="Added By" value={member?.addedBy ?? "Unknown"} />
        <DetailItem
          label="Status"
          value={member?.status ? member.status.toUpperCase() : "Inactive"}
        />
      </div>
    </div>
  );
}

// Reusable component for non-editable details
function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <p className="text-sm text-gray-400 uppercase">{label}</p>
      <p className="text-xl font-semibold text-blue-200 mt-2">{value}</p>
    </div>
  );
}
