import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  Timestamp,
  addDoc,
} from "firebase/firestore";
import { firestore as firestoreDB } from "../services/firebaseConfig";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { GroupMessage } from "../types";

// check for existing user
export const checkUserExists = async (phoneNumber: string) => {
  try {
    // Query the Firestore collection where the phone number matches
    const usersRef = collection(firestoreDB, "users");
    const q = query(usersRef, where("phoneNumber", "==", phoneNumber));

    const querySnapshot = await getDocs(q);

    // Check if any document was returned
    if (!querySnapshot.empty) {
      // User exists
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const userId = userDoc.id; // Get the document ID

      return { exists: true, user: { ...userData, uid: userId } };
    } else {
      // User does not exist
      return { exists: false, user: null };
    }
  } catch (error) {
    console.error("Error checking user existence:", error);
    return { exists: false, user: null };
  }
};

// add user to group
export const addUserToGroup = async (groupId: string, userId: string) => {
  const groupRef = doc(firestoreDB, "groups", groupId);

  try {
    await updateDoc(groupRef, {
      members: arrayUnion(userId),
    });
  } catch (error) {
    console.error("Error adding user to group: ", error);
  }
};

// Add new group in firestore
export const createGroup = async (groupName: string, userId: string) => {
  const newGroupRef = doc(collection(firestoreDB, "groups"));

  try {
    await setDoc(newGroupRef, {
      name: groupName,
      members: [userId], // Add the creator as a member
      messages: [],
    });
  } catch (error) {
    console.error("Error creating group: ", error);
  }
};

// add group messages into firestore
export const sendGroupMessage = async (
  selectedGroupId: string,
  senderId: string,
  content: string,
  senderName: string
) => {
  if (!selectedGroupId || !content.trim()) return;

  const messagesRef = collection(
    firestoreDB,
    "groups",
    selectedGroupId,
    "messages"
  );

  const message: Omit<GroupMessage, "messageId"> = {
    senderId,
    timestamp: Timestamp.now(),
    content,
    senderName,
  };

  try {
    await addDoc(messagesRef, message);
  } catch (error) {
    console.error("Error sending message: ", error);
  }
};
