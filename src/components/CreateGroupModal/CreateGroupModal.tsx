// GroupCreationModal.tsx
import React, { useState } from "react";

interface GroupCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (groupName: string) => void;
}

const GroupCreationModal = (props: GroupCreationModalProps) => {
  const { isOpen, onClose, onCreateGroup } = props;
  const [groupName, setGroupName] = useState<string>("");

  // create group handler
  const handleCreate = () => {
    if (groupName.trim()) {
      onCreateGroup(groupName);
      setGroupName("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">Create a New Group</h2>
        <input
          type="text"
          placeholder="Enter group name"
          className="w-full p-2 mb-4 border rounded-md focus:outline-gray-500"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-300 px-2 py-1 rounded-md mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-2 py-1 rounded-md"
            onClick={handleCreate}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupCreationModal;
