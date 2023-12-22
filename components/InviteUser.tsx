"use client";

import { Button } from "./ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { Input } from "./ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { addTeamRef, teamMembersRef } from "@/lib/Converters/TeamMember";
import { useSession, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { getUserByEmailRef } from "@/lib/Converters/User";
import { useToast } from "./ui/use-toast";
import useAdminId from "@/hooks/useAdminId";
import { PlusCircleIcon } from "lucide-react";
import { ToastAction } from "./ui/toast";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sen } from "next/font/google";
import { set } from "firebase/database";
import ShareLink from "./ShareLink";
import DeleteTeamButton from "./DeleteTeamButton";
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

function InviteUser({
  teamId,
  teamName,
}: {
  teamId: string;
  teamName: string;
}) {
  const { session } = useSession();
  const { toast } = useToast();
  const adminId = useAdminId({ teamId });
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openInviteLink, setOpenInviteLink] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session?.user.id) return;
    toast({
      title: "Sending invite...",
      description: "We're sending an invite to the user.",
    });
    const querySnapshot = await getDocs(getUserByEmailRef(values.email));
    if (querySnapshot.empty) {
      toast({
        title: "User not found",
        description:
          "Please make sure the user is registered or Resend the Invite after they've Signed Up.",
        variant: "destructive",
      });
      return;
    }
    if (querySnapshot.docs[0].data().id === session?.user.id) {
      toast({
        title: "Error",
        description: "You cannot invite yourself.",
        variant: "destructive",
      });
      return;
    }
    if (querySnapshot.docs[0].data().id === adminId) {
      toast({
        title: "Error",
        description: "You cannot invite the admin.",
        variant: "destructive",
      });
      return;
    }
    if (
      querySnapshot.docs[0].data().id === querySnapshot.docs[0].data().teamId
    ) {
      toast({
        title: "Error",
        description: "This user is already in the team.",
        variant: "destructive",
      });
      return;
    } else {
      const user = querySnapshot.docs[0].data();
      await setDoc(addTeamRef(teamId, user.id), {
        userId: user.id,
        email: user.email,
        timestamp: serverTimestamp(),
        teamId: teamId,
        teamName: teamName,
        isAdmin: false,
        image: user.image || "",
      })
        .then(() => {
          setOpen(false);
          toast({
            title: "Added to Team!",
            description: "The user has been added to the team.",
            className: "bg-green-600 text-white",
            duration: 3000,
          });
          setOpenInviteLink(true);
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
            duration: 3000,
          });
        });
    }
    form.reset();
  }
  return (
    adminId === session?.user.id && (
      <>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircleIcon className="mr-2" />
              Invite Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Simpy invite a team member to your team by entering their email
                address.{" "}
                <span className="text-[#035FFE] font-bold">
                  (Note: They must be registered.)
                </span>
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col space-y-5"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="john@doe.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="mt-5 ml-auto sm:w-fit w-full" type="submit">
                  Send Invite
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <ShareLink
          isOpen={openInviteLink}
          setIsOpen={setOpenInviteLink}
          teamId={teamId}
          teamName={teamName}
        />
      </>
    )
  );
}

export default InviteUser;
