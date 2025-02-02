/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { FaUserPlus, FaGift } from "react-icons/fa";
import { FcSettings } from "react-icons/fc";
import GroupInfo from "../group-info";
import { Group, Member } from "./members/group-members-client";
import { GroupInfoModal } from "./members/modals/group-info.modal";
import { AddMemberIntoGroup } from "./members/modals/add-member.modal";
import axios from "axios";

type GroupHeaderProps = {
  isPrivate: boolean;
  groupID: string;
  members: Member[];
  currentMemberRole: "admin" | "member";
};

const GroupHeader: React.FC<GroupHeaderProps> = ({
  isPrivate,
  groupID,
  members,
  currentMemberRole,
}) => {
  const [loading, setLoading] = useState<boolean>(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    if (!groupID) return;

    async function fetchMembers() {
      try {
        const { data: group } = await axios.get(
          `http://localhost:3001/api/group/${groupID}`
        );

        const formattedGroup = {
          _id: group._id,
          groupName: group.groupName,
          description: group.description,
          name: group.creatorID.name,
          email: group.creatorID.email,
          welcomeMessage: group.welcomeMessage,
          santaAllocationStatus: group.santaAllocationStatus,
          createdAt: group.createdAt,
          updatedAt: group.updatedAt,
        };

        setGroup(formattedGroup);
      } catch (error) {
        console.error("Failed to fetch group members:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, [groupID]);

  if (loading) {
    return <div className="text-center mt-10">Loading group members...</div>;
  }

  return (
    <>
      <header className="bg-gradient-to-r from-black via-green-700 to-grey-500 text-white py-6 px-8 shadow-lg flex flex-wrap justify-between items-center gap-4">
        {group && <GroupInfo group={group} />}

        {/* Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-4">
          {!isPrivate && currentMemberRole === "admin" && (
            <button
              onClick={() => setIsAddMemberModalOpen(true)}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-semibold py-3 px-6 rounded-full flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
            >
              <FaUserPlus className="text-lg" />
              <span>Add</span>
            </button>
          )}
          <button className="bg-gradient-to-r from-green-400 to-teal-600 hover:from-green-500 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-full flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all">
            <FaGift className="text-lg" />
            <span>My Secret Santa</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-white font-semibold py-3 px-6"
          >
            <FcSettings size={32} />
          </button>
        </div>
      </header>
      {/* Modals */}
      <GroupInfoModal
        totalMembers={members.length}
        group={group}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      {!isPrivate && (
        <AddMemberIntoGroup
          members={members}
          group={group}
          isOpen={isAddMemberModalOpen}
          onClose={() => setIsAddMemberModalOpen(false)}
        />
      )}
    </>
  );
};

export default GroupHeader;
