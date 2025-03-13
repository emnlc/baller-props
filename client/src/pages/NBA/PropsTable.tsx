import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import { Pagination } from "./Pagination";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type Props = {
  sortedData: {
    playerName: string;
    gameTitle: string;
    propType: string;
    propLine: number;
    propOdds: string;
    l10Avg: number | null;
    diff: number;
    l5HitRate: number;
    l10HitRate: number;
    l15HitRate: number;
    playerTeam: string;
    gameKey: string;
    propsTime: string;
    h2h: number;
    season: number;
  }[];
  sortColumn:
    | "l10Avg"
    | "l5HitRate"
    | "l10HitRate"
    | "l15HitRate"
    | "diff"
    | "h2h"
    | "season";
  sortOrder: "asc" | "desc";
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
};

const PropsTable = ({
  sortedData,
  sortColumn,
  sortOrder,
  handleSort,
}: Props) => {
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [itemsPerPage, setItemsPerPage] = useState(25); // Number of rows per page
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    const savedPage = sessionStorage.getItem("currentPage");
    if (savedPage) {
      const page = parseInt(savedPage, 10);

      if (page <= totalPages) {
        setCurrentPage(page);
      } else {
        setCurrentPage(totalPages);
      }
    }
  }, [totalPages]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleData = sortedData.slice(startIndex, endIndex);

  const getButtonClass = (column: string) => {
    return `flex items-center gap-2 ${
      sortColumn === column ? "text-accent-500 font-bold" : "text-white"
    }`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    sessionStorage.setItem("currentPage", String(page));
    tableContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
  };

  return (
    <>
      {sortedData.length > 0 ? (
        <>
          <div className="w-full rounded-lg overflow-y-hidden flex flex-col flex-1">
            {/* Table container with ref */}
            <div
              id="nba-props-table"
              ref={tableContainerRef}
              className=" relative overflow-auto bg-background-900 table-scrollbar border border-background-600 "
            >
              <Table className="bg-background-900 text-xs md:text-sm">
                <TableHeader className="bg-background-800 text-center sticky top-0 whitespace-nowrap">
                  <TableRow>
                    <TableHead className="font-medium min-w-fit">
                      Player
                    </TableHead>
                    <TableHead className="font-medium min-w-fit">
                      Prop Type
                    </TableHead>
                    <TableHead className="font-medium min-w-fit">
                      Prop Line
                    </TableHead>
                    {[
                      {
                        column: "diff",
                        label: "Diff",
                        width: "min-w-fit w-16",
                      },
                      {
                        column: "l10Avg",
                        label: "L10 Avg",
                        width: "min-w-fit w-32",
                      },
                      {
                        column: "l5HitRate",
                        label: "L5",
                        width: "min-w-fit w-32",
                      },
                      {
                        column: "l10HitRate",
                        label: "L10",
                        width: "min-w-fit w-32",
                      },
                      {
                        column: "l15HitRate",
                        label: "L15",
                        width: "min-w-fit w-32",
                      },
                      { column: "h2h", label: "H2H", width: "min-w-fit w-16" },
                      {
                        column: "season",
                        label: "SZN",
                        width: "min-w-fit w-16",
                      },
                    ].map(({ column, label, width }) => (
                      <TableHead
                        key={column}
                        className={`font-medium ${width}`}
                      >
                        <button
                          onClick={() =>
                            handleSort(
                              column as
                                | "l10Avg"
                                | "l5HitRate"
                                | "l10HitRate"
                                | "l15HitRate"
                                | "diff"
                                | "h2h"
                                | "season"
                            )
                          }
                          className={getButtonClass(column)}
                        >
                          {label}
                          {sortColumn === column ? (
                            sortOrder === "asc" ? (
                              <span>↑</span>
                            ) : (
                              <span>↓</span>
                            )
                          ) : (
                            <span>↓</span>
                          )}
                        </button>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                <TableBody className="font-medium [&>*:nth-child(odd)]:bg-background-900 [&>*:nth-child(even)]:bg-background-950 [&>*:not(:nth-last-child(-n+1))]:border-b-[2.5px] [&>*:not(:nth-last-child(-n+1))]:border-[#0a0a0a]">
                  {visibleData.map((row, index) => (
                    <TableRow key={`${row.playerName}-${index}`}>
                      <TableCell className="flex flex-row gap-2 whitespace-nowrap min-w-fit">
                        <div className="flex flex-col">
                          <span>{row.playerName}</span>
                          <span className="text-sm font-light">
                            {row.gameTitle}
                          </span>
                        </div>
                        <Link
                          to={{
                            pathname: "/player-page",
                            search: `?playerName=${encodeURIComponent(
                              row.playerName
                            )}&gameTitle=${encodeURIComponent(
                              row.gameTitle
                            )}&playerTeam=${encodeURIComponent(
                              row.playerTeam
                            )}&gameKey=${encodeURIComponent(
                              row.gameKey
                            )}&propType=${encodeURIComponent(
                              row.propType
                            )}&propLine=${
                              row.propLine
                            }&propOdds=${encodeURIComponent(
                              row.propOdds
                            )}&l10Avg=${row.l10Avg ?? ""}&l5HitRate=${
                              row.l5HitRate
                            }&l10HitRate=${row.l10HitRate}&l15HitRate=${
                              row.l15HitRate
                            }&propsTime=${encodeURIComponent(row.propsTime)}`,
                          }}
                          onClick={() => {
                            sessionStorage.setItem(
                              "currentPage",
                              currentPage.toString()
                            );
                          }}
                        >
                          <FontAwesomeIcon
                            className="text-lg text-accent-500 hover:text-accent-400 transition-all"
                            icon={faChartSimple}
                          />
                        </Link>
                      </TableCell>
                      <TableCell>{row.propType}</TableCell>
                      <TableCell>
                        <span className="flex flex-row gap-2 items-center min-w-fit">
                          {row.propLine}
                          {row.propOdds === "goblin" ? (
                            <img src="goblin-256.png" className="w-6" />
                          ) : row.propOdds === "demon" ? (
                            <img src="demon-256.png" className="w-6" />
                          ) : (
                            ""
                          )}
                        </span>
                      </TableCell>
                      <TableCell
                        className={`${
                          row.diff > 0
                            ? "bg-bpGreenRange-400"
                            : row.diff === 0
                            ? "bg-background-700"
                            : "bg-bpRedRange-400"
                        } text-center border-r-[2.5px] border-[#0a0a0a] min-w-fit`}
                      >
                        {row.diff.toFixed(1)}
                      </TableCell>

                      <TableCell
                        className={`${
                          row.l10Avg && row.l10Avg > row.propLine
                            ? "bg-bpGreenRange-400 "
                            : row.l10Avg === row.propLine
                            ? "bg-background-700"
                            : "bg-bpRedRange-400"
                        } text-center border-r-[2.5px] border-[#0a0a0a] min-w-fit`}
                      >
                        <div>{row.l10Avg?.toFixed(2) ?? "N/A"}</div>
                      </TableCell>

                      <TableCell
                        className={`${
                          row.l5HitRate && row.l5HitRate > 50
                            ? "bg-bpGreenRange-400"
                            : row.l5HitRate === 50
                            ? "bg-background-700"
                            : "bg-bpRedRange-400"
                        } text-center border-r-[2.5px] border-[#0a0a0a] min-w-fit`}
                      >
                        {row.l5HitRate}%
                      </TableCell>

                      <TableCell
                        className={`${
                          row.l10HitRate && row.l10HitRate > 50
                            ? "bg-bpGreenRange-400"
                            : row.l10HitRate === 50
                            ? "bg-background-700"
                            : "bg-bpRedRange-400"
                        } text-center border-r-[2.5px] border-[#0a0a0a] min-w-fit`}
                      >
                        {row.l10HitRate}%
                      </TableCell>

                      <TableCell
                        className={`${
                          row.l15HitRate && row.l15HitRate > 50
                            ? "bg-bpGreenRange-400"
                            : row.l15HitRate === 50
                            ? "bg-background-700"
                            : "bg-bpRedRange-400"
                        } text-center border-r-[2.5px] border-[#0a0a0a] min-w-fit`}
                      >
                        {row.l15HitRate}%
                      </TableCell>

                      <TableCell
                        className={`${
                          row.h2h && row.h2h > 50
                            ? "bg-bpGreenRange-400"
                            : row.h2h === 50
                            ? "bg-background-700"
                            : "bg-bpRedRange-400"
                        } text-center border-r-[2.5px] border-[#0a0a0a] min-w-fit`}
                      >
                        {row.h2h}%
                      </TableCell>

                      <TableCell
                        className={`${
                          row.season && row.season > 50
                            ? "bg-bpGreenRange-400"
                            : row.season === 50
                            ? "bg-background-700"
                            : "bg-bpRedRange-400"
                        } text-center min-w-fit`}
                      >
                        {row.season}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="w-full flex items-center justify-between">
              <div className="flex-grow flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger
                  className="px-4 mr-8 py-2 rounded-lg text-xs w-32 bg-background-800 hover:bg-background-700 border border-background-700 transition-all "
                  asChild
                >
                  <Button variant="outline">
                    Rows per page: {itemsPerPage}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background-800 border border-background-700 text-white">
                  <DropdownMenuRadioGroup
                    value={itemsPerPage.toString()}
                    onValueChange={handleItemsPerPageChange}
                  >
                    <DropdownMenuRadioItem
                      className="transition-all hover:bg-background-700"
                      value="25"
                    >
                      25 rows
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      className="transition-all hover:bg-background-700"
                      value="50"
                    >
                      50 rows
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      className="transition-all hover:bg-background-700"
                      value="100"
                    >
                      100 rows
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="my-36 flex flex-col items-center justify-center">
            <span className="text-xl font-semibold">No data found</span>
          </div>
        </>
      )}
    </>
  );
};

export default PropsTable;
