import TeamRosterPage from "../components/TeamRoster";
import { womensN3players,
    womensN3positions,
    womensN3staff } from "../data/womensN3Roster";



function WomensN3RosterPage() {
  return (
    <TeamRosterPage
      category="Nationale 3 féminine"
      title="Nos Red Girls"
      description="Découvrez les joueuses de l'équipe N3 féminine."
      photoTitle="Photo N3 féminine"
    teamImageUrl="/images/equipes/n3f.jpg"
      players={womensN3players}
      positions={womensN3positions}
      staff={womensN3staff}
      />
  )
}

export default WomensN3RosterPage;