import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import PropsTable from "./PropsTable";
import PropsFilter from "./PropsFilter";
import ModifierFilters from "./ModifierFilters";
import PropsCard from "./PropsCard";

import { GameLog, gamesData } from "@/Interface";
import MobileFilters from "./MobileFilters";
import GamesFilter from "./GamesFilter";

import useWindowSize from "@/hooks/isMobile";

function loadSessionFilters() {
  const saved = sessionStorage.getItem("nbaFilters");
  if (saved) {
    return JSON.parse(saved);
  }

  return {
    filterModifiers: { goblin: true, demon: true, standard: true },
    sortOrder: "desc",
    sortColumn: "l10HitRate",
    selectedProps: [],
    searchQuery: "",
    selectedGames: [],
  };
}

interface FilterModifiers {
  goblin: boolean;
  demon: boolean;
  standard: boolean;
}

const NBAPage = () => {
  useEffect(() => {
    document.title = "NBA Lines";
  });

  const isMobile = useWindowSize();

  const initialFilters = loadSessionFilters();

  const [filterModifiers, setFilterModifiers] = useState<FilterModifiers>(
    initialFilters.filterModifiers
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    initialFilters.sortOrder
  );
  const [sortColumn, setSortColumn] = useState<
    "l10Avg" | "l5HitRate" | "l10HitRate" | "l15HitRate"
  >(initialFilters.sortColumn);
  const [selectedProps, setSelectedProps] = useState<string[]>(
    initialFilters.selectedProps
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    initialFilters.searchQuery
  );
  const [selectedGames, setSelectedGames] = useState<string[]>(
    initialFilters.selectedGames
  );

  const toggleGameSelection = (game: string) => {
    setSelectedGames((prevSelected) =>
      prevSelected.includes(game)
        ? prevSelected.filter((g) => g !== game)
        : [...prevSelected, game]
    );
  };

  useEffect(() => {
    const filtersToSave = {
      filterModifiers,
      sortOrder,
      sortColumn,
      selectedProps,
      searchQuery,
      selectedGames,
    };
    sessionStorage.setItem("nbaFilters", JSON.stringify(filtersToSave));
  }, [
    filterModifiers,
    sortOrder,
    sortColumn,
    selectedProps,
    searchQuery,
    selectedGames,
  ]);

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

  const gameTitles = Array.from(
    new Set(
      Object.values(gamesData?.players || {}).map(
        (game) => `${game.away_team} @ ${game.home_team}`
      )
    )
  ).sort();

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
      setSortOrder("desc");
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
            ? (() => {
                const currentLogs =
                  Object.values(game.teams)
                    .flatMap((team) => Object.entries(team))
                    .find(([name]) => name === playerName)?.[1]
                    ?.current_season_logs || [];
                const previousLogs =
                  Object.values(game.teams)
                    .flatMap((team) => Object.entries(team))
                    .find(([name]) => name === playerName)?.[1]
                    ?.previous_season_logs || [];

                if (currentLogs.length < 15) {
                  return [
                    ...previousLogs.slice(-(15 - currentLogs.length)),
                    ...currentLogs,
                  ];
                }
                return currentLogs;
              })()
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
              propsTime: prop.details.start_time,
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
        })
        .filter((row) =>
          row.playerName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((row) =>
          selectedGames.length > 0
            ? selectedGames.includes(row.gameTitle)
            : true
        )
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
      <div className="prop-control-container flex sticky top-0 md:relative flex-col md:flex-row filter-menu bg-[#130e0e] mx-4 md:mx-0 py-4 md:py-0 md:my-8 gap-2">
        {/* PROP OPTIONS */}
        <GamesFilter
          availableGames={gameTitles}
          selectedGames={selectedGames}
          toggleGameSelection={toggleGameSelection}
        />
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
        <input
          type="text"
          placeholder={"Search for players"}
          className="rounded-lg h-full font-medium text-sm bg-background-800 py-2 px-4 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {isMobile ? (
          <>
            <MobileFilters
              sortOrder={sortOrder}
              sortColumn={sortColumn}
              handleSort={handleSort}
            />
          </>
        ) : (
          <></>
        )}
      </div>

      {/* PROPS TABLE */}
      {isMobile ? (
        <PropsCard
          sortedData={sortedData}
          sortColumn={sortColumn}
          sortOrder={sortOrder}
          handleSort={handleSort}
        />
      ) : (
        <PropsTable
          sortedData={sortedData}
          sortColumn={sortColumn}
          sortOrder={sortOrder}
          handleSort={handleSort}
        />
      )}
    </div>
  );
};

export default NBAPage;
