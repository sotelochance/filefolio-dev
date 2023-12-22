import { db } from "@/firebase";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  collection,
  collectionGroup,
  doc,
  query,
  where,
} from "firebase/firestore";
import { filesRef } from "./TeamFiles";

export interface Messages {
  userId: string;
  email: string;
  timestamp: Date | null;
  message: string;
}

const MessageConverter: FirestoreDataConverter<Messages> = {
  toFirestore: function (message: Messages): DocumentData {
    return {
      userId: message.userId,
      email: message.email,
      timestamp: message.timestamp,
      message: message.message,
    };
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Messages {
    const data = snapshot.data(options);

    return {
      userId: data.userId,
      email: data.email,
      timestamp: data.timestamp,
      message: data.message,
    };
  },
};

export const sendMessageRef = (userId: string) =>
  doc(db, "messages", userId).withConverter(MessageConverter);

export const messagesRef = (userId: string) =>
  collection(db, "messages", userId).withConverter(MessageConverter);
