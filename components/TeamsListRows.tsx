"use client";

import {
  TeamMembers,
  teamMemberscCollectionGroupRef,
} from "@/lib/Converters/TeamMember";
import { useSession } from "@clerk/nextjs";
import { UsersRound } from "lucide-react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import CreateTeamButton from "./CreateTeamButton";
import TeamListRow from "./TeamListRow";

function TeamsListRows({ initialTeams }: { initialTeams: TeamMembers[] }) {
  const { session } = useSession();
  const [members, loading, error] = useCollectionData<TeamMembers>(
    session && teamMemberscCollectionGroupRef(session?.user.id!),
    {
      initialValue: initialTeams,
    }
  );
  if (members?.length === 0)
    return (
      <div className="flex flex-col justify-center items-center pt-40 space-y-2">
        <UsersRound className="h-10 w-10" />
        <h1 className="text-5xl font-extralight">Welcome!</h1>
        <h2 className="pb-10">Lets get started by creating your first team.</h2>
        <CreateTeamButton isLarge />
      </div>
    );
  return (
    <div className="">
      {members?.map((member, i) => (
        <TeamListRow
          key={member.teamId}
          teamId={member.teamId}
          teamName={member.teamName}
        />
      ))}
    </div>
  );
}

export default TeamsListRows;
