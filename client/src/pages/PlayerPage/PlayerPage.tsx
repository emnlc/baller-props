import { useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { GameLog } from "@/Interface";

import StatsChart from "./Chart/StatsChart";
import PlayerSidebar from "./Sidebar/PlayerSidebar";
import PlayerLogsTable from "./LogsTable/PlayerLogsTable";

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

  useEffect(() => {
    document.title = `${playerData.playerName} Stats`;
  });

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
        `${import.meta.env.VITE_PLAYER_STATS_URL}/${playerData.playerName}/${
          playerData.playerTeam
        }`
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

  const getOpponentTeam = (
    gameTitle: string | null,
    playerTeam: string | null
  ) => {
    if (!gameTitle || !playerTeam) return "";

    const separator = gameTitle.includes("@") ? "@" : "vs.";
    const teams = gameTitle.split(separator).map((team) => team.trim());

    return teams[0] === playerTeam ? teams[1] : teams[0];
  };

  const getCombinedLogs = (count: number) => {
    if (current_season_logs.length < count) {
      const additionalLogs = previous_season_logs.slice(
        -(count - current_season_logs.length)
      );
      return [...additionalLogs, ...current_season_logs];
    }
    return current_season_logs.slice(-count);
  };

  const last15Logs = getCombinedLogs(15);

  return (
    <>
      <div className="md:container mb-16 mt-8 mx-4 md:mx-auto flex flex-col gap-2 ">
        <div className="flex flex-col md:mx-0">
          <Link
            className="transition-all font-bold flex bg-accent-500 w-fit px-4 py-1 rounded-lg hover:bg-opacity-80 mb-4 items-center justify-center"
            to={"/nba"}
          >
            ← Back
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">
            {playerData.playerName}{" "}
            <span className="font-normal text-sm md:text-base">
              {playerData.playerTeam}
            </span>
          </h1>
          <h2 className="font-bold font-base md:text-lg">
            {playerData.gameTitle} - {cleanTime.toUpperCase()} EST
          </h2>
        </div>

        <div className="flex gap-2 xl:flex-row flex-col stats-container ">
          <StatsChart
            current_season_logs={current_season_logs}
            previous_season_logs={previous_season_logs}
            prop={playerData.propType}
            propLine={playerData.propLine}
            propOdd={playerData.propOdds}
          />
          <PlayerSidebar
            current_season_logs={current_season_logs}
            selected_prop={playerData.propType}
            prop_line={playerData.propLine}
            opponent={getOpponentTeam(
              playerData.gameTitle,
              playerData.playerTeam
            )}
          ></PlayerSidebar>
        </div>

        <PlayerLogsTable logs={last15Logs} />
      </div>
    </>
  );
};

export default PlayerPage;
