import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { IoIosAdd, IoMdLogOut } from "react-icons/io";
import { MdGroups } from "react-icons/md";

import { useAuth } from "../../context/AuthContext";
import { useGroups } from "../../hooks/useGroups";
import { LargeLoader } from "../Loader";
import { Contact, Group } from "../../types";

export interface SidebarSmallScreenProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => void;
  isContactsLoading: boolean;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filteredContacts: Contact[];
  selectedContact: Contact | null;
  selectedGroup: Group | null;
  setSelectedGroup: React.Dispatch<React.SetStateAction<Group | null>>;
  setSelectedContact: React.Dispatch<React.SetStateAction<Contact | null>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SidebarSmallScreen = (props: SidebarSmallScreenProps) => {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    handleLogout,
    isContactsLoading,
    searchTerm,
    setSearchTerm,
    filteredContacts,
    selectedContact,
    selectedGroup,
    setSelectedContact,
    setSelectedGroup,
    setIsModalOpen,
  } = props;
  const { user } = useAuth();
  const { groups, loading: isGroupsLoading } = useGroups(user?.uid);
  return (
    <div
      className={`fixed top-0 left-0 w-64 h-full bg-gray-100 p-4 border-r overflow-y-auto transform md:hidden transition-transform duration-300 ease-in-out z-50 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex justify-between mb-2 items-center">
        <span>{user?.name}</span>
        <button
          className="font-medium rounded-md text-sm px-2 py-1.5 ml-auto"
          onClick={handleLogout}
        >
          <IoMdLogOut size={24} />
        </button>
        <button className=" text-2xl" onClick={() => setIsSidebarOpen(false)}>
          <AiOutlineClose />
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
                  setIsSidebarOpen(false); // Close sidebar after selecting contact
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
                setIsSidebarOpen(false); // Close sidebar after selecting group
              }}
            >
              {group.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
