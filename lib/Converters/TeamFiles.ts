import { db } from "@/firebase";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  collection,
  limit,
  orderBy,
  query,
} from "firebase/firestore";

export interface User {
  id: string;
  email: string;
  name: string;
  image: string;
}

export interface File {
  id: string;
  user: User;
  filename: string;
  fullName: string;
  timestamp: Date;
  downloadURL: string;
  type: string;
  size: number;
}

const filesConverter: FirestoreDataConverter<File> = {
  toFirestore: function (file: File): DocumentData {
    return {
      filename: file.filename,
      timestamp: file.timestamp,
      user: file.user,
      type: file.type,
      size: file.size,
      id: file.id,
      fullName: file.fullName,
    };
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): File {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      user: data.user,
      filename: data.filename,
      fullName: "",
      timestamp: data.timestamp?.toDate(),
      downloadURL: "",
      type: "",
      size: 0,
    };
  },
};

export const filesRef = (teamId: string) =>
  collection(db, "teams", teamId, "files").withConverter(filesConverter);

export const limitFilesRef = (teamId: string) =>
  query(filesRef(teamId), limit(10));

export const sortedFilesRef = (teamId: string) =>
  query(filesRef(teamId), orderBy("timestamp", "asc"));

export const limitSortedFilesRef = (teamId: string) =>
  query(query(filesRef(teamId), limit(1)), orderBy("timestamp", "desc"));
