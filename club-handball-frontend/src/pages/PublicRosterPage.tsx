import { useEffect, useState } from "react";
import { useParams } from "react-router";
import API from "../services/api";

export default function PublicRosterPage() {
  const { teamSlug } = useParams();

  const [team, setTeam] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoster = async () => {
      if (!teamSlug) return;

      try {
        const response = await API.get(
          `/players/public/team/${teamSlug}/roster`
        );

        setTeam(response.data.team);
        setPlayers(response.data.players || []);
        setStaff(response.data.staff || []);
      } catch (error) {
        console.error("Erreur récupération effectif :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoster();
  }, [teamSlug]);

  if (loading) {
    return <div>Chargement de l’effectif...</div>;
  }

  if (!team) {
    return <div>Équipe introuvable.</div>;
  }

  return (
    <main>
      <h1>{team.name}</h1>

      <h2>Joueurs</h2>
      {players.map((player) => (
        <div key={player._id}>
          {player.firstName} {player.lastName}
        </div>
      ))}

      <h2>Staff</h2>
      {staff.map((member) => (
        <div key={member._id}>
          {member.firstName} {member.lastName}
        </div>
      ))}
    </main>
  );
}