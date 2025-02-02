"use client";

import { useRouter, usePathname } from "next/navigation";
import { use } from "react";
import GroupMemberClient from "../group-member-client";

type MemberParams = {
  groupID: string;
  memberID: string;
};

const NavItem = ({
  label,
  path,
  isActive,
}: {
  label: string;
  path: string;
  isActive: boolean;
}) => {
  const router = useRouter();

  return (
    <div
      role="button"
      className={`flex items-center w-full px-6 py-4 text-sm font-medium transition-all cursor-pointer rounded-lg ${
        isActive
          ? "bg-gray-800 text-white shadow-lg"
          : "bg-transparent text-gray-400 hover:bg-gray-700 hover:text-white"
      }`}
      onClick={() => router.push(path)}
      aria-label={label}
      tabIndex={0}
    >
      <span className="ml-4">{label}</span>
    </div>
  );
};

export default function MemberProfileLayout({
  params,
  children,
}: {
  params: Promise<MemberParams>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const { groupID, memberID } = use(params);

  return (
    <>
      <GroupMemberClient groupID={groupID} memberID={memberID} />
      <div className="flex min-h-screen bg-gray-900 text-white">
        {/* Pass groupID and memberID to GroupMemberClient */}

        {/* Sidebar */}
        <aside className="flex flex-col w-64 px-4 py-8 border-r border-gray-700 bg-gray-800">
          <h2 className="text-xl font-bold text-center text-white">Profile</h2>
          <nav className="mt-8 space-y-4">
            <NavItem
              label="Basic Details"
              path={`/group/${groupID}/members/${memberID}/profile/basic-details`}
              isActive={
                pathname ===
                `/group/${groupID}/members/${memberID}/profile/basic-details`
              }
            />
            <NavItem
              label="Wishlists"
              path={`/group/${groupID}/members/${memberID}/profile/wishlists`}
              isActive={
                pathname ===
                `/group/${groupID}/members/${memberID}/profile/wishlists`
              }
            />
          </nav>
        </aside>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <div className="rounded-lg bg-gray-800 p-6 shadow-md">{children}</div>
        </main>
      </div>
    </>
  );
}
