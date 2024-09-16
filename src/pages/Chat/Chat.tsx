import { useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { ChatWindow } from "../../components/ChatWindow";
import { Contact, Group } from "../../types";

// Home page
export const Chat = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  return (
    <div className="flex h-screen">
      {/* Sidepanel to show contacts list and groups list */}
      <Sidebar
        selectedContact={selectedContact}
        setSelectedContact={setSelectedContact}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
      />

      {/* Chat Window */}
      <ChatWindow
        selectedContact={selectedContact}
        selectedGroup={selectedGroup}
      />
    </div>
  );
};
