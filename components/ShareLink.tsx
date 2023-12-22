"use client";

import { Copy } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dispatch, SetStateAction } from "react";
import { useToast } from "./ui/use-toast";

function ShareLink({
  isOpen,
  teamId,
  teamName,
  setIsOpen,
}: {
  isOpen: boolean;
  teamId: string;
  teamName: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { toast } = useToast();
  const host = window.location.host;
  const linktoChat =
    process.env.NODE_ENV === "development"
      ? `http://${host}/team/${teamId}/${teamName}`
      : `https://${host}/team/${teamId}/${teamName}`;

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(linktoChat);
      console.log("Link copied to clipboard!");
      toast({
        title: "Copied Successfully",
        description:
          "Share this link with your team members (Note: They must be logged in to access the team)",
        className: "bg-green-600 text-white",
      });
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  }
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      defaultOpen={isOpen}
    >
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <Copy className="mr-2" />
          Share Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Link</DialogTitle>
          <DialogDescription>
            Any team member who has been{" "}
            <span className="text-[#035FFE]">granted access</span> can use this
            link to access the team.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" value={linktoChat} readOnly />
          </div>
          <Button type="submit" onClick={() => copyToClipboard()}>
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ShareLink;
