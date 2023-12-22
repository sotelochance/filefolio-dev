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

export interface TeamMembers {
  userId: string;
  email: string;
  timestamp: Date | null;
  isAdmin: boolean;
  teamId: string;
  teamName: string;
  image: string;
}

const teamMembersConverter: FirestoreDataConverter<TeamMembers> = {
  toFirestore: function (member: TeamMembers): DocumentData {
    return {
      userId: member.userId,
      email: member.email,
      timestamp: member.timestamp,
      isAdmin: !!member.isAdmin,
      teamId: member.teamId,
      teamName: member.teamName,
      image: member.image,
    };
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): TeamMembers {
    const data = snapshot.data(options);

    return {
      userId: data.userId,
      email: data.email,
      timestamp: data.timestamp,
      isAdmin: data.isAdmin,
      teamId: data.teamId,
      teamName: data.teamName,
      image: data.image,
    };
  },
};

export const addTeamRef = (teamId: string, userId: string) =>
  doc(db, "teams", teamId, "members", userId).withConverter(
    teamMembersConverter
  );

export const teamMembersRef = (teamId: string) =>
  collection(db, "teams", teamId, "members").withConverter(
    teamMembersConverter
  );

export const teamMemberAdminRef = (teamId: string) =>
  query(
    collection(db, "teams", teamId, "members"),
    where("isAdmin", "==", true)
  ).withConverter(teamMembersConverter);

export const teamMemberscCollectionGroupRef = (userId: string) =>
  query(
    collectionGroup(db, "members"),
    where("userId", "==", userId)
  ).withConverter(teamMembersConverter);
