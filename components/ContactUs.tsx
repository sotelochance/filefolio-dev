"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { MessageSquare, PlusSquare } from "lucide-react";
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
import { sendMessageRef } from "@/lib/Converters/Message";

function ContactUsButton({ isLarge }: { isLarge?: boolean }) {
  const [loading, setLoading] = useState(false);
  const { isSignedIn, user } = useUser();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const formSchema = z.object({
    message: z.string().nonempty("Message must not be blank."),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  async function sendMessage(values: z.infer<typeof formSchema>) {
    if (!isSignedIn) return;
    setLoading(true);
    toast({
      title: "Sending Message...",
      description: "Your message is being sent.",
      duration: 5000,
    });
    await setDoc(sendMessageRef(user.id), {
      userId: user.id,
      email: user.emailAddresses[0].emailAddress,
      timestamp: serverTimestamp(),
      message: values.message,
    })
      .then(() => {
        toast({
          title: "Message Sent",
          description: "Your message has been sent.",
          className: "bg-green-600 text-white",
          duration: 5000,
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Your message could not be sent.",
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
              <MessageSquare />
              Contact Us
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Contact Us</DialogTitle>
              <DialogDescription>
                Send us a message and we will get back to you as soon as
                possible. We will respond to your email address.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(sendMessage)}
                className="flex flex-col space-y-5"
                autoComplete="off"
              >
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Your Message..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="mt-5 ml-auto sm:w-fit w-full" type="submit">
                  Send Message
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
                <MessageSquare />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent>Contact Us</HoverCardContent>
          </HoverCard>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Us</DialogTitle>
            <DialogDescription>
              Send us a message and we will get back to you as soon as possible.
              We will respond to your email address.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(sendMessage)}
              className="flex flex-col space-y-5"
            >
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Your Message..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="mt-5 ml-auto sm:w-fit w-full" type="submit">
                Send Message
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ContactUsButton;
