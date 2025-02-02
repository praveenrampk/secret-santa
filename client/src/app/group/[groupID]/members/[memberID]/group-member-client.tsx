/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import GroupHeader from "../../group-header";

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

export default function GroupMemberClient({
  groupID,
  memberID,
}: {
  groupID: string;
  memberID: string;
}) {
  console.log(groupID, memberID);
  const [loading] = useState<boolean>(false);

  // Fetch group members
  useEffect(() => {
    if (!groupID) return;
  }, [groupID]);

  if (loading) {
    return <div className="text-center mt-10">Loading group members...</div>;
  }

  return (
    <div className="bg-primary">
      <GroupHeader
        isPrivate={false}
        members={[]}
        currentMemberRole={"member"}
        groupID={groupID}
      />
    </div>
  );
}
