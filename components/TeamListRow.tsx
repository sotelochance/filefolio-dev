"use client";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Skeleton } from "./ui/skeleton";
import { File, limitSortedFilesRef } from "@/lib/Converters/TeamFiles";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "@clerk/nextjs";
import { UsersRound } from "lucide-react";
import {
  TeamMembers,
  teamMemberAdminRef,
  teamMembersRef,
} from "@/lib/Converters/TeamMember";
import UserAvatar from "./UserAvatar";

function TeamListRow({
  teamId,
  teamName,
}: {
  teamId: string;
  teamName: string;
}) {
  const { session } = useSession();
  const router = useRouter();
  const [files, loading, error] = useCollectionData<File>(
    limitSortedFilesRef(teamId)
  );
  const row = (files?: File) => (
    <div
      key={teamId}
      onClick={() => router.push(`/team/${teamId}/${teamName}`)}
      className="mt-5 container space-y-5 flex p-5 items-center space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 border rounded-lg"
    >
      <div className="flex-1">
        <p className="font-bold text-lg underline">{teamName}</p>
        <p className="">
          {!files && "New Team"}
          {files && [
            files?.user.email || session?.user.emailAddresses[0].emailAddress,
          ]}
        </p>
        <p className="text-gray-400 line-clamp-1">
          {!files && "Get Started by adding a file..."}
          {files && "Added " + [files?.filename]}
        </p>
      </div>
      <div className="text-xs text-grey-400 text-right">
        <p className="mb-auto">
          {files
            ? new Date(files.timestamp).toLocaleDateString()
            : "No Files Yet"}
        </p>
        <p>Team #{teamId}</p>
      </div>
    </div>
  );

  return (
    <div>
      {loading && (
        <div className="mt-5 font-bold container space-y-5 text-2xl">
          <Skeleton className="h-4 w-1/6" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      )}

      {files?.length === 0 && !loading && row()}
      {files?.map((file) => row(file))}
    </div>
  );
}

export default TeamListRow;
