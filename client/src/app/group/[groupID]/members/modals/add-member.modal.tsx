import { useEffect, useRef, useState } from "react";
import { generateAvatar, Group, Member } from "../group-members-client";
import axios from "axios";

type GroupInfoModalProps = {
  members: Member[];
  group: Group | null;
  isOpen: boolean;
  onClose: () => void;
};

type User = {
  email: string;
  name?: string; // Optional, for displaying names if available
};

export function AddMemberIntoGroup({
  members,
  group,
  isOpen,
  onClose,
}: GroupInfoModalProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);

  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Backspace" && !searchQuery) {
        if (
          isSearchFocused &&
          !searchQuery.length &&
          selectedMembers.length > 0
        ) {
          const updatedMembers = [...selectedMembers];
          updatedMembers.pop();
          setSelectedMembers(updatedMembers);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchQuery, selectedMembers, isSearchFocused]);

  if (!isOpen || !group) return null;

  const fetchSuggestions = async (query: string) => {
    const response = await axios.get(
      `http://localhost:3001/api/member/search/${query}`
    );

    setSuggestedUsers(response.data);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      fetchSuggestions(query);
    } else {
      setSuggestedUsers([]);
    }
  };

  const handleAddMember = (user: User) => {
    if (!selectedMembers.find((member) => member.email === user.email)) {
      setSelectedMembers([...selectedMembers, user]);
      setSearchQuery("");
      setSuggestedUsers([]);
      inputRef.current?.focus();
    }
  };

  const handleRemoveMember = (email: string) => {
    setSelectedMembers(
      selectedMembers.filter((member) => member.email !== email)
    );
  };

  const handleSave = async () => {
    await axios.post(
      `http://localhost:3001/api/group/${group._id}/add-members`,
      {
        members: selectedMembers.map((member) => member.email),
        adminID: "677a8e65ed9cec6c6df559d2",
      }
    );

    setIsEditing(false);
    console.log("Added Members:", selectedMembers);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="flex flex-col justify-between bg-gradient-to-br from-gray-800 via-gray-800 to-black shadow-2xl w-full max-w-3xl h-3/5 p-8 text-white relative">
        <div>
          {/* Modal Header */}
          <header className="flex justify-between mb-4 border-b border-gray-700 pb-2">
            <div className="mt-8">
              <h2 className="text-2xl font-bold tracking-wide">{`Add people to '${group.groupName}'`}</h2>
              <p className="text-sm text-gray-400 mt-1">
                {members.length} members
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-gray-100 transition duration-200"
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
          </header>

          {/* Search Input */}
          <div className="w-full mt-4">
            <div className="flex flex-wrap items-center gap-2 bg-gray-800 px-4 py-2 border border-gray-600 focus-within:ring-2 focus-within:ring-gray-800">
              {selectedMembers.map((member) => (
                <div
                  className="flex items-center gap-3 bg-primary-dark text-white px-2 py-0.5 rounded-full"
                  key={member.email}
                >
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    <img
                      src={generateAvatar(member.name ?? "")}
                      alt={`${member.name || member.email}'s avatar`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {member.name || member.email}
                  </span>
                  <button
                    onClick={() => handleRemoveMember(member.email)}
                    className="text-white text-2xl hover:text-gray-300 focus:outline-none  focus:ring-white rounded-full"
                    aria-label={`Remove ${member.name || member.email}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
              <input
                ref={inputRef}
                className="flex-grow bg-transparent text-white placeholder-gray-400 focus:outline-none"
                placeholder="Search for people by email"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            {suggestedUsers.length > 0 && (
              <div
                style={{ maxHeight: "300px" }}
                className="overflow-y-auto mt-2 bg-gray-800 border border-gray-600 rounded shadow-lg"
              >
                {suggestedUsers.map((user) => (
                  <div
                    key={user.email}
                    onClick={() => handleAddMember(user)}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                  >
                    {user.name ? `${user.name} (${user.email})` : user.email}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <footer className="mt-8 text-center">
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-400 text-gray-400 hover:bg-gray-600 hover:text-white rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-500 text-white hover:bg-blue-400 rounded"
            >
              Save
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
