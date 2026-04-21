import type { DocumentData, DocumentSnapshot, QueryDocumentSnapshot } from "firebase/firestore";

type WithId<T> = T & { id: string };

export const mapQueryDoc = <T extends DocumentData>(snapshot: QueryDocumentSnapshot<DocumentData>): WithId<T> => {
  const data = snapshot.data() as T & { id?: string };
  return {
    ...data,
    id: data.id ?? snapshot.id,
  };
};

export const mapDoc = <T extends DocumentData>(snapshot: DocumentSnapshot<DocumentData>): WithId<T> | null => {
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as T & { id?: string };
  return {
    ...data,
    id: data.id ?? snapshot.id,
  };
};

