"use client";
import useAdminId from "@/hooks/useAdminId";
import { TeamMembers, teamMembersRef } from "@/lib/Converters/TeamMember";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Badge } from "./ui/badge";
import UserAvatar from "./UserAvatar";

function TeamMemberBadges({ teamId }: { teamId: string }) {
  const [members, loading, error] = useCollectionData<TeamMembers>(
    teamMembersRef(teamId)
  );
  const adminId = useAdminId({ teamId });
  if (loading && !members)
    return (
      <div className="flex justify-center text-md items-center">
        Loading<span className="animate-bounce delay-200">.</span>
        <span className="animate-bounce delay-400">.</span>
        <span className="animate-bounce delay-500">.</span>
      </div>
    );
  return (
    !loading && (
      <div className="p-2 border rounded-xl mt-5 container space-y-5">
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 p-2 container">
          {members?.map((member) => (
            <Badge
              variant="secondary"
              key={member.email}
              className="h-14 p-5 pl-2 pr-5 flex space-x-2"
            >
              <div className="flex items-center sapace-x-2">
                <UserAvatar name={member.email} image={member?.image} />
              </div>
              <div>
                <p>{member.email}</p>
                {member.userId === adminId && (
                  <p className="text-[#035FFE] animate-pulse">Admin</p>
                )}
              </div>
            </Badge>
          ))}
        </div>
      </div>
    )
  );
}

export default TeamMemberBadges;
