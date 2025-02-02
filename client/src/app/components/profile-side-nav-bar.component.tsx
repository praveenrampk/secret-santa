/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

const NavItem = ({
  label,
  isActive,
  badge,
  onClick,
}: {
  label: any;
  isActive: boolean;
  badge: any;
  onClick: any;
}) => (
  <div
    role="button"
    className={`flex items-center w-full p-4 leading-tight transition-all cursor-pointer  ${
      isActive
        ? "bg-gray-900 text-white"
        : "bg-primary-dark hover:bg-primary text-white"
    }`}
    onClick={onClick}
    aria-label={label}
    tabIndex={0}
  >
    <span className={`ml-8 font-semibold text-white`}>{label}</span>
    {badge && (
      <div className="grid ml-auto place-items-center justify-self-end">
        <div className="relative flex items-center justify-center px-3 py-1 text-sm font-bold text-white rounded-full bg-blue-500 shadow-md">
          {badge}
        </div>
      </div>
    )}
  </div>
);

export default function ProfileSideNavBar() {
  return (
    <div className="relative flex h-[calc(100vh-5.5rem)] w-full max-w-[17rem] flex-col bg-primary-dark text-gray-700">
      <div className="p-4 mb-6 border-b border-gray-200">
        <h5 className="ml-8 block text-2xl font-bold leading-snug tracking-wide text-gray-300">
          Settings
        </h5>
      </div>
      <h3 className="ml-12 block text-xl font-bold leading-snug tracking-wide text-gray-400">
        Personal
      </h3>
      <nav className="mt-5 flex flex-col ">
        <NavItem
          label="Basic Details"
          isActive={false}
          badge={undefined}
          onClick={() => alert("Basic Details Clicked")}
        />
        <NavItem
          label="My Wishlists"
          isActive={false}
          badge={undefined}
          onClick={() => alert("My Wishlists Clicked")}
        />
        <NavItem
          label="Security"
          isActive={true}
          badge=""
          onClick={() => alert("Security Clicked")}
        />
        <NavItem
          label="Log Out"
          isActive={false}
          badge={undefined}
          onClick={() => alert("Log Out Clicked")}
        />
      </nav>
    </div>
  );
}
