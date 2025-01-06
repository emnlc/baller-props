import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef } from "react";
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

const PropsCard = ({ sortedData }: Props) => {
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
      if (currentElement) observer.unobserve(currentElement);
    };
  }, [isLoading]);

  useEffect(() => {
    const nextData = sortedData.slice(0, currentPage * itemsPerPage);
    setVisibleData(nextData);
  }, [currentPage, sortedData]);

  return (
    <>
      {sortedData.length > 0 ? (
        <div className="flex flex-col gap-4">
          {visibleData.map((row, index) => (
            <div
              key={`${row.playerName}-${index}`}
              className="flex flex-col text-sm justify-start player-card bg-background-900 mx-4 rounded-2xl py-4 gap-4 px-4 text-start"
            >
              <div className="player-card-title flex flex-col">
                <span className="flex flex-row justify-between">
                  <h1 className="text-base font-bold">
                    {row.playerName}{" "}
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
                        className="text-base text-accent-300"
                        icon={faChartSimple}
                      />
                    </Link>
                  </h1>
                  <span>{row.gameTitle}</span>
                </span>

                <span className="text-xs">
                  {new Date(row.propsTime).toLocaleString("en-US", {
                    weekday: "short",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "America/New_York",
                  })}{" "}
                  EST
                </span>

                <div className="font-bold mt-2 flex items-center min-h-8">
                  {row.propLine} {row.propType}{" "}
                  {row.propOdds === "goblin" ? (
                    <img src="goblin.png" className="w-8" />
                  ) : row.propOdds === "demon" ? (
                    <img src="demon.png" className="w-8" />
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="stats-container flex flex-row gap-2 overflow-x-scroll md:overflow-hidden overflow-y-hidden pb-2">
                <div className="min-w-24 items-center text-xs p-2 flex flex-col gap-1 bg-background-800 rounded-xl">
                  <span className="font-medium">L10 Avg</span>
                  <span
                    className={`font-bold ${
                      row.l10Avg && row.l10Avg > row.propLine
                        ? "text-bpGreen"
                        : row.l10Avg === row.propLine
                        ? "text-white"
                        : "text-bpRed"
                    }`}
                  >
                    {row.l10Avg?.toFixed(1)}
                  </span>
                </div>
                <div className="min-w-24 items-center text-xs p-2 flex flex-col gap-1 bg-background-800 rounded-xl">
                  <span className="font-medium">L5 HR</span>
                  <span
                    className={`font-bold ${
                      row.l5HitRate && row.l5HitRate > row.propLine
                        ? "text-bpGreen"
                        : row.l5HitRate === row.propLine
                        ? "text-white"
                        : "text-bpRed"
                    }`}
                  >
                    {row.l5HitRate}%
                  </span>
                </div>
                <div className="min-w-24 items-center text-xs p-2 flex flex-col gap-1 bg-background-800 rounded-xl">
                  <span className="font-medium">L10 HR</span>
                  <span
                    className={`font-bold ${
                      row.l10HitRate && row.l10HitRate > row.propLine
                        ? "text-bpGreen"
                        : row.l10HitRate === row.propLine
                        ? "text-white"
                        : "text-bpRed"
                    }`}
                  >
                    {row.l10HitRate}%
                  </span>
                </div>
                <div className="min-w-24 items-center text-xs p-2 flex flex-col gap-1 bg-background-800 rounded-xl">
                  <span className="font-medium">L15 HR</span>
                  <span
                    className={`font-bold ${
                      row.l15HitRate && row.l15HitRate > row.propLine
                        ? "text-bpGreen"
                        : row.l15HitRate === row.propLine
                        ? "text-white"
                        : "text-bpRed"
                    }`}
                  >
                    {row.l15HitRate}%
                  </span>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="text-center py-4 text-sm text-accent-300">
              <SyncLoader color="#da8b91 " size={10} />
            </div>
          )}

          <div ref={bottomRef} style={{ height: "1px" }} />
        </div>
      ) : (
        <div className="my-16 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold">No data found</span>
        </div>
      )}
    </>
  );
};

export default PropsCard;
