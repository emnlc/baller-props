// utils/nbaFilterUtils.ts
import { gamesData } from "@/Interface";

// Load session filters
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

// Get game titles from gamesData
export const getGameTitles = (gamesData: gamesData | undefined): string[] => {
  return Array.from(
    new Set(
      Object.values(gamesData?.players || {}).map(
        (game) => `${game.away_team} @ ${game.home_team}`
      )
    )
  ).sort();
};

// Get available props from gamesData
export const getAvailableProps = (
  gamesData: gamesData | undefined,
  customSortOrder: string[]
): string[] => {
  return Array.from(
    new Set(
      Object.values(gamesData?.lines || {}).flatMap((playerProps) =>
        playerProps.map((prop) => prop.details.stat_type)
      )
    )
  )
    .filter((prop) => prop !== "Dunks")
    .sort((a, b) => {
      const indexA = customSortOrder.indexOf(a);
      const indexB = customSortOrder.indexOf(b);

      const safeIndexA = indexA === -1 ? customSortOrder.length : indexA;
      const safeIndexB = indexB === -1 ? customSortOrder.length : indexB;

      return safeIndexA - safeIndexB;
    });
};

// Handle filter toggling
export const toggleFilter = (
  filterModifiers: { goblin: boolean; demon: boolean; standard: boolean },
  setFilterModifiers: React.Dispatch<
    React.SetStateAction<{ goblin: boolean; demon: boolean; standard: boolean }>
  >,
  filter: keyof typeof filterModifiers
) => {
  setFilterModifiers((prev) => ({
    ...prev,
    [filter]: !prev[filter],
  }));
};

// Handle prop selection
export const handlePropSelection = (
  selectedProps: string[],
  setSelectedProps: React.Dispatch<React.SetStateAction<string[]>>,
  prop: string
) => {
  setSelectedProps((prevSelected) =>
    prevSelected.includes(prop)
      ? prevSelected.filter((item) => item !== prop)
      : [...prevSelected, prop]
  );
};

// Handle select all props
export const handleSelectAll = (
  availableProps: string[],
  setSelectedProps: React.Dispatch<React.SetStateAction<string[]>>
) => {
  setSelectedProps([...availableProps]);
};

// Handle deselect all props
export const handleDeselectAll = (
  setSelectedProps: React.Dispatch<React.SetStateAction<string[]>>
) => {
  setSelectedProps([]);
};

// Handle game selection
export const toggleGameSelection = (
  selectedGames: string[],
  setSelectedGames: React.Dispatch<React.SetStateAction<string[]>>,
  game: string
) => {
  setSelectedGames((prevSelected) =>
    prevSelected.includes(game)
      ? prevSelected.filter((g) => g !== game)
      : [...prevSelected, game]
  );
};
