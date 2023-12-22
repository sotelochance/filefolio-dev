"use client";

import { useState } from "react";
import { Button } from "./ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { useToast } from "./ui/use-toast";
import { useSession } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import useAdminId from "@/hooks/useAdminId";

function DeleteTeamButton({ teamId }: { teamId: string }) {
  const { session } = useSession();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const adminId = useAdminId({ teamId });

  const handleDelete = async () => {
    toast({
      title: "Deleting Team",
      description: "Please wait while we delete your team.",
    });
    console.log("Deleting Team :: ", teamId);

    await fetch("/api/team/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ teamId: teamId }),
    })
      .then((res) => {
        toast({
          title: "Team Deleted",
          description: "Your team has been deleted.",
          className: "bg-green-600 text-white",
          duration: 3000,
        });
        router.push("/team");
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: "Your team could not be deleted.",
          variant: "destructive",
        });
      })
      .finally(() => setOpen(false));
  };

  return (
    adminId === session?.user.id && (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive">Delete Team</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All files and team members will be
              deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 space-x-2">
            <Button variant={"destructive"} onClick={handleDelete}>
              Delete
            </Button>
            <Button variant={"ghost"} onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
}

export default DeleteTeamButton;
