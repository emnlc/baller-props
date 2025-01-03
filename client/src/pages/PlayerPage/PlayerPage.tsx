import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { GameLog } from "@/Interface";

import StatsChart from "./StatsChart";

type PlayerLogsResponse = {
  player_id: number;
  current_season_logs: GameLog[];
  previous_season_logs: GameLog[];
};

const PlayerPage = () => {
  const location = useLocation();

  const useQueryData = () => {
    return useMemo(() => {
      const params = new URLSearchParams(location.search);
      const parsed = {
        playerName: params.get("playerName"),
        gameTitle: params.get("gameTitle"),
        propType: params.get("propType"),
        propLine: Number(params.get("propLine")),
        propOdds: params.get("propOdds"),
        propsTime: params.get("propsTime"),
        l10Avg: Number(params.get("l10Avg") || ""),
        l5HitRate: Number(params.get("l5HitRate")),
        l10HitRate: Number(params.get("l10HitRate")),
        l15HitRate: Number(params.get("l15HitRate")),
        playerTeam: params.get("playerTeam"),
        gameKey: params.get("gameKey"),
      };
      return parsed;
    }, []);
  };

  const playerData = useQueryData();

  const {
    data: { current_season_logs, previous_season_logs } = {
      current_season_logs: [],
      previous_season_logs: [],
    },
    isLoading,
    isError,
  } = useQuery<PlayerLogsResponse>({
    queryKey: ["playerLogs"],
    queryFn: async () => {
      const response = await fetch(
        `http://192.168.0.77:8080/api/nba/player-logs/${playerData.playerName}/${playerData.playerTeam}/${playerData.gameKey}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
  });

  if (!playerData.playerName) {
    return <div>No player data available</div>;
  }

  if (isLoading) return <div>Loading . . .</div>;
  if (isError) return <div>Error!</div>;

  const cleanTime = playerData.propsTime
    ? new Date(playerData.propsTime).toLocaleString("en-US", {
        weekday: "short",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "America/New_York",
      })
    : "Invalid date";

  return (
    <>
      <div className="md:container my-16 mx-auto">
        <div className="flex flex-col my-8">
          <h1 className="text-4xl font-black">
            {playerData.playerName}{" "}
            <span className="font-normal text-base">
              {playerData.playerTeam}
            </span>
          </h1>
          <h2 className="font-bold text-lg">
            {playerData.gameTitle} - {cleanTime.toUpperCase()} EST
          </h2>
        </div>

        <div className="chart-container">
          <p className="font-bold text-2xl">{playerData.propType}</p>

          <StatsChart
            current_season_logs={current_season_logs}
            previous_season_logs={previous_season_logs}
            prop={playerData.propType}
            propLine={playerData.propLine}
          />
        </div>

        <p>Prop Line: {playerData.propLine}</p>
        <p>Odds: {playerData.propOdds}</p>
        <p>L10 Avg: {playerData.l10Avg?.toFixed(2) ?? "N/A"}</p>
        <p>L5 Hit Rate: {playerData.l5HitRate}%</p>
        <p>L10 Hit Rate: {playerData.l10HitRate}%</p>
        <p>L15 Hit Rate: {playerData.l15HitRate}%</p>
        <p>L15 Hit Rate: {playerData.l15HitRate}%</p>
        <p>Game Key: {playerData.gameKey}</p>
        <p>{previous_season_logs.length}</p>
      </div>
    </>
  );
};

export default PlayerPage;
