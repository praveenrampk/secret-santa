import { useState } from "react";
import { Group } from "../group-members-client";
import axios from "axios";

type GroupInfoModalProps = {
  totalMembers: number;
  group: Group | null;
  isOpen: boolean;
  onClose: () => void;
};

export function GroupInfoModal({
  totalMembers,
  group,
  isOpen,
  onClose,
}: GroupInfoModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(group?.description || "");

  if (!isOpen || !group) return null;

  const handleSave = async () => {
    await axios.patch(
      `http://localhost:3001/api/group/${group._id}/description`,
      {
        description,
        adminID: "677a8e65ed9cec6c6df559d2",
      }
    );

    setIsEditing(false);
    console.log("Saved Description:", description);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-800 via-gray-800 to-black shadow-2xl w-full max-w-lg p-20 text-white relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-gray-100 transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal Header */}
        <header className="text-center border-b border-gray-700 pb-4">
          <h2 className="text-2xl font-bold tracking-wide">
            {group.groupName}
          </h2>
          <div className="flex justify-evenly">
            <p className="text-sm text-gray-400 mt-1">{totalMembers} members</p>
            <p className="text-sm text-gray-400 mt-1">
              {group.santaAllocationStatus === "allotted"
                ? "🎁 Santa Allotted"
                : "🔄 Pending Allocation"}
            </p>
          </div>
        </header>

        {/* Modal Content */}
        <div className="mt-6 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-400">
                Description
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-blue-400 hover:underline"
                >
                  Edit
                </button>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-gray-900 text-gray-100 border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-base text-gray-100">{description}</p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400">
              Welcome Message
            </h3>
            <p className="text-base text-gray-100">{group.welcomeMessage}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400">Creator</h3>
            <p className="text-base text-gray-100">
              {group.name}{" "}
              <span className="text-gray-400">({group.email})</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-400">
                Created At
              </h3>
              <div className="text-sm text-gray-300">
                {new Date(group.createdAt).toDateString()}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400">
                Updated At
              </h3>
              <p className="text-sm text-gray-300">
                {new Date(group.updatedAt).toDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <footer className="mt-12 text-center">
          <div className="flex flex-col gap-4">
            {group.santaAllocationStatus === "pending" && (
              <button
                onClick={onClose}
                className="px-8 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:from-green-500 hover:to-blue-600 focus:ring-4 focus:ring-green-500 transition transform hover:scale-105"
              >
                🎁 Allocate Santa
              </button>
            )}
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-red-400 to-orange-500 text-white font-semibold rounded-lg shadow-lg hover:from-red-500 hover:to-orange-600 focus:ring-4 focus:ring-red-500 transition transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
