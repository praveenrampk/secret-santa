"use client";

import { useEffect, useState } from "react";
import {
  generateAvatar,
  Member,
} from "@/app/group/[groupID]/members/group-members-client";
import axios from "axios";

export default function BasicDetailsPage() {
  const [loading, setLoading] = useState<boolean>(true);

  const [member, setMember] = useState<Member | null>(null);

  const [name, setName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);

  const saveName = async () => {
    try {
      const { data } = await axios.patch(
        `http://localhost:3001/api/member/677a8e65ed9cec6c6df559d2/edit/${name}`
      );

      setMember(data);
      setIsEditingName(false);
    } catch (error) {
      console.error("Error updating name.", error);
    }
  };

  const getMemberData = async () => {
    try {
      const email = "praveen@gmail.com";

      const { data } = await axios.get(
        `http://localhost:3001/api/member?email=${email}`
      );

      setName(data.name);

      setMember(data);
    } catch (error) {
      console.error("Failed to fetch member:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMemberData();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading member...</div>;
  }

  return (
    <div className="bg-transparent min-h-screen p-8 text-white">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-8">Basic Details</h1>

      {/* User Avatar and Name */}
      <div className="flex items-center gap-6 bg-primary-dark p-6 rounded-lg shadow-md mb-8">
        <div className="w-28 h-28">
          <img
            src={generateAvatar(member!.name)}
            alt={`${member?.name ?? ""}'s avatar`}
            className="w-full h-full object-cover rounded-full border-4 border-blue-500"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold">{member?.name}</h2>
          <p className="text-gray-400">Full Stack Developer</p>
        </div>
      </div>

      {/* User Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EditableDetailItem
          label="Full Name"
          value={name}
          isEditing={isEditingName}
          onChange={(e) => setName(e.target.value)}
          onEdit={() => setIsEditingName(true)}
          onSave={saveName}
          onCancel={() => setIsEditingName(false)}
        />

        <DetailItem label="Email" value={member?.email ?? ""} />
        <DetailItem label="Date of Joining" value="January 15, 2020" />
      </div>
    </div>
  );
}

// Reusable component for non-editable details
function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-primary-dark p-6 rounded-lg shadow-md">
      <p className="text-sm text-gray-400 uppercase">{label}</p>
      <p className="text-xl font-semibold text-white mt-2">{value}</p>
    </div>
  );
}

// Reusable component for editable details with individual edit/save functionality
function EditableDetailItem({
  label,
  value,
  isEditing,
  onChange,
  onEdit,
  onSave,
  onCancel,
}: {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="bg-primary-dark p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400 uppercase">{label}</p>
        {!isEditing ? (
          <button
            onClick={onEdit}
            className="text-blue-500 hover:underline text-sm"
          >
            Edit
          </button>
        ) : null}
      </div>
      {isEditing ? (
        <div className="mt-2">
          <input
            type="text"
            value={value}
            onChange={onChange}
            className="w-full p-2 bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-4 flex justify-end gap-6">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-white hover:text-black hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-6 py-2 bg-blue-500 text-white hover:bg-blue-400"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xl font-semibold text-white mt-2">{value}</p>
      )}
    </div>
  );
}
