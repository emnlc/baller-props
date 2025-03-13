// components/DataControls.tsx
import { Input } from "@/components/ui/input";
import GamesFilter from "./GamesFilter";
import PropsFilter from "./PropsFilter";
import ModifierFilters from "./ModifierFilters";
import MobileFilters from "./MobileFilters";

export interface FilterModifiers {
  goblin: boolean;
  demon: boolean;
  standard: boolean;
}

interface DataControlsProps {
  isMobile: boolean;
  sortOrder: "asc" | "desc";
  sortColumn:
    | "l10Avg"
    | "l5HitRate"
    | "l10HitRate"
    | "l15HitRate"
    | "diff"
    | "h2h"
    | "season";
  handleSort: (
    column:
      | "l10Avg"
      | "l5HitRate"
      | "l10HitRate"
      | "l15HitRate"
      | "diff"
      | "h2h"
      | "season"
  ) => void;
  gameTitles: string[];
  selectedGames: string[];
  toggleGameSelection: (game: string) => void;
  availableProps: string[];
  selectedProps: string[];
  handlePropSelection: (prop: string) => void;
  handleSelectAll: () => void;
  handleDeselectAll: () => void;
  filterModifiers: FilterModifiers;
  toggleFilter: (filter: keyof FilterModifiers) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const DataControls = ({
  isMobile,
  sortOrder,
  sortColumn,
  handleSort,
  gameTitles,
  selectedGames,
  toggleGameSelection,
  availableProps,
  selectedProps,
  handlePropSelection,
  handleSelectAll,
  handleDeselectAll,
  filterModifiers,
  toggleFilter,
  searchQuery,
  setSearchQuery,
}: DataControlsProps) => {
  return (
    <div
      id="data-controls"
      className="bg-background-950 prop-control-container flex sticky top-0 md:relative flex-col-reverse md:flex-row filter-menu mx-4 md:mx-0 pb-4 md:py-0 md:mb-4 gap-2 "
    >
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
  );
};

export default DataControls;
