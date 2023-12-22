import { teamMemberscCollectionGroupRef } from "@/lib/Converters/TeamMember";
import { currentUser } from "@clerk/nextjs";
import { getDocs } from "firebase/firestore";
import TeamsListRows from "./TeamsListRows";

async function TeamsList() {
  const user = await currentUser();
  const teamsSnapshot = await getDocs(
    teamMemberscCollectionGroupRef(user?.id!)
  );
  const initialTeams = teamsSnapshot.docs.map((doc) => ({
    ...doc.data(),
    timestamp: null,
  }));

  return <TeamsListRows initialTeams={initialTeams} />;
}

export default TeamsList;
