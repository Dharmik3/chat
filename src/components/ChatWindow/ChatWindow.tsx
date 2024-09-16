import React, { useEffect, useRef, useState } from "react";
import Picker from "emoji-picker-react";
import { MdAddReaction } from "react-icons/md";
import { IoMdSend } from "react-icons/io";

import { useAuth } from "../../context/AuthContext";
import { useMessages } from "../../hooks/useMessages";
import { useGroupMessages } from "../../hooks/useGroupMessages";
import { addUserToGroup, sendGroupMessage } from "../../services/firebase";
import { GroupMessages, OneToOneMessages } from "../chatMessages";
import { AddUserDropDown } from "../AddUserDropDown";
import { Contact, Group } from "../../types";

export interface ChatWindowType {
  selectedContact: Contact | null;
  selectedGroup: Group | null;
}

export const ChatWindow = (props: ChatWindowType) => {
  const { selectedGroup, selectedContact } = props;
  const { user } = useAuth();
  const { groupMessages } = useGroupMessages(selectedGroup?.groupId ?? null);
  const { messages, sendMessage } = useMessages(
    user?.uid ?? "",
    selectedContact?.id ?? ""
  );

  const [newMessage, setNewMessage] = useState(""); //store new one to one message
  const [newGroupMessage, setNewGroupMessage] = useState<string>(""); //store group message
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); //state for managing emoji picker toggling
  const emojiPickerRef = useRef(null); // ref for clicking outside picker close the picker

  // send message to one to one chat
  const handleSendMessage = () => {
    if (newMessage.trim() && selectedContact) {
      sendMessage(newMessage, selectedContact.id);
      setNewMessage("");
    }
  };

  // add user to group
  const handleAddUserToGroup = async (userId: string) => {
    if (selectedGroup) {
      await addUserToGroup(selectedGroup.groupId, userId ?? "");
    }
  };

  // send group message
  const handleGroupSendMessage = () => {
    if (selectedGroup && newGroupMessage.trim()) {
      sendGroupMessage(
        selectedGroup.groupId,
        user?.uid as string,
        newGroupMessage,
        user?.name as string
      );
      setNewGroupMessage("");
    }
  };

  // on enter key press send the message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedContact?.id) {
        handleSendMessage();
      } else if (selectedGroup?.groupId) {
        handleGroupSendMessage();
      }
    }
  };

  //  clicks outside of the emoji close the emoji picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        // @ts-ignore
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    // Add event listener when emoji picker is shown
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <div className="w-full flex flex-col">
      {/* Chat Header */}
      <div className="bg-gray-100 p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-bold">
          {/* for one to one show contact name else group name */}
          {selectedContact?.name || selectedGroup?.name}
        </h3>
        {selectedGroup?.groupId && (
          <AddUserDropDown
            groupId={selectedGroup.groupId}
            onUserAdd={handleAddUserToGroup}
          />
        )}
      </div>

      {/* Chat Messages */}
      {/* if selected one to one chat then show one to one chat msg UI else group msg UI */}
      {selectedContact?.id ? (
        <OneToOneMessages messages={messages} userId={user?.uid ?? ""} />
      ) : (
        <GroupMessages groupMessages={groupMessages} userId={user?.uid ?? ""} />
      )}

      {/* Message Input */}
      {(selectedContact?.id || selectedGroup?.groupId) && (
        <div className="p-4 border-t flex items-center">
          {/* emoji piclker button */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`mr-2 ${
              showEmojiPicker && "bg-gray-200"
            } hover:bg-gray-300 rounded-full w-6`}
          >
            <MdAddReaction size={20} />
          </button>
          {/* emoji picker  */}
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              style={{ position: "absolute", bottom: "60px", zIndex: 1000 }}
            >
              <Picker
                onEmojiClick={(emojiData) => {
                  if (selectedContact?.id) {
                    setNewMessage(newMessage + emojiData.emoji);
                  } else {
                    setNewGroupMessage(newGroupMessage + emojiData.emoji);
                  }
                }}
              />
            </div>
          )}
          {/* input text message */}
          <input
            type="text"
            className="w-full p-2 border rounded-md  focus:outline-gray-300"
            placeholder="Type a message"
            value={selectedContact?.id ? newMessage : newGroupMessage}
            onChange={(e) =>
              selectedContact?.id
                ? setNewMessage(e.target.value)
                : setNewGroupMessage(e.target.value)
            }
            onKeyDown={handleKeyDown}
          />

          {/* send message button */}
          <button
            // based on the group or one to one chat passing the handler
            onClick={
              selectedContact?.id ? handleSendMessage : handleGroupSendMessage
            }
            className="ml-4 text-white bg-blue-600 hover:bg-blue-700 px-2 py-2 rounded-full"
          >
            <IoMdSend size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
