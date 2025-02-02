/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaCrown, FaEllipsisV, FaSearch } from "react-icons/fa";
import GroupHeader from "../group-header";
import { useRouter } from "next/navigation";

export type Member = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  status: "active" | "removed";
};

export type Group = {
  _id: string;
  name: string;
  email: string;
  santaAllocationStatus: "allotted" | "pending";
  welcomeMessage: string;
  description: string;
  groupName: string;
  createdAt: string;
  updatedAt: string;
};

export function generateAvatar(name: string) {
  const nameParts = name.split(" ");
  let initials = "";

  if (nameParts.length > 1) {
    initials = nameParts[0].charAt(0) + nameParts[1].charAt(0);
  } else {
    initials = nameParts[0].charAt(0);
  }

  const avatarUrl = `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff`;
  return avatarUrl;
}

export default function GroupMembersClient({ groupID }: { groupID: string }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentMemberRole, setCurrentMemberRole] = useState<
    "admin" | "member"
  >("member");

  const router = useRouter();

  // Fetch group members
  useEffect(() => {
    if (!groupID) return;

    async function fetchMembers() {
      try {
        const { data: groupMembers } = await axios.get(
          `http://localhost:3001/api/group/${groupID}/members`
        );

        const formattedMembers = groupMembers.map((groupMember: any) => ({
          _id: groupMember.memberID._id,
          name: groupMember.memberID.name,
          email: groupMember.memberID.email,
          role: groupMember.role,
          status: groupMember.status,
        }));

        setMembers(formattedMembers);
        setFilteredMembers(formattedMembers);

        const member = formattedMembers.find(
          (member: any) => member.email === "praveen@gmail.com"
        );
        if (member) {
          setCurrentMemberRole(member.role);
        }
      } catch (error) {
        console.error("Failed to fetch group members:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, [groupID]);

  useEffect(() => {
    const results = members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembers(results);
  }, [searchTerm, members]);

  const handleMakeAdmin = (memberId: string) => {
    console.log("Making member as admin:", memberId);
  };

  const handleDismissAdmin = (memberId: string) => {
    console.log("Dismissing admin:", memberId);
  };

  const handleViewProfile = (memberId: string) => {
    console.log("Viewing profile of member:", memberId);
  };

  if (loading) {
    return <div className="text-center mt-10">Loading group members...</div>;
  }

  return (
    <div className="min-h-screen bg-primary">
      <GroupHeader
        isPrivate={false}
        members={members}
        currentMemberRole={currentMemberRole}
        groupID={groupID}
      />
      <div className="relative w-full sm:w-1/3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search members..."
          className="w-full py-3 px-5 rounded-full text-black border border-gray-300 shadow-md focus:outline-none focus:ring-4 focus:ring-pink-300 transition-all"
        />
        <FaSearch className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>

      <div className="p-4 max-w-screen-2xl mx-auto">
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMembers.map((member) => (
              <div
                onClick={() =>
                  router.push(
                    `/group/${groupID}/members/${member._id}/profile/basic-details`
                  )
                }
                key={member._id}
                className="relative flex flex-col items-center bg-primary-dark shadow-lg rounded-lg p-6 hover:shadow-xl transition-all"
              >
                {/* Member Avatar */}
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-2xl text-white">
                  <img
                    src={generateAvatar(member.name)}
                    alt={`${member.name}'s avatar`}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                {/* Member Details */}
                <h2 className="mt-4 text-lg font-medium text-white">
                  {member.name}
                </h2>
                <p className="text-sm text-gray-500">{member.email}</p>
                <div className="mt-2 text-xs font-medium">
                  <span
                    className={`${
                      member.role === "admin"
                        ? "text-blue-600"
                        : "text-gray-600"
                    }`}
                  >
                    {member.role === "admin" && (
                      <FaCrown className="inline-block mr-1 text-yellow-500" />
                    )}
                    {member.role}
                  </span>
                  <span
                    className={`ml-2 ${
                      member.status === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {member.status}
                  </span>
                </div>

                {/* Three dots menu for options */}
                <div className="absolute top-2 right-2 group">
                  <button className="p-2 text-gray-600 hover:text-gray-800 transition duration-200">
                    <FaEllipsisV />
                  </button>
                  {/* Dropdown menu */}
                  <div className="absolute top-6 right-0 w-48 bg-white shadow-lg rounded-lg overflow-hidden opacity-0 transition-all transform scale-95 group-hover:opacity-100 group-hover:scale-100">
                    <ul className="text-sm text-gray-700">
                      <li
                        onClick={() => handleViewProfile(member._id)}
                        className="cursor-pointer hover:bg-gray-200 px-4 py-2 transition duration-150"
                      >
                        {`View ${member.name}`}
                      </li>
                      {member.role === "member" && (
                        <li
                          onClick={() => handleMakeAdmin(member._id)}
                          className="cursor-pointer hover:bg-gray-200 px-4 py-2 transition duration-150"
                        >
                          Make Group Admin
                        </li>
                      )}
                      {member.role === "admin" && (
                        <li
                          onClick={() => handleDismissAdmin(member._id)}
                          className="cursor-pointer hover:bg-gray-200 px-4 py-2 transition duration-150"
                        >
                          Dismiss as Admin
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            No members found in this group.
          </div>
        )}
      </div>
    </div>
  );
}
