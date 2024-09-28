import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestore as firestoreDB } from "../services/firebaseConfig";
import { GroupMessage } from "../types";

// fetch group messages from firestore -> groups
export const useGroupMessages = (selectedGroupId: string | null) => {
  const [groupMessages, setGroupMessages] = useState<GroupMessage[]>([]);

  useEffect(() => {
    if (!selectedGroupId) return;

    const messagesRef = collection(
      firestoreDB,
      "groups",
      selectedGroupId,
      "messages"
    );
    const messagesQuery = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages: GroupMessage[] = snapshot.docs.map((doc) => ({
        messageId: doc.id,
        ...doc.data(),
      })) as GroupMessage[];
      setGroupMessages(fetchedMessages);
    });

    // Cleanup: unsubscribe when component unmounts or group changes
    return () => unsubscribe();
  }, [selectedGroupId]);

  return { groupMessages };
};
