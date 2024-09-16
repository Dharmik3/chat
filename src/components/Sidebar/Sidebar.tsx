import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosAdd, IoMdLogOut } from "react-icons/io";
import { MdGroups } from "react-icons/md";
import { AiOutlineMenu } from "react-icons/ai";

import { useContacts } from "../../hooks/useContacts";
import { useAuth } from "../../context/AuthContext";
import { useGroups } from "../../hooks/useGroups";
import { createGroup } from "../../services/firebase";
import GroupCreationModal from "../CreateGroupModal/CreateGroupModal";
import { LargeLoader } from "../Loader";
import { Contact, Group } from "../../types";
import { SidebarSmallScreen } from "./SidebarSmallScreen";

export interface SidebarType {
  selectedContact: Contact | null;
  setSelectedContact: React.Dispatch<React.SetStateAction<Contact | null>>;
  selectedGroup: Group | null;
  setSelectedGroup: React.Dispatch<React.SetStateAction<Group | null>>;
}

export const Sidebar = (props: SidebarType) => {
  const {
    selectedContact,
    setSelectedContact,
    selectedGroup,
    setSelectedGroup,
  } = props;

  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { contacts, loading: isContactsLoading } = useContacts(
    user?.uid as string
  );
  const { groups, loading: isGroupsLoading } = useGroups(user?.uid);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // state for toggling create group modal
  const [searchTerm, setSearchTerm] = useState(""); // search bar string state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // state for mobile sidebar

  // search filter for contacts based on name
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // select by default zeroth index contact to show default chat
  useEffect(() => {
    if (!selectedContact && contacts.length > 0) {
      setSelectedContact(contacts[0]);
    }
  }, [contacts]);

  const handleCreateGroup = async (groupName: string) => {
    await createGroup(groupName, user?.uid as string);
  };

  // logout
  const handleLogout = async () => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      {/* Hamburger menu for mobile */}
      <button
        className="md:hidden p-1 flex items-start mt-4"
        onClick={() => setIsSidebarOpen(true)}
      >
        <AiOutlineMenu className="text-2xl" />
      </button>

      {/* Sidebar for mobile */}
      <SidebarSmallScreen
        filteredContacts={filteredContacts}
        handleLogout={handleLogout}
        isContactsLoading={isContactsLoading}
        isSidebarOpen={isSidebarOpen}
        searchTerm={searchTerm}
        selectedContact={selectedContact}
        selectedGroup={selectedGroup}
        setIsModalOpen={setIsModalOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        setSearchTerm={setSearchTerm}
        setSelectedContact={setSelectedContact}
        setSelectedGroup={setSelectedGroup}
      />

      {/* Sidebar for larger screen */}
      <div className="hidden md:block w-1/4 bg-gray-100 p-4 border-r overflow-y-auto">
        <div className="flex justify-between mb-2 items-center">
          <span>{user?.name}</span>
          <button
            className="font-medium rounded-md text-sm px-2 py-1.5 ml-auto"
            onClick={handleLogout}
          >
            <IoMdLogOut size={24} />
          </button>
        </div>
        <hr />

        <h2 className="text-lg font-bold mb-2">Contacts</h2>
        {isContactsLoading ? (
          <div className="flex justify-center mb-2">
            <LargeLoader />
          </div>
        ) : (
          <>
            <input
              type="text"
              placeholder="Search user..."
              className="w-full p-2 mb-4 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul>
              {filteredContacts.map((contact) => (
                <li
                  key={contact.id}
                  className={`cursor-pointer p-2 mb-2 rounded-md ${
                    selectedContact?.id === contact.id
                      ? "bg-blue-100"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setSelectedGroup(null);
                    setSelectedContact(contact);
                  }}
                >
                  {contact.name}
                </li>
              ))}
            </ul>
          </>
        )}
        <hr />
        <div className="flex justify-between items-center">
          <MdGroups size={24} />
          <span>Groups</span>
          <button
            className="hover:bg-gray-400 rounded-full my-2 p-1"
            onClick={() => setIsModalOpen(true)}
          >
            <IoIosAdd size={24} />
          </button>
        </div>

        {isGroupsLoading ? (
          <div className="flex justify-center mb-1">
            <LargeLoader />
          </div>
        ) : (
          <ul>
            {groups.map((group) => (
              <li
                key={group.groupId}
                className={`cursor-pointer p-2 mb-2 rounded-md ${
                  selectedGroup?.groupId === group.groupId
                    ? "bg-blue-100"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => {
                  setSelectedContact(null);
                  setSelectedGroup(group);
                }}
              >
                {group.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <GroupCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateGroup={handleCreateGroup}
      />
    </>
  );
};
