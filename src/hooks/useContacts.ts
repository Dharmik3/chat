import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { firestore as firestoreDB } from "../services/firebaseConfig";
import { Contact, UseContactsResult } from "../types";

// hooks for fetching contacts details from firestore -> users
export const useContacts = (userId: string): UseContactsResult => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const usersRef = collection(firestoreDB, "users");

    const unsubscribe = onSnapshot(
      usersRef,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const fetchedContacts: Contact[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Contact[];
        const filteredContacts = fetchedContacts.filter(
          (contact) => contact?.id != userId
        );
        setContacts(filteredContacts);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching contacts: ", error);
        setError(error);
        setLoading(false);
      }
    );
    // Cleanup: unsubscribe when component unmounts
    return () => unsubscribe();
  }, []);

  return { contacts, loading, error };
};
