// NBA.tsx
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import PropsTable from "./PropsTable";
import PropsCard from "./PropsCard";
import DataControls from "./DataControls";

import { gamesData } from "@/Interface";

import useWindowSize from "@/hooks/isMobile";
import { HashLoader } from "react-spinners";
import NavbarNew from "@/components/NavbarNew";

import { processGamesData } from "@/utils/nbaDataUtils";
import {
  loadSessionFilters,
  getGameTitles,
  getAvailableProps,
  toggleFilter,
  handlePropSelection,
  handleSelectAll,
  handleDeselectAll,
  toggleGameSelection,
} from "@/utils/nbaFilterUtils";

interface FilterModifiers {
  taco: boolean;
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
        <div className="flex justify-center h-screen py-4 md:py-0 md:my-8">
          <HashLoader color="#0284c7" size={50} />
        </div>
      </>
    );
  if (isError) return <div>Error!</div>;

  const gameTitles = getGameTitles(gamesData);

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

  const availableProps = getAvailableProps(gamesData, customSortOrder);

  const sortedData = gamesData
    ? processGamesData(
        gamesData,
        filterModifiers,
        searchQuery,
        selectedGames,
        selectedProps,
        sortColumn,
        sortOrder
      )
    : [];

  return (
    <div className="nba-container md:container mx-auto flex flex-col min-h-svh max-h-svh ">
      {/* <Navbar /> */}
      <NavbarNew />
      <DataControls
        isMobile={isMobile}
        sortOrder={sortOrder}
        sortColumn={sortColumn}
        handleSort={(column) => {
          if (sortColumn === column) {
            setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
          } else {
            setSortColumn(column);
            setSortOrder("desc");
          }
        }}
        gameTitles={gameTitles}
        selectedGames={selectedGames}
        toggleGameSelection={(game) =>
          toggleGameSelection(selectedGames, setSelectedGames, game)
        }
        availableProps={availableProps}
        selectedProps={selectedProps}
        handlePropSelection={(prop) =>
          handlePropSelection(selectedProps, setSelectedProps, prop)
        }
        handleSelectAll={() =>
          handleSelectAll(availableProps, setSelectedProps)
        }
        handleDeselectAll={() => handleDeselectAll(setSelectedProps)}
        filterModifiers={filterModifiers}
        toggleFilter={(filter) =>
          toggleFilter(filterModifiers, setFilterModifiers, filter)
        }
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* PROPS TABLE */}
      {isMobile ? (
        <>
          <div id="props-card" className="flex-1 overflow-y-scroll">
            <PropsCard
              sortedData={sortedData}
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              handleSort={(column) => {
                if (sortColumn === column) {
                  setSortOrder((prevOrder) =>
                    prevOrder === "asc" ? "desc" : "asc"
                  );
                } else {
                  setSortColumn(column);
                  setSortOrder("desc");
                }
              }}
            />
          </div>
        </>
      ) : (
        <PropsTable
          sortedData={sortedData}
          sortColumn={sortColumn}
          sortOrder={sortOrder}
          handleSort={(column) => {
            if (sortColumn === column) {
              setSortOrder((prevOrder) =>
                prevOrder === "asc" ? "desc" : "asc"
              );
            } else {
              setSortColumn(column);
              setSortOrder("desc");
            }
          }}
        />
      )}
    </div>
  );
};

export default NBAPage;
