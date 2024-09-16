import { GroupMessage } from "../../types";

interface GroupMessagesProps {
  groupMessages: GroupMessage[];
  userId: string;
}

export const GroupMessages = (props: GroupMessagesProps) => {
  const { groupMessages, userId } = props;

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {groupMessages.map((msg, index) => (
        <div
          key={index}
          className={`mb-4 ${
            msg.senderId === userId ? "text-right" : "text-left" //show right if the sender is same as user
          }`}
        >
          {msg.senderId !== userId && (
            <p className="text-xs text-gray-500">{msg.senderName}</p>
          )}
          <div
            className={`inline-block p-2 rounded-md ${
              msg.senderId === userId
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            <p>{msg.content}</p>
          </div>
          <small className="block text-xs text-gray-500 mt-1">
            {msg.timestamp.toDate().toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
};
