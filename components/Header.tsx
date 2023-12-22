"use client";
import Image from "next/image";
import Link from "next/link";
import {
  SignInButton,
  SignedOut,
  UserButton,
  SignedIn,
  useUser,
} from "@clerk/nextjs";
import { doc, getDocs } from "firebase/firestore";
import logoImage from "../assets/logo.png";
import { ThemeToggler } from "./ThemeToggler";
import Logo from "./Logo";
import CreateTeamButton from "./CreateTeamButton";
import { addDoc, collection, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { User, getUserByEmailRef } from "@/lib/Converters/User";
import { useEffect } from "react";
import { Contact, File, LogIn, Scroll, UsersRound } from "lucide-react";
import { dark } from "@clerk/themes";
import { Link as ScrollLink } from "react-scroll";
import ContactUsButton from "./ContactUs";
function Header() {
  const { isSignedIn, user } = useUser();

  async function storeUser() {
    if (!user) return;
    const clerkUserRef = collection(db, "clerk_users");
    const querySnapshot = await getDocs(
      getUserByEmailRef(user!.emailAddresses[0].emailAddress)
    );
    const userRef =
      querySnapshot.docs.length > 0 ? querySnapshot.docs[0].data() : null;
    if (userRef?.email === user!.emailAddresses[0].emailAddress) {
      return;
    } else {
      await addDoc(clerkUserRef, {
        id: user!.id,
        name: user!.fullName || "Anonymous",
        email: user!.emailAddresses[0].emailAddress,
        image: user!.imageUrl,
      });
    }
  }

  useEffect(() => {
    if (isSignedIn) {
      storeUser();
    }
  }, [isSignedIn]);
  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg dark:bg-gray-900">
      <nav className="flex flex-col sm:flex-row items-center p-5 pl-2 bg-white dark:bg-gray-900 max-w-7xl mx-auto">
        <Logo />
        <Link href="/">
          <h1 className="text-2xl">
            <span className="font-bold">File</span>Folio
          </h1>
        </Link>
        <div className="flex-1 flex items-center justify-end space-x-10">
          <SignedOut>
            <ScrollLink
              to="overview"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className="hover:underline flex cursor-pointer"
            >
              <Scroll size={24} className="mr-2" />
              Overview & Features
            </ScrollLink>
            <div className="hover:underline flex">
              <LogIn size={24} className="mr-2" />
              <SignInButton afterSignInUrl="/" />
            </div>
          </SignedOut>
          <SignedIn>
            <Link
              href="/my-files"
              className="hover:underline flex cursor-pointer"
            >
              <File size={24} className="mr-2" />
              My Files
            </Link>
            <Link href="/team" className="hover:underline flex">
              <UsersRound size={24} className="mr-2" />
              My Teams
            </Link>
            <div className="hover:underline flex">
              <CreateTeamButton />
              <ContactUsButton />
            </div>
          </SignedIn>
          <ThemeToggler />
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>
    </header>
  );
}

export default Header;
