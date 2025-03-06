import { GameLog } from "@/Interface";

type Props = {
  logs: GameLog[];
  prop: string | null;
  title: string;
  propLine: number;
  h2h?: boolean;
  opponent?: string;
};

const shortenedProps: Record<string, string> = {
  Points: "PTS",
  Rebounds: "REB",
  Assists: "AST",
  "Pts+Asts": "PA",
  "Pts+Rebs": "PR",
  "Pts+Rebs+Asts": "PRA",
  "Rebs+Asts": "RA",
  "3-PT Made": "3PM",
  "3-PT Attempted": "3PA",
  "Fantasy Score": "FS",
  "FG Made": "FGM",
  "FG Attempted": "FGA",
  Turnovers: "TO",
  "Blocked Shots": "BLKS",
  Steals: "STLS",
  "Blks+Stls": "BS",
  "Defensive Rebounds": "DREB",
  "Offensive Rebounds": "OREB",
  "Free Throws Made": "FTM",
};

const calculateAvg = (
  logs: GameLog[],
  statType: keyof GameLog
): number | null => {
  const total = logs.reduce((sum, game) => {
    const value = game[statType];
    return sum + (typeof value === "number" ? value : 0);
  }, 0);

  return logs.length ? parseFloat((total / logs.length).toFixed(1)) : null;
};

const AverageDetails = (props: Props) => {
  const avg = calculateAvg(props.logs, props.prop as keyof GameLog);
  let shortenedProp = "";
  if (props.prop) {
    shortenedProp = shortenedProps[props.prop];
  }
  return (
    <>
      {props.h2h ? (
        <>
          <div className="flex flex-col min-w-36 md:min-w-fit text-xs md:text-base gap-2 items-start">
            <h1 className="font-medium text-sm md:text-lg">{props.title}</h1>
            {avg ? (
              <span
                className={`p-4 w-full text-center bg-background-800 min-w-36 md:min-w-fit rounded-xl font-medium text-xs md:text-lg ${
                  avg && avg > props.propLine
                    ? "text-bpGreen"
                    : avg === props.propLine
                    ? "text-white"
                    : "text-bpRed"
                }`}
              >
                {avg} {shortenedProp}
              </span>
            ) : (
              <span
                className={`p-4 w-full text-center bg-background-800 text-white min-w-36 md:min-w-fit rounded-xl font-medium text-xs md:text-lg`}
              >
                No Games vs {props.opponent}
              </span>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col min-w-36 md:min-w-fit text-xs md:text-base gap-2 items-start">
            <h1 className="font-medium text-sm md:text-lg">{props.title}</h1>
            <span
              className={`p-4 w-full text-center bg-background-800 rounded-xl font-medium  ${
                avg && avg > props.propLine
                  ? "text-bpGreen"
                  : avg === props.propLine || avg == null
                  ? "text-white"
                  : "text-bpRed"
              }`}
            >
              {avg === null ? (
                <>N/A</>
              ) : (
                <>
                  {avg} {shortenedProp}
                </>
              )}
            </span>
          </div>
        </>
      )}
    </>
  );
};

export default AverageDetails;
