import { Message } from "../../types";

interface OneToOneMessagesProps {
  messages: Message[];
  userId: string;
}

export const OneToOneMessages = (props: OneToOneMessagesProps) => {
  const { messages, userId } = props;

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((msg, index) => {
        return (
          <div
            key={index}
            className={`mb-4 ${
              msg.sender === userId ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-2 rounded-md ${
                msg.sender === userId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <p>{msg.message}</p>
            </div>
            <small className="block text-xs text-gray-500 mt-1">
              {msg.time}
            </small>
          </div>
        );
      })}
    </div>
  );
};
