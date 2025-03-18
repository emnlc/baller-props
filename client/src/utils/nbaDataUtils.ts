import { GameLog, gamesData } from "@/Interface";

export type ProcessedRow = {
  playerName: string;
  gameTitle: string;
  gameKey: string;
  playerTeam: string;
  opponentTeam: string;
  propType: string;
  propLine: number;
  propOdds: string;
  propsTime: string;
  propDiscountName: string;
  l10Avg: number | null;
  diff: number;
  l5HitRate: number;
  l10HitRate: number;
  l15HitRate: number;
  h2h: number;
  season: number;
};

export const loadSessionFilters = () => {
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
};

export const calculateHitRate = (
  logs: GameLog[],
  statType: keyof GameLog,
  line: number,
  numGames: number
): number => {
  const recentGames = logs.slice(-numGames);
  const hits = recentGames.filter(
    (game) => typeof game[statType] === "number" && game[statType] >= line
  ).length;
  return recentGames.length ? Math.round((hits / recentGames.length) * 100) : 0;
};

export const calculateH2H = (
  currentLogs: GameLog[],
  previousLogs: GameLog[],
  statType: keyof GameLog,
  line: number,
  opponent: string
): number => {
  const allLogs = [...previousLogs, ...currentLogs];
  const h2hLogs = allLogs.filter((game) => game.MATCHUP.includes(opponent));
  const hits = h2hLogs.filter(
    (game) => typeof game[statType] === "number" && game[statType] >= line
  ).length;
  return h2hLogs.length ? Math.round((hits / h2hLogs.length) * 100) : 0;
};

export const calculateSZN = (
  currentLogs: GameLog[],
  statType: keyof GameLog,
  line: number
): number => {
  const hits = currentLogs.filter(
    (game) => typeof game[statType] === "number" && game[statType] >= line
  ).length;
  return currentLogs.length ? Math.round((hits / currentLogs.length) * 100) : 0;
};

export const calculateL10Avg = (
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

export const processGamesData = (
  gamesData: gamesData,
  filterModifiers: {
    goblin: boolean;
    demon: boolean;
    standard: boolean;
    taco: boolean;
  },
  searchQuery: string,
  selectedGames: string[],
  selectedProps: string[],
  sortColumn: keyof ProcessedRow,
  sortOrder: string
): ProcessedRow[] => {
  return Object.entries(gamesData.lines)
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
          opponentTeam,
          propType: prop.details.stat_type,
          propLine: line,
          propOdds: prop.details.discount_name
            ? prop.details.discount_name
            : prop.details.odds_type,
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
      if (row.propOdds === "taco") return filterModifiers.taco;
    })
    .filter((row) =>
      row.playerName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((row) =>
      selectedGames.length > 0 ? selectedGames.includes(row.gameTitle) : true
    )
    .filter((row) =>
      selectedProps.length > 0 ? selectedProps.includes(row.propType) : true
    )
    .sort((a, b) => {
      const valueA = typeof a[sortColumn] === "number" ? a[sortColumn] : 0;
      const valueB = typeof b[sortColumn] === "number" ? b[sortColumn] : 0;
      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    });
};
