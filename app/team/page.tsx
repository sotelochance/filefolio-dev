import CreateTeamButton from "@/components/CreateTeamButton";
import TeamsList from "@/components/TeamsList";
import React from "react";

function MyTeams() {
  return (
    <div className="border-t">
      <h2 className="mt-5 font-bold container space-y-5 text-2xl">My Teams</h2>
      <TeamsList />
      <section className="container space-y-5"></section>
    </div>
  );
}

export default MyTeams;
