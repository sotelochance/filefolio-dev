"use client";

import { cn } from "@/lib/utils";
import DropzoneComponent from "react-dropzone";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "@/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import toast from "react-hot-toast";
import { User, filesRef, limitFilesRef } from "@/lib/Converters/TeamFiles";

function TeamDropzone({ teamId }: { teamId: string }) {
  const maxSize = 20971520;
  const [loading, setLoading] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const uploadPost = async (selectedFile: File) => {
    if (loading) return;
    if (!user) return;

    setLoading(true);
    const toastId = toast.loading("Uploading...");
    const userToStore: User = {
      id: user.id,
      name: user.fullName || "Anonymous",
      email: user.emailAddresses[0].emailAddress,
      image: user.imageUrl,
    };
    const docRef = await addDoc(filesRef(teamId), {
      filename: selectedFile.name,
      timestamp: serverTimestamp(),
      type: selectedFile.type,
      size: selectedFile.size,
      id: teamId + "_" + selectedFile.name,
      user: userToStore,
      fullName: user.fullName || "Anonymous",
      downloadURL: "", // Add the missing downloadURL property
    });

    const imageRef = ref(storage, `teams/${teamId}/files/${docRef.id}`);
    uploadBytes(imageRef, selectedFile).then(async (snapshot) => {
      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(doc(db, "teams", teamId, "files", docRef.id), {
        downloadURL: downloadURL,
      });
    });

    const applicationRef = ref(storage, `teams/${teamId}/files/${docRef.id}`);
    uploadBytes(applicationRef, selectedFile).then(async (snapshot) => {
      const downloadURL = await getDownloadURL(applicationRef);
      await updateDoc(doc(db, "teams", teamId, "files", docRef.id), {
        downloadURL: downloadURL,
      });
    });

    const textRef = ref(storage, `teams/${teamId}/files/${docRef.id}`);
    uploadBytes(textRef, selectedFile).then(async (snapshot) => {
      const downloadURL = await getDownloadURL(textRef);
      await updateDoc(doc(db, "teams", teamId, "files", docRef.id), {
        downloadURL: downloadURL,
      });
    });

    const videoRef = ref(storage, `teams/${teamId}/files/${docRef.id}`);
    uploadBytes(videoRef, selectedFile).then(async (snapshot) => {
      const downloadURL = await getDownloadURL(videoRef);
      await updateDoc(doc(db, "teams", teamId, "files", docRef.id), {
        downloadURL: downloadURL,
      });
    });

    const audioRef = ref(storage, `teams/${teamId}/files/${docRef.id}`);
    uploadBytes(audioRef, selectedFile).then(async (snapshot) => {
      const downloadURL = await getDownloadURL(audioRef);
      await updateDoc(doc(db, "teams", teamId, "files", docRef.id), {
        downloadURL: downloadURL,
      });
    });

    toast.success("File Uploaded!", { id: toastId });
    setLoading(false);
  };

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = async () => {
        await uploadPost(file);
      };
      reader.readAsArrayBuffer(file);
    });
  };
  return (
    <DropzoneComponent minSize={0} maxSize={maxSize} onDrop={onDrop}>
      {({
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        fileRejections,
      }) => {
        const isFileTooLarge =
          fileRejections.length > 0 && fileRejections[0].file.size > maxSize;

        return (
          <section className="mt-5 mb-10 mx-auto">
            <div
              {...getRootProps()}
              className={cn(
                "w-full h-52 flex justify-center items-center p-5 border border-dashed rounded-lg text-center",
                isDragActive
                  ? "bg-slate-200 text-slate-400 animate-pulse dark:bg-[#035FFE] dark:text-white dark:animate-pulse"
                  : "bg-slate-100/50 dark:bg-slate-800/80 text-slate-400"
              )}
            >
              {!isDragActive && "Click here or drop a file to upload!"}
              {isDragActive && !isDragReject && "Drop to upload this file!"}
              {isDragReject && "File type not accepted, sorry!"}
            </div>
          </section>
        );
      }}
    </DropzoneComponent>
  );
}

export default TeamDropzone;
