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
import { Input } from "@/components/ui/input";

import { HashLoader } from "react-spinners";
import Navbar from "../Landing/Navbar";

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
    | "l10Avg"
    | "l5HitRate"
    | "l10HitRate"
    | "l15HitRate"
    | "diff"
    | "h2h"
    | "season"
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

  if (isLoading)
    return (
      <>
        <div className="flex justify-center py-4 md:py-0 md:my-8">
          <HashLoader color="#0284c7" size={50} />
        </div>
      </>
    );
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

  const calculateH2H = (
    currentLogs: GameLog[],
    previousLogs: GameLog[],
    statType: keyof GameLog,
    line: number,
    opponent: string
  ): number => {
    // Combine current and previous season logs
    const allLogs = [...previousLogs, ...currentLogs];

    // Filter logs to include only games against the specified opponent team
    const h2hLogs = allLogs.filter((game) => game.MATCHUP.includes(opponent));

    // Count the number of times the player hit over the prop line in those games
    const hits = h2hLogs.filter(
      (game) => typeof game[statType] === "number" && game[statType] >= line
    ).length;

    return h2hLogs.length ? Math.round((hits / h2hLogs.length) * 100) : 0;
  };

  const calculateSZN = (
    currentLogs: GameLog[],
    statType: keyof GameLog,
    line: number
  ): number => {
    const hits = currentLogs.filter(
      (game) => typeof game[statType] === "number" && game[statType] >= line
    ).length;

    return currentLogs.length
      ? Math.round((hits / currentLogs.length) * 100)
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
    column:
      | "l10Avg"
      | "l5HitRate"
      | "l10HitRate"
      | "l15HitRate"
      | "diff"
      | "h2h"
      | "season"
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

  // New function to handle "Select All"
  const handleSelectAll = () => {
    setSelectedProps([...availableProps]);
  };

  // New function to handle "Deselect All"
  const handleDeselectAll = () => {
    setSelectedProps([]);
  };

  const sortedData = gamesData
    ? Object.entries(gamesData.lines)
        .flatMap(([playerName, playerProps]) => {
          const game = Object.values(gamesData.players).find((g) =>
            Object.keys(g.teams).some((teamKey) =>
              Object.keys(g.teams[teamKey]).includes(playerName)
            )
          );

          if (!game) return [];

          const gameKey = Object.keys(gamesData.players).find((key) =>
            Object.keys(gamesData.players[key].teams).some((teamKey) =>
              Object.keys(gamesData.players[key].teams[teamKey]).includes(
                playerName
              )
            )
          );

          const gameTitle = `${game.away_team} @ ${game.home_team}`;

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

                return { currentLogs, previousLogs };
              })()
            : { currentLogs: [], previousLogs: [] };

          const playerTeam = Object.keys(game.teams).find((teamKey) =>
            Object.keys(game.teams[teamKey]).includes(playerName)
          );

          const opponentTeam =
            playerTeam === game.away_team ? game.home_team : game.away_team;

          return playerProps.map((prop) => {
            const statType = prop.details.stat_type as keyof GameLog;
            const l10Avg = playerLogs.currentLogs
              ? calculateL10Avg(playerLogs.currentLogs, statType)
              : null;

            let line = prop.details.line_score;
            let promo = false;
            if (prop.details.is_promo) {
              promo = true;
              line = prop.details.flash_sale_line_score;
            }

            const diff = l10Avg ? l10Avg - prop.details.line_score : 0;

            return {
              playerName,
              gameTitle,
              gameKey: gameKey ?? "Unknown Game",
              playerTeam: playerTeam ?? "Unknown Team",
              opponentTeam, // Add opponentTeam to the returned object
              propType: prop.details.stat_type,
              propLine: line,
              propOdds: prop.details.odds_type,
              propsTime: prop.details.start_time,
              propDiscountName: promo ? prop.details.discount_name : "",
              l10Avg,
              diff: diff,
              l5HitRate: playerLogs.currentLogs
                ? calculateHitRate(playerLogs.currentLogs, statType, line, 5)
                : 0,
              l10HitRate: playerLogs.currentLogs
                ? calculateHitRate(playerLogs.currentLogs, statType, line, 10)
                : 0,
              l15HitRate: playerLogs.currentLogs
                ? calculateHitRate(playerLogs.currentLogs, statType, line, 15)
                : 0,
              h2h: calculateH2H(
                playerLogs.currentLogs,
                playerLogs.previousLogs,
                statType,
                line,
                opponentTeam
              ),
              season: calculateSZN(playerLogs.currentLogs, statType, line),
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
    <div className="nba-container md:container mx-auto flex flex-col max-h-dvh">
      <Navbar />
      <div className="bg-background-950 prop-control-container flex sticky top-0 md:relative flex-col-reverse md:flex-row filter-menu mx-4 md:mx-0 py-4 md:py-0 md:my-4 gap-2 flex-1">
        {/* PROP OPTIONS */}
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
        <div className="flex flex-row gap-2 overflow-scroll md:overflow-visible md:w-fit">
          <GamesFilter
            availableGames={gameTitles}
            selectedGames={selectedGames}
            toggleGameSelection={toggleGameSelection}
          />
          <PropsFilter
            availableProps={availableProps}
            selectedProps={selectedProps}
            handlePropSelection={handlePropSelection}
            handleSelectAll={handleSelectAll}
            handleDeselectAll={handleDeselectAll}
          />

          {/* MODIFER OPTIONS */}
          <ModifierFilters
            filterModifiers={filterModifiers}
            toggleFilter={toggleFilter}
          />
        </div>

        <Input
          type="text"
          placeholder="Search for players"
          className="rounded-md h-full font-medium text-sm bg-background-800 border border-background-600 py-2 px-4 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* PROPS TABLE */}
      {isMobile ? (
        <>
          <div id="props-card" className="flex-1 overflow-y-scroll">
            <PropsCard
              sortedData={sortedData}
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              handleSort={handleSort}
            />
          </div>
        </>
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
