import { MenuProps } from "antd";
import React from "react";
import DropdownComponent from "../components/drop-down.component";
import { Group } from "./[groupID]/members/group-members-client";

const getMenuItems = (groupInfo: Group): MenuProps["items"] => [
  {
    key: "1",
    label: (
      <div className="p-2 hover:bg-gray-100 rounded-md">
        <h3 className="text-sm font-semibold text-gray-700">Description</h3>
        <p className="text-sm text-gray-600">{groupInfo.description}</p>
      </div>
    ),
  },
  {
    key: "2",
    label: (
      <div className="p-2 hover:bg-gray-100 rounded-md">
        <h3 className="text-sm font-semibold text-gray-700">Welcome Message</h3>
        <p className="text-sm text-gray-600">{groupInfo.welcomeMessage}</p>
      </div>
    ),
  },
  {
    key: "3",
    label: (
      <div className="p-2 hover:bg-gray-100 rounded-md">
        <h3 className="text-sm font-semibold text-gray-700">Creator</h3>
        <p className="text-sm text-gray-600">{`${groupInfo.name} (${groupInfo.email})`}</p>
      </div>
    ),
  },
  {
    key: "4",
    label: (
      <div className="p-2 hover:bg-gray-100 rounded-md">
        <h3 className="text-sm font-semibold text-gray-700">Created At</h3>
        <p className="text-sm text-gray-600">
          {new Date(groupInfo.createdAt).toLocaleString()}
        </p>
      </div>
    ),
  },
  {
    key: "5",
    label: (
      <div className="p-2 hover:bg-gray-100 rounded-md">
        <h3 className="text-sm font-semibold text-gray-700">Updated At</h3>
        <p className="text-sm text-gray-600">
          {new Date(groupInfo.updatedAt).toLocaleString()}
        </p>
      </div>
    ),
  },
];

export default function GroupInfo({ group }: { group: Group }) {
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    console.log("Menu clicked:", e.key);
  };

  return (
    <div className="flex items-center space-x-3">
      <h1 className="text-3xl font-bold tracking-wide drop-shadow-md flex items-center space-x-2">
        <span>🎄</span>
        <span>{group?.groupName}</span>
      </h1>
      <DropdownComponent
        items={getMenuItems(group)}
        label=""
        onMenuClick={handleMenuClick}
        // className="block w-full text-center"
      />
    </div>
  );
}
