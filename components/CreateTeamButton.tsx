"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { PlusSquare } from "lucide-react";
import { use, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useToast } from "./ui/use-toast";
import { setDoc } from "firebase/firestore";
import { addTeamRef } from "@/lib/Converters/TeamMember";
import { serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import md5 from "md5";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { set } from "firebase/database";

function CreateTeamButton({ isLarge }: { isLarge?: boolean }) {
  const [loading, setLoading] = useState(false);
  const { isSignedIn, user } = useUser();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const formSchema = z.object({
    name: z
      .string()
      .nonempty("Team name must not be blank.")
      .refine(
        (value) => !/\s/.test(value),
        "Team name must not contain spaces."
      ),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function createTeam(values: z.infer<typeof formSchema>) {
    if (!isSignedIn) return;
    setLoading(true);
    toast({
      title: "Creating Team...",
      description: "Please wait while we create your team.",
      duration: 5000,
    });
    const teamId = md5(uuidv4()).substring(0, 5);
    const teamName = values.name;
    await setDoc(addTeamRef(teamId, user.id), {
      userId: user.id!,
      email: user.emailAddresses[0].emailAddress!,
      timestamp: serverTimestamp(),
      isAdmin: true,
      teamName: teamName,
      teamId: teamId,
      image: user.imageUrl || "",
    })
      .then(() => {
        toast({
          title: "Team Created",
          description: "Your team has been created.",
          className: "bg-green-600 text-white",
          duration: 5000,
        });
        router.push(`/team/${teamId}/${teamName}`);
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "There was an error creating your team.",
          className: "bg-red-600 text-white",
          duration: 5000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
    form.reset();
    setOpen(false);
  }
  if (isLarge) {
    return (
      <>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)} variant={"outline"}>
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Team</DialogTitle>
              <DialogDescription>
                This will be the Name of your Team.{" "}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(createTeam)}
                className="flex flex-col space-y-5"
                autoComplete="off"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="TeamName" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="mt-5 ml-auto sm:w-fit w-full" type="submit">
                  Create Team
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </>
    );
  }
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button onClick={() => setOpen(true)} variant={"ghost"}>
                <PlusSquare />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent>Create New Team</HoverCardContent>
          </HoverCard>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Team</DialogTitle>
            <DialogDescription>
              This will be the Name of your Team.{" "}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(createTeam)}
              className="flex flex-col space-y-5"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="TeamName" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="mt-5 ml-auto sm:w-fit w-full" type="submit">
                Create Team
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateTeamButton;
