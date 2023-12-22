"use client";
import { teamMemberAdminRef } from "./../lib/Converters/TeamMember";
import { getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

function useAdminId({ teamId }: { teamId: string }) {
  const [adminId, setAdminId] = useState<string>("");

  useEffect(() => {
    const fetchAdminStatus = async () => {
      const adminId = (await getDocs(teamMemberAdminRef(teamId))).docs.map(
        (doc) => doc.id
      )[0];
      setAdminId(adminId);
    };
    fetchAdminStatus();
  }, [teamId]);

  return adminId;
}

export default useAdminId;
