import TeamRosterPage from "../components/TeamRoster";
import { mensN3players,
    mensN3positions,
    mensN3staff } from "../data/mensN3Roster";


function MensN3RosterPage() {
  const staff = mensN3staff.map(({ id, firstName, lastName, role }) => ({
    id,
    name: `${firstName} ${lastName}`,
    role,
  }));

  return (
    <TeamRosterPage
      category="Nationale 3 masculine"
      title="Nos Red Swans"
      description="Découvrez les joueurs de l'équipe N3 masculin."
      photoTitle="Photo N3 masculine"
      teamImageUrl="/images/equipes/n3-masculine.jpg"
      players={mensN3players}
      positions={mensN3positions}
      staff={staff}
       />
  );
    
}

export default MensN3RosterPage;