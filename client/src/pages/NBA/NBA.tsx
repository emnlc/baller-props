import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import PropsTable from "./PropsTable";
import PropsFilter from "./PropsFilter";
import ModifierFilters from "./ModifierFilters";

import { GameLog, gamesData } from "@/Interface";

const NBAPage = () => {
  const [filterModifiers, setFilterModifiers] = useState({
    goblin: true,
    demon: true,
    standard: true,
  });

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortColumn, setSortColumn] = useState<
    "l10Avg" | "l5HitRate" | "l10HitRate" | "l15HitRate"
  >("l10HitRate");
  const [selectedProps, setSelectedProps] = useState<string[]>([]);

  const {
    data: gamesData,
    isLoading,
    isError,
  } = useQuery<gamesData>({
    queryKey: ["games"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_STATS_URL}`);
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });

  if (isLoading) return <div>Loading . . .</div>;
  if (isError) return <div>Error!</div>;

  const calculateHitRate = (
    logs: GameLog[],
    statType: keyof GameLog,
    line: number,
    numGames: number
  ): number => {
    const recentGames = logs.slice(-numGames);
    const hits = recentGames.filter(
      (game) => typeof game[statType] === "number" && game[statType] >= line
    ).length;
    return recentGames.length
      ? Math.round((hits / recentGames.length) * 100)
      : 0;
  };

  const calculateL10Avg = (
    logs: GameLog[],
    statType: keyof GameLog
  ): number | null => {
    const last10Games = logs.slice(-10);
    const total = last10Games.reduce((sum, game) => {
      const value = game[statType];
      return sum + (typeof value === "number" ? value : 0);
    }, 0);
    return last10Games.length ? total / last10Games.length : null;
  };

  const handleSort = (
    column: "l10Avg" | "l5HitRate" | "l10HitRate" | "l15HitRate"
  ) => {
    if (sortColumn === column) {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handlePropSelection = (prop: string) => {
    setSelectedProps((prevSelected) =>
      prevSelected.includes(prop)
        ? prevSelected.filter((item) => item !== prop)
        : [...prevSelected, prop]
    );
  };

  const sortedData = gamesData
    ? Object.entries(gamesData.lines)
        .flatMap(([playerName, playerProps]) => {
          const game = Object.values(gamesData.players).find((g) =>
            Object.keys(g.teams).some((teamKey) =>
              Object.keys(g.teams[teamKey]).includes(playerName)
            )
          );

          const gameKey = game
            ? Object.keys(gamesData.players).find((key) =>
                Object.keys(gamesData.players[key].teams).some((teamKey) =>
                  Object.keys(gamesData.players[key].teams[teamKey]).includes(
                    playerName
                  )
                )
              )
            : "Unknown Game";

          const gameTitle = game
            ? `${game.away_team} @ ${game.home_team}`
            : "Unknown Game";

          const playerLogs = game
            ? Object.values(game.teams)
                .flatMap((team) => Object.entries(team))
                .find(([name]) => name === playerName)?.[1]?.current_season_logs
            : [];

          const playerTeam = game
            ? Object.keys(game.teams).find((teamKey) =>
                Object.keys(game.teams[teamKey]).includes(playerName)
              )
            : "Unknown Team";

          return playerProps.map((prop) => {
            const statType = prop.details.stat_type as keyof GameLog;
            const l10Avg = playerLogs
              ? calculateL10Avg(playerLogs, statType)
              : null;

            return {
              playerName,
              gameTitle,
              gameKey: gameKey ?? "Unknown Game",
              playerTeam: playerTeam ?? "Unknown Team",
              propType: prop.details.stat_type,
              propLine: prop.details.line_score,
              propOdds: prop.details.odds_type,
              propsTime: prop.details.board_time,
              l10Avg,
              l5HitRate: playerLogs
                ? calculateHitRate(
                    playerLogs,
                    statType,
                    prop.details.line_score,
                    5
                  )
                : 0,
              l10HitRate: playerLogs
                ? calculateHitRate(
                    playerLogs,
                    statType,
                    prop.details.line_score,
                    10
                  )
                : 0,
              l15HitRate: playerLogs
                ? calculateHitRate(
                    playerLogs,
                    statType,
                    prop.details.line_score,
                    15
                  )
                : 0,
            };
          });
        })
        .filter((row) => row.propType !== "Dunks")
        .filter((row) => {
          if (row.propOdds === "goblin") return filterModifiers.goblin;
          if (row.propOdds === "demon") return filterModifiers.demon;
          if (row.propOdds === "standard") return filterModifiers.standard;
          return true;
        })

        .filter((row) =>
          selectedProps.length > 0 ? selectedProps.includes(row.propType) : true
        )
        .sort((a, b) => {
          const valueA = a[sortColumn] ?? 0;
          const valueB = b[sortColumn] ?? 0;
          return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
        })
    : [];

  const toggleFilter = (filter: keyof typeof filterModifiers) => {
    setFilterModifiers((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const customSortOrder = [
    "Points",
    "Rebounds",
    "Assists",
    "Pts+Asts",
    "Pts+Rebs",
    "Pts+Rebs+Asts",
    "Rebs+Asts",
    "3-PT Made",
    "Fantasy Score",
    "FG Made",
    "Turnovers",
    "Blocked Shots",
    "Steals",
    "Blks+Stls",
  ];

  const availableProps = Array.from(
    new Set(
      Object.values(gamesData?.lines || {}).flatMap((playerProps) =>
        playerProps.map((prop) => prop.details.stat_type)
      )
    )
  )
    .filter((prop) => prop !== "Dunks") // no dunks
    .sort((a, b) => {
      const indexA = customSortOrder.indexOf(a);
      const indexB = customSortOrder.indexOf(b);

      const safeIndexA = indexA === -1 ? customSortOrder.length : indexA;
      const safeIndexB = indexB === -1 ? customSortOrder.length : indexB;

      return safeIndexA - safeIndexB;
    });

  return (
    <div className="nba-container md:container mx-auto">
      <div className="flex flex-row filter-menu my-8 gap-8">
        {/* PROP OPTIONS */}
        <PropsFilter
          availableProps={availableProps}
          selectedProps={selectedProps}
          handlePropSelection={handlePropSelection}
        />

        {/* MODIFER OPTIONS */}
        <ModifierFilters
          filterModifiers={filterModifiers}
          toggleFilter={toggleFilter}
        />
      </div>

      {/* PROPS TABLE */}
      <PropsTable
        sortedData={sortedData}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        handleSort={handleSort}
      />
    </div>
  );
};

export default NBAPage;
