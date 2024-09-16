// src/hooks/useMessages.ts
import { useEffect, useState } from "react";
import { ref, onValue, push } from "firebase/database";
import { realtimeDb } from "../services/firebaseConfig";
import { Message } from "../types";

// fetch messages from realtimeDb using chatpath
export const useMessages = (
  currentUserId: string,
  selectedContactId: string | null
) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!selectedContactId) return;

    const combinedId =
      currentUserId < selectedContactId
        ? `${currentUserId}_${selectedContactId}`
        : `${selectedContactId}_${currentUserId}`;

    const chatPath = `chats/${combinedId}`;
    const messagesRef = ref(realtimeDb, chatPath);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messagesArray = data ? Object.values(data) : [];
      setMessages(messagesArray as Message[]);
    });

    return () => unsubscribe();
  }, [selectedContactId]);

  // add message in realtimeDb
  const sendMessage = (newMessage: string, selectedContactId: string) => {
    if (!newMessage.trim()) return;

    const message: Message = {
      sender: currentUserId,
      reciever: selectedContactId,
      message: newMessage,
      time: new Date().toLocaleString(),
    };
    // for uniquely and consistently manage the chat path we use this consistent logic for making chat path id
    const combinedId =
      currentUserId < selectedContactId
        ? `${currentUserId}_${selectedContactId}`
        : `${selectedContactId}_${currentUserId}`;
    const chatPath = `chats/${combinedId}`;
    const messagesRef = ref(realtimeDb, chatPath);

    push(messagesRef, message);
  };

  return { messages, sendMessage };
};
