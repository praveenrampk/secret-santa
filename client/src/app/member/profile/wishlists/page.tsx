/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import { useState, useEffect } from "react";

type WishList = {
  _id: string;
  text: string;
  link?: string;
  createdAt: string;
  memberID: string;
  groupName: string;
  groupID: any;
};

export default function WishlistsPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [wishlists, setWishlists] = useState<WishList[]>([]);
  const [editingWishlist, setEditingWishlist] = useState<WishList | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getMyWishLists = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3001/api/wish-list/members/677a8e65ed9cec6c6df559d2"
      );

      const formattedWishLists = data.map((wishlist: any): WishList => {
        return {
          _id: wishlist._id,
          createdAt: wishlist.createdAt,
          text: wishlist.text,
          groupName: wishlist.groupID.groupName,
          groupID: wishlist.groupID,
          memberID: wishlist.memberID,
          link: wishlist.link,
        };
      });

      setWishlists(formattedWishLists);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyWishLists();
  }, []);

  const handleEdit = (wishlist: WishList) => setEditingWishlist(wishlist);

  const handleSave = async (updatedWishlist: WishList) => {
    const memberID = wishlists[0].memberID;

    console.log(memberID);

    const { data } = await axios.put(
      `http://localhost:3001/api/wish-list/${updatedWishlist._id}/members/${memberID}`,
      {
        text: updatedWishlist.text,
        link: updatedWishlist.link,
      }
    );

    console.log(data);

    setWishlists((prevWishlists) =>
      prevWishlists.map((wishlist) =>
        wishlist._id === updatedWishlist._id
          ? {
              ...updatedWishlist,
              updatedAt: data.updatedAt,
              link: data.link,
              text: data.text,
            }
          : wishlist
      )
    );
    setEditingWishlist(null); // Close the modal
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredWishlists = wishlists.filter((wishlist) => {
    return (
      wishlist.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wishlist.groupName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading) {
    return <div className="text-center mt-10">Loading wishlists...</div>;
  }

  return (
    <div className="bg-transparent w-full h-screen p-8 text-white flex flex-col">
      <h1 className="text-4xl font-bold mb-8">My Wishlists</h1>
      {/* Centered Input */}
      <div className="w-1/2 mb-8 flex justify-start">
        <input
          className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search for a wishlist..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      {/* Scrollable Wishlist Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWishlists.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              {`No wishlists found for ${searchQuery}`}
            </div>
          ) : (
            filteredWishlists.map((wishlist, index) => (
              <WishlistCard
                key={wishlist._id + index}
                wishlist={wishlist}
                onEdit={handleEdit}
              />
            ))
          )}
        </div>
      </div>
      {/* Edit Modal */}
      {editingWishlist && (
        <EditWishlistModal
          wishlist={editingWishlist}
          onSave={handleSave}
          onClose={() => setEditingWishlist(null)}
        />
      )}
    </div>
  );
}

// Component to render individual wishlist cards
function WishlistCard({
  wishlist,
  onEdit,
}: {
  wishlist: WishList;
  onEdit: (wishlist: WishList) => void;
}) {
  return (
    <div className="bg-primary-dark p-6 shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-bold mb-4">{wishlist.text}</h2>
      {wishlist.link && (
        <a
          href={wishlist.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline hover:text-blue-300"
        >
          View Item
        </a>
      )}
      <p className="text-gray-400 text-sm mt-4">
        Added on:{" "}
        {new Date(wishlist.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <p className="text-gray-500 text-sm mt-2">Group: {wishlist.groupName}</p>
      <button
        onClick={() => onEdit(wishlist)}
        className="mt-4 bg-blue-500 px-4 py-2 text-white hover:bg-blue-400"
      >
        Edit
      </button>
    </div>
  );
}

function EditWishlistModal({
  wishlist,
  onSave,
  onClose,
}: {
  wishlist: WishList;
  onSave: (updatedWishlist: WishList) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState(wishlist.text);
  const [link, setLink] = useState(wishlist.link || "");

  const handleSave = () => {
    onSave({
      ...wishlist,
      text,
      link,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-primary p-8 w-96 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Wishlist</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Wishlist Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-2 text-black bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Link (Optional)</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full p-2 text-black bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-400"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
