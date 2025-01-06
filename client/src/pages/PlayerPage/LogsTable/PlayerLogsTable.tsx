import { GameLog } from "@/Interface";

import {
  Table,
  TableBody,
  //   TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  logs: GameLog[];
};

const shortenedProps: Record<string, string> = {
  GAME_DATE: "Date",
  MATCHUP: "Opp",
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

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${day}/${year}`;
};

const formatOpponent = (gameTitle: string) => {
  const gameTitleArr = gameTitle.split(" ");
  return gameTitleArr.at(-1);
};

const PlayerLogsTable = (props: Props) => {
  if (!props.logs || props.logs.length === 0) {
    return <div>No logs available</div>;
  }

  const headers = Object.keys(shortenedProps);

  return (
    <>
      <Table className="bg-background-900 text-xs md:text-sm">
        <TableHeader className="bg-background-800 text-center">
          <TableRow>
            {headers.map((header) => (
              <TableHead className="text-center" key={header}>
                {shortenedProps[header]}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="font-medium [&>*:nth-child(odd)]:bg-background-900 [&>*:nth-child(even)]:bg-background-950 ">
          {props.logs
            .slice()
            .reverse()
            .map((log, index) => (
              <TableRow className="text-center" key={index}>
                {headers.map((header) => (
                  <TableCell className="py-4 md:py-6" key={header}>
                    {header === "GAME_DATE" && log[header as keyof GameLog]
                      ? formatDate(log[header as keyof GameLog] as string)
                      : header === "MATCHUP" && log[header as keyof GameLog]
                      ? formatOpponent(log[header as keyof GameLog] as string)
                      : log[header as keyof GameLog] ?? "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
};

export default PlayerLogsTable;
