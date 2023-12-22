import { db } from "@/firebase";

import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  collection,
  query,
  where,
} from "firebase/firestore";

export interface User {
  email: string;
  name: string;
  image: string;
  id: string;
  teamId: string;
}

const userConverter: FirestoreDataConverter<User> = {
  toFirestore: function (user: User): DocumentData {
    return {
      email: user.email,
      name: user.name,
      image: user.image,
      id: user.id,
    };
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): User {
    const data = snapshot.data(options);
    return {
      email: data.email,
      name: data.name,
      image: data.image,
      id: data.id,
      teamId: data.teamId,
    };
  },
};

export const getUserByEmailRef = (email: string) =>
  query(
    collection(db, "clerk_users"),
    where("email", "==", email)
  ).withConverter(userConverter);
