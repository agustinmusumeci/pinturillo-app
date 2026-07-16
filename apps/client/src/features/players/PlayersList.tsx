import { type PlayerData } from "@pinturillo/shared/src/players";

export default function PlayersList({ players }: { players: Array<PlayerData> }) {
  return (
    <div>
      {players.map((player) => (
        <div
          key={player.id}
          className="flex flex-row gap-5"
        >
          <span>Player: {player.name}</span>
          <span>Wins: {player.winGames}</span>
        </div>
      ))}
    </div>
  );
}
