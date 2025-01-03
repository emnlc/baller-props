import { useState } from "react";
import { GameLog } from "@/Interface";
import { Bar, BarChart, LabelList, ReferenceLine, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { type ChartConfig } from "@/components/ui/chart";

type Props = {
  current_season_logs: GameLog[];
  previous_season_logs: GameLog[];
  prop: string | null;
  propLine: number;
};

const StatsChart = (props: Props) => {
  const [filteredLogs, setFilteredLogs] = useState<GameLog[]>(
    props.current_season_logs
  );

  const chartConfig = {
    prop: {
      label: props.prop,
    },
  } satisfies ChartConfig;

  const propKey = props.prop || "";
  const lineValue = props.propLine;

  const filterLogs = (n: number) => {
    setFilteredLogs(props.current_season_logs.slice(-n));
  };

  const showAllGames = () => {
    setFilteredLogs(props.current_season_logs);
  };

  return (
    <>
      <div className="flex justify-center my-8">
        <button
          onClick={() => filterLogs(5)}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Last 5 Games
        </button>
        <button
          onClick={() => filterLogs(10)}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Last 10 Games
        </button>
        <button
          onClick={() => filterLogs(15)}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Last 15 Games
        </button>
        <button
          onClick={showAllGames}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          All Games
        </button>
      </div>

      <ChartContainer
        config={chartConfig}
        className="min-h-[200px] max-h-[600px] mx-auto px-8"
      >
        <BarChart
          barCategoryGap={1}
          margin={{ bottom: 25 }}
          data={filteredLogs}
        >
          <ChartTooltip
            cursor={{ fillOpacity: 0.2 }}
            content={<ChartTooltipContent />}
          />
          <Bar dataKey={propKey} radius={3} minPointSize={4}>
            {filteredLogs.map((entry, index) => {
              const value = Number(entry[propKey as keyof GameLog]);

              const color =
                !isNaN(value) && value > lineValue
                  ? "#59FFA0"
                  : value === lineValue
                  ? "gray"
                  : "#CF293A";

              return <Cell key={`cell-${index}`} fill={color} />;
            })}

            <LabelList
              dataKey="MATCHUP"
              position="bottom"
              fill="white"
              fontSize={14}
              fontWeight={"bold"}
              formatter={(value: string) => {
                if (!value) return "";
                const separator = value.includes("@") ? "@" : "vs.";
                return value.includes(separator)
                  ? `${separator} ${value.split(separator)[1].trim()}`
                  : value;
              }}
            />

            <LabelList
              dataKey={propKey}
              position={"insideTop"}
              fill="white"
              content={({ x, y, width, value }) =>
                value === 0 ? null : (
                  <text
                    x={
                      parseInt(String(x)) +
                      (width ? parseFloat(String(width)) / 2 : 0)
                    }
                    y={parseInt(String(y)) + 18}
                    fill="#fff"
                    textAnchor="middle"
                    fontWeight={"bold"}
                  >
                    {value}
                  </text>
                )
              }
            />
          </Bar>

          <ReferenceLine
            y={lineValue}
            stroke="#adadad"
            strokeWidth={3}
            strokeDasharray="10 5"
          />
        </BarChart>
      </ChartContainer>
    </>
  );
};

export default StatsChart;
