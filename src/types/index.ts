import firebase from "firebase/compat/app";

export interface Message {
  sender: string;
  message: string;
  time: string;
  reciever: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
}

export interface Group {
  groupId: string;
  name: string;
  members: string[]; // Array of user UIDs
  messages: Message[];
}

export interface GroupMessage {
  messageId: string;
  senderId: string;
  timestamp: firebase.firestore.Timestamp;
  content: string;
  senderName: string;
}

export interface User {
  phoneNumber: string;
  createdAt: string;
  name: string;
  uid: string;
}

export interface UseGroupsResult {
  groups: Group[];
  loading: boolean;
  error: Error | null;
}

export interface UseContactsResult {
  contacts: Contact[];
  loading: boolean;
  error: Error | null;
}
