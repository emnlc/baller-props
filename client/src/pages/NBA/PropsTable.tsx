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
  }[];
  sortColumn: "l10Avg" | "l5HitRate" | "l10HitRate" | "l15HitRate" | "diff";
  sortOrder: "asc" | "desc";
  handleSort: (
    column: "l10Avg" | "l5HitRate" | "l10HitRate" | "l15HitRate" | "diff"
  ) => void;
};

const PropsTable = ({
  sortedData,
  sortColumn,
  sortOrder,
  handleSort,
}: Props) => {
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const itemsPerPage = 30; // Number of rows per page
  const tableContainerRef = useRef<HTMLDivElement | null>(null); // Ref for the table container

  // Retrieve the current page from session storage when the component mounts
  useEffect(() => {
    const savedPage = sessionStorage.getItem("currentPage");
    if (savedPage) {
      setCurrentPage(parseInt(savedPage, 10));
    }
  }, []);

  // Rest of the component code...

  // Calculate the total number of pages
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Get the data for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleData = sortedData.slice(startIndex, endIndex);

  // Handle page navigation
  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll to the top of the table
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // Scroll to the top of the table
      if (tableContainerRef.current) {
        tableContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // Scroll to the top of the table
      if (tableContainerRef.current) {
        tableContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const renderPageButtons = () => {
    const buttons = [];
    const maxButtons = 3; // Maximum number of page buttons to display at once

    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    // Adjust startPage if endPage exceeds totalPages
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    // Add "Previous" button
    buttons.push(
      <button
        key="prev"
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
        className="w-8 h-8 bg-background-700 hover:bg-background-600 text-xs text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        ⟨
      </button>
    );

    // Add first page button
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => goToPage(1)}
          className={`w-8 h-8 ${
            currentPage === 1
              ? "bg-accent-500 hover:bg-accent-400 text-white"
              : "bg-background-700 hover:bg-background-600 transition-all text-white"
          } text-xs rounded-lg `}
        >
          1
        </button>
      );

      // Add ellipsis if there's a gap
      if (startPage > 2) {
        buttons.push(
          <span
            key="ellipsis-start"
            className="w-8 h-8 text-xs flex justify-center items-center text-white"
          >
            ...
          </span>
        );
      }
    }

    // Add page buttons within the range
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`w-8 h-8 ${
            currentPage === i
              ? "bg-accent-500 hover:bg-accent-400 transition-all text-white"
              : "bg-background-700 hover:bg-background-600 transition-all text-white"
          } text-xs rounded-lg`}
        >
          {i}
        </button>
      );
    }

    // Add ellipsis if there's a gap
    if (endPage < totalPages - 1) {
      buttons.push(
        <span
          key="ellipsis-end"
          className="w-8 h-8 text-xs flex justify-center items-center text-white"
        >
          ...
        </span>
      );
    }

    // Add last page button
    if (endPage < totalPages) {
      buttons.push(
        <button
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          className={`w-8 h-8 ${
            currentPage === totalPages
              ? "bg-accent-500 hover:bg-accent-400 transition-all text-white"
              : "bg-background-700 hover:bg-background-600 transition-all text-white"
          } text-xs rounded-lg`}
        >
          {totalPages}
        </button>
      );
    }

    // Add "Next" button
    buttons.push(
      <button
        key="next"
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        className="w-8 h-8 bg-background-700 hover:bg-background-600 transition-all text-xs text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ⟩
      </button>
    );

    return buttons;
  };

  const getButtonClass = (column: string) => {
    return `flex items-center gap-2 ${
      sortColumn === column ? "text-accent-500" : "text-white"
    }`;
  };

  return (
    <>
      {sortedData.length > 0 ? (
        <>
          <div className="w-full overflow-hidden">
            {/* Table container with ref */}
            <div
              ref={tableContainerRef}
              className="h-[calc(100vh-300px)] relative overflow-auto table-scrollbar rounded-xl"
            >
              <Table className="bg-background-900 text-xs md:text-sm">
                <TableHeader className="bg-background-800 text-center sticky top-0">
                  <TableRow>
                    <TableHead className="font-medium">Player</TableHead>
                    <TableHead className="font-medium">Prop Type</TableHead>
                    <TableHead className="font-medium">Prop Line</TableHead>
                    <TableHead className="font-medium w-24">
                      <button
                        onClick={() => handleSort("diff")}
                        className={getButtonClass("diff")}
                      >
                        Diff
                        {sortColumn === "diff" ? (
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
                    {[
                      { column: "l10Avg", label: "L10 Avg" },
                      { column: "l5HitRate", label: "L5" },
                      { column: "l10HitRate", label: "L10" },
                      { column: "l15HitRate", label: "L15" },
                    ].map(({ column, label }) => (
                      <TableHead key={column} className="font-medium w-36">
                        <button
                          onClick={() =>
                            handleSort(
                              column as
                                | "l10Avg"
                                | "l5HitRate"
                                | "l10HitRate"
                                | "l15HitRate"
                                | "diff"
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

                <TableBody className="font-medium [&>*:nth-child(odd)]:bg-background-900 [&>*:nth-child(even)]:bg-background-950">
                  {visibleData.map((row, index) => (
                    <TableRow
                      key={`${row.playerName}-${index}`}
                      className="border-b-[2.5px] border-[#0a0a0a]"
                    >
                      <TableCell className="flex flex-row gap-2">
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
                            // Save the current page to session storage
                            sessionStorage.setItem(
                              "currentPage",
                              currentPage.toString()
                            );
                          }}
                        >
                          <FontAwesomeIcon
                            className="text-lg text-accent-500"
                            icon={faChartSimple}
                          />
                        </Link>
                      </TableCell>
                      <TableCell>{row.propType}</TableCell>
                      <TableCell className="">
                        <span className="flex flex-row gap-2 items-center">
                          {row.propLine}
                          {row.propOdds === "goblin" ? (
                            <img src="goblin.png" className="w-10" />
                          ) : row.propOdds === "demon" ? (
                            <img src="demon.png" className="w-10" />
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
                        } text-center border-r-[2.5px] border-[#0a0a0a]`}
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
                        } text-center border-r-[2.5px] border-[#0a0a0a]`}
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
                        } text-center border-r-[2.5px] border-[#0a0a0a]`}
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
                        } text-center border-r-[2.5px] border-[#0a0a0a]`}
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
                        } text-center`}
                      >
                        {row.l15HitRate}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-2 p-4 ">
              {renderPageButtons()}
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
