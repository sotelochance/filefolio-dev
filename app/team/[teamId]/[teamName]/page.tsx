import AdminControls from "@/components/AdminControls";
import TeamDropzone from "@/components/TeamDropzone";
import TeamMemberBadges from "@/components/TeamMemberBadges";
import TableWrapper from "@/components/teamTable/TableWrapper";
import { db } from "@/firebase";
import { File } from "@/lib/Converters/TeamFiles";
import { collection, getDocs } from "firebase/firestore";
import React from "react";
type Props = {
  params: {
    teamId: string;
    teamName: string;
  };
};

async function TeamPage({ params: { teamId, teamName } }: Props) {
  const docsResults = await getDocs(collection(db, "teams", teamId!, "files"));
  const skeletonFiles: File[] = docsResults.docs.map((doc) => ({
    id: doc.id,
    user: doc.data().user,
    filename: doc.data().filename || doc.id,
    timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined,
    fullName: doc.data().fullName,
    downloadURL: doc.data().downloadURL,
    size: doc.data().size,
    type: doc.data().type,
  }));
  return (
    <div className="border-t">
      <h2 className="mt-5 font-bold container space-y-5 text-2xl">
        Team {teamName} 's Files
      </h2>
      <section className="container space-y-5">
        <AdminControls teamId={teamId} teamName={teamName} />
        <TeamMemberBadges teamId={teamId} />
        <TeamDropzone teamId={teamId} />
        <TableWrapper skeletonFiles={skeletonFiles} teamId={teamId} />
      </section>
    </div>
  );
}

export default TeamPage;
