/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter, usePathname } from "next/navigation";

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
      className={`flex items-center w-full p-4 leading-tight transition-all cursor-pointer ${
        isActive
          ? "bg-gray-900 text-white"
          : "bg-transparent hover:bg-primary text-white"
      }`}
      onClick={() => router.push(path)}
      aria-label={label}
      tabIndex={0}
    >
      <span className="ml-8 font-semibold text-white">{label}</span>
    </div>
  );
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="border-t border-gray-600 flex h-full w-full">
      {/* Sidebar */}
      <div className="relative flex h-full w-full max-w-[17rem] flex-col bg-primary-dark">
        <div className="p-4 mb-6 border-b border-gray-200">
          <h5 className="ml-8 text-2xl font-bold leading-snug tracking-wide text-gray-300">
            Settings
          </h5>
        </div>
        <h3 className="ml-12 text-xl font-bold leading-snug tracking-wide text-gray-400">
          Personal
        </h3>
        <nav className="bg-transparent mt-5 flex flex-col">
          <NavItem
            label="Basic Details"
            path="/member/profile/basic-details"
            isActive={pathname === "/member/profile/basic-details"}
          />
          <NavItem
            label="My Wishlists"
            path="/member/profile/wishlists"
            isActive={pathname === "/member/profile/wishlists"}
          />
          <NavItem
            label="Security"
            path="/member/profile/security"
            isActive={pathname === "/member/profile/security"}
          />
        </nav>
      </div>

      {/* Page Content */}
      <div className="flex-1 p-8 bg-primary">{children}</div>
    </div>
  );
}
