import { GameLog } from "@/Interface";

type TooltipPayload = {
  name: string;
  value: number;
  payload: GameLog;
  color?: string;
  dataKey?: string;
}[];

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload;
  prop?: string;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${day}/${year}`;
};

const CustomTooltip = ({ active, payload, prop }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data: GameLog = payload[0].payload;

    const originalStats = ["Points", "Assists", "Rebounds"];

    return (
      <div className="bg-background-800 border text-xs border-background-600 py-2 px-4 rounded-lg flex flex-col gap-2">
        <div className="flex flex-col">
          <div className="flex flex-row gap-8">
            <p className="font-bold">{data.MATCHUP}</p>
            <p className="font-bold">{formatDate(data.GAME_DATE)}</p>
          </div>
          <span>{data.SeasonType.toUpperCase()}</span>
        </div>
        <div className="flex flex-col gap-1">
          <p>{`Minutes: ${data.Minutes}`}</p>
          <p
            className={`${prop === "Points" ? "font-bold" : ""}`}
          >{`Points: ${data.Points}`}</p>
          <p
            className={`${prop === "Rebounds" ? "font-bold" : ""}`}
          >{`Rebounds: ${data.Rebounds}`}</p>
          <p
            className={`${prop === "Assists" ? "font-bold" : ""}`}
          >{`Assists: ${data.Assists}`}</p>

          {/* Dynamic prop */}
          {prop && !originalStats.includes(prop) && (
            <p className="font-bold">{`${prop}: ${
              data[prop as keyof GameLog]
            }`}</p>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
