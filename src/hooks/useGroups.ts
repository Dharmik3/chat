// src/hooks/useGroups.ts
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { firestore as forestoreDB } from "../services/firebaseConfig";
import { Group, UseGroupsResult } from "../types";

// fetch groups from firestore
export const useGroups = (uid: string | undefined): UseGroupsResult => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const groupsRef = collection(forestoreDB, "groups");
    const groupsQuery = query(
      groupsRef,
      where("members", "array-contains", uid)
    );

    const unsubscribe = onSnapshot(
      groupsQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const fetchedGroups: Group[] = snapshot.docs.map((doc) => ({
          groupId: doc.id,
          ...doc.data(),
        })) as Group[];
        setGroups(fetchedGroups);
        setLoading(false);
      },
      (error: Error) => {
        console.error("Error fetching groups: ", error);
        setError(error);
        setLoading(false);
      }
    );

    // Cleanup the Firestore listener on component unmount
    return () => unsubscribe();
  }, [uid]);

  return { groups, loading, error };
};
