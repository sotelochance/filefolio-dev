import { UserButton } from "@clerk/nextjs";
import { Arrow } from "@radix-ui/react-dropdown-menu";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import homeImage from "../assets/home.png";
import Overview from "../assets/team2.png";

export default function Home() {
  return (
    <main className="">
      <div className="flex flex-col lg:flex-row items-center bg-[#EEEEEE] dark:bg-slate-800">
        <div className="p-10 flex flex-col bg-[#EEEEEE] dark:bg-slate-800 dark:text-white space-y-5">
          <h1 className="text-5xl font-bold ml-20">
            Welcome to FileFolio <br />
            <br />
            Storing your files in the <br /> cloud has never been easier. <br />{" "}
            All in one place.
          </h1>
          <p className="pb-20 ml-20">
            FileFolio is a cloud storage platform that allows you to store{" "}
            <br /> your files in the cloud and access them anywhere.
          </p>
          <Link
            href="/my-files"
            className="flex cursor-pointer p-5 rounded-lg ml-20 text-white bg-black hover:opacity-80 dark:bg-gray-900 w-fit transition-opacity duration-300"
          >
            Try it for free
            <ArrowRight className="ml-5" />
          </Link>
        </div>
        <div>
          <img
            className="p-10 h-full"
            src={homeImage.src}
            alt="Home"
            width={1000}
            height={500}
          />
        </div>
      </div>
      <section
        className="p-10 flex flex-col lg:flex-row items-center bg-[#FFFFFF] dark:bg-slate-700"
        id="overview"
      >
        <div className="ml-20 justify-center items-center">
          <span className="text-5xl font-bold m -20 justify-center text-center my-10">
            Overview & Features
          </span>
          <h1 className="font-semibold mt-10">Overview</h1>
          <p className="mt-5">
            FileFolio is a web application that allows users to manage and
            control their files in a dedicated storage space. It supports team
            collaboration by providing equal access to project files, fostering
            productivity. The platform's mission is to empower users in
            efficient file and project management, enhancing work and study
            environments.
          </p>
          <h1 className="font-semibold mt-10">Features</h1>
          <p className="mt-5">
            The system seamlessly integrates user registration through Google
            email addresses, <br /> employing a secure email verification
            process via a confirmation link for access to the <br /> platform.
            The file management feature offers users an intuitive way to
            organize and <br />
            manipulate digital documents, facilitating easy access and efficient
            organization through <br />
            user-friendly tools. Additionally, the profile customization feature
            allows users to personalize <br />
            their experience by tailoring profiles with details, pictures, and
            preferences. In the event of login issues, the account recovery
            feature ensures a reliable and secure process, involving email
            verification or security questions. Admin controls enhance overall
            system management and oversight, providing comprehensive
            functionality and a user-friendly environment.
          </p>
        </div>
        <div className="w-300">
          <img
            src={Overview.src}
            alt="FileFolio Team Management"
            width={3000}
            height={3000}
          />
        </div>
      </section>
    </main>
  );
}
