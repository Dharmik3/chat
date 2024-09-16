import React, { useState, useEffect, useRef } from "react";
import { RiUserAddFill } from "react-icons/ri";
import { onSnapshot, doc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import { firestore as firestoreDB } from "../../services/firebaseConfig";
import { useContacts } from "../../hooks/useContacts";
import { useAuth } from "../../context/AuthContext";

interface AddUserDropdownProps {
  groupId: string;
  onUserAdd: (userId: string) => void;
}

export const AddUserDropDown: React.FC<AddUserDropdownProps> = ({
  groupId,
  onUserAdd,
}) => {
  const { user } = useAuth();
  const { contacts: users } = useContacts(user?.uid as string);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const groupRef = doc(firestoreDB, "groups", groupId);
        onSnapshot(groupRef, (doc) => {
          const groupData = doc.data() as { members: string[] };
          setSelectedUsers(new Set(groupData.members));
        });
      } catch (error) {
        toast("Something wen wrong");
        console.error("Error fetching group details: ", error);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCheckboxChange = (userId: string) => {
    setSelectedUsers((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(userId)) {
        newSelected.delete(userId);
      } else {
        newSelected.add(userId);
      }
      return newSelected;
    });
  };

  const handleAddUsers = () => {
    selectedUsers.forEach((userId) => onUserAdd(userId));
    // Reset selection
    setSelectedUsers(new Set());
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Add User Button */}
      <button
        className="0 p-2 rounded-full mt-2 transition-colors duration-300 hover:bg-gray-400"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <RiUserAddFill />
      </button>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="absolute -left-56 bg-white border border-gray-300 rounded-md shadow-lg mt-2 w-64 max-h-60 overflow-y-auto z-10">
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleCheckboxChange(user.id)} // Toggle user selection
              >
                <input
                  type="checkbox"
                  checked={selectedUsers.has(user.id)}
                  readOnly
                  className="mr-2 h-4 w-4"
                />
                <span className="text-gray-800">{user.name || user.phone}</span>
              </li>
            ))}
          </ul>

          {/* Confirm Add Users Button */}
          <div className="p-2 flex justify-end">
            <button
              className="bg-green-600 text-white px-2  rounded-md hover:bg-green-700 transition-colors duration-300"
              onClick={handleAddUsers}
              disabled={selectedUsers.size === 0} // Disable button if no user is selected
            >
              Add
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};
