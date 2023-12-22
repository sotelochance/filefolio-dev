import DeleteTeamButton from "./DeleteTeamButton";
import InviteUser from "./InviteUser";

function AdminControls({
  teamId,
  teamName,
}: {
  teamId: string;
  teamName: string;
}) {
  return (
    <div className="flex mx-auto my-5 space-x-5 font-bold text-2xl">
      <InviteUser teamId={teamId} teamName={teamName} />
      {/* <DeleteTeamButton teamId={teamId} /> */}
    </div>
  );
}

export default AdminControls;
