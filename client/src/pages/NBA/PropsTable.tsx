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
import { useEffect, useRef, useState } from "react";

import { SyncLoader } from "react-spinners";

type Props = {
  sortedData: {
    playerName: string;
    gameTitle: string;
    propType: string;
    propLine: number;
    propOdds: string;
    l10Avg: number | null;
    l5HitRate: number;
    l10HitRate: number;
    l15HitRate: number;
    playerTeam: string;
    gameKey: string;
    propsTime: string;
  }[];
  sortColumn: "l10Avg" | "l5HitRate" | "l10HitRate" | "l15HitRate";
  sortOrder: "asc" | "desc";
  handleSort: (
    column: "l10Avg" | "l5HitRate" | "l10HitRate" | "l15HitRate"
  ) => void;
};

const PropsTable = ({
  sortedData,
  sortColumn,
  sortOrder,
  handleSort,
}: Props) => {
  const [visibleData, setVisibleData] = useState(sortedData.slice(0, 25));
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const itemsPerPage = 25;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoading) {
          setIsLoading(true);
          setTimeout(() => {
            setCurrentPage((prevPage) => prevPage + 1);
            setIsLoading(false);
          }, 700); // delay
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 1.0,
      }
    );

    const currentElement = bottomRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [isLoading]);

  useEffect(() => {
    const nextData = sortedData.slice(0, currentPage * itemsPerPage);
    setVisibleData(nextData);
  }, [currentPage, sortedData]);

  return (
    <>
      {sortedData.length > 0 ? (
        <>
          <Table className="bg-background-900 text-xs md:text-sm">
            <TableHeader className="bg-background-800 text-center">
              <TableRow>
                <TableHead className="font-medium">Player</TableHead>
                <TableHead className="font-medium">Prop Type</TableHead>
                <TableHead className="font-medium">Prop Line</TableHead>
                <TableHead className="font-medium">
                  <button onClick={() => handleSort("l10Avg")}>
                    L10 Avg{" "}
                    {sortColumn === "l10Avg" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </TableHead>
                <TableHead className="font-medium">
                  <button onClick={() => handleSort("l5HitRate")}>
                    L5{" "}
                    {sortColumn === "l5HitRate" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </TableHead>
                <TableHead className="font-medium">
                  <button onClick={() => handleSort("l10HitRate")}>
                    L10{" "}
                    {sortColumn === "l10HitRate" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </TableHead>
                <TableHead className="font-medium">
                  <button onClick={() => handleSort("l15HitRate")}>
                    L15{" "}
                    {sortColumn === "l15HitRate" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="font-medium [&>*:nth-child(odd)]:bg-background-900 [&>*:nth-child(even)]:bg-background-950">
              {visibleData.map((row, index) => (
                <TableRow key={`${row.playerName}-${index}`}>
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
                        }&propOdds=${encodeURIComponent(row.propOdds)}&l10Avg=${
                          row.l10Avg ?? ""
                        }&l5HitRate=${row.l5HitRate}&l10HitRate=${
                          row.l10HitRate
                        }&l15HitRate=${
                          row.l15HitRate
                        }&propsTime=${encodeURIComponent(row.propsTime)}`,
                      }}
                    >
                      <FontAwesomeIcon
                        className="text-lg text-accent-300"
                        icon={faChartSimple}
                      />
                    </Link>
                  </TableCell>
                  <TableCell>{row.propType}</TableCell>
                  <TableCell>
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
                      row.l10Avg && row.l10Avg > row.propLine
                        ? "text-bpGreen"
                        : row.l10Avg === row.propLine
                        ? "text-white"
                        : "text-bpRed"
                    }`}
                  >
                    {row.l10Avg?.toFixed(2) ?? "N/A"}
                  </TableCell>
                  <TableCell
                    className={`${
                      row.l5HitRate && row.l5HitRate > 50
                        ? "text-bpGreen"
                        : row.l5HitRate === 50
                        ? "text-white"
                        : "text-bpRed"
                    }`}
                  >
                    {row.l5HitRate}%
                  </TableCell>
                  <TableCell
                    className={`${
                      row.l10HitRate && row.l10HitRate > 50
                        ? "text-bpGreen"
                        : row.l10HitRate === 50
                        ? "text-white"
                        : "text-bpRed"
                    }`}
                  >
                    {row.l10HitRate}%
                  </TableCell>
                  <TableCell
                    className={`${
                      row.l15HitRate && row.l15HitRate > 50
                        ? "text-bpGreen"
                        : row.l15HitRate === 50
                        ? "text-white"
                        : "text-bpRed"
                    }`}
                  >
                    {row.l15HitRate}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* loading icon */}
          {isLoading && (
            <div className="text-center flex flex-row items-center justify-center py-8 text-sm text-accent-300 w-full">
              <SyncLoader color="#da8b91" size={15} />
            </div>
          )}

          {/* infinite scroll trigger */}
          <div ref={bottomRef} style={{ height: "1px" }} />
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
