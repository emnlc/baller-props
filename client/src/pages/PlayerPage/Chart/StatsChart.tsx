import { GameLog } from "@/Interface";
import { Bar, BarChart, LabelList, ReferenceLine, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { type ChartConfig } from "@/components/ui/chart";
import { useState } from "react";

type Props = {
  current_season_logs: GameLog[];
  previous_season_logs: GameLog[];
  prop: string | null;
  propLine: number;
};

import ChartButton from "./ChartButton";

const StatsChart = (props: Props) => {
  const [filterRange, setFilterRange] = useState<number | null>(10);
  const [showPreviousSeason, setShowPreviousSeason] = useState(false);

  const filteredLogs = (() => {
    const currentLogs = props.current_season_logs;
    const previousLogs = props.previous_season_logs;

    if (showPreviousSeason) {
      return filterRange === null
        ? previousLogs
        : previousLogs.slice(-filterRange);
    }

    if (filterRange === null) {
      return [];
    }

    if (currentLogs.length < filterRange) {
      const additionalLogs = previousLogs.slice(
        -(filterRange - currentLogs.length)
      );
      return [...additionalLogs, ...currentLogs];
    }

    return filterRange === null ? currentLogs : currentLogs.slice(-filterRange);
  })();

  const chartConfig = {
    prop: {
      label: props.prop,
    },
  } satisfies ChartConfig;

  const propKey = props.prop || "";
  const lineValue = props.propLine;

  const getCombinedLogs = (count: number) => {
    const currentLogs = props.current_season_logs;
    const previousLogs = props.previous_season_logs;

    if (currentLogs.length < count) {
      const additionalLogs = previousLogs.slice(-(count - currentLogs.length));
      return [...additionalLogs, ...currentLogs];
    }

    return currentLogs;
  };

  return (
    <>
      <div className="flex flex-col w-full bg-background-900 rounded-3xl px-2 md:py-8">
        <div className="flex flex-row px-2 md:px-8 gap-1 md:gap-2 pt-6 md:py-0 pb-2 md:pb-0 overflow-x-scroll md:overflow-hidden">
          <ChartButton
            logs={getCombinedLogs(5).slice(-5)}
            title="L5"
            propLine={props.propLine}
            prop={props.prop}
            filterRange={filterRange}
            setFilterRange={setFilterRange}
            showPreviousSeason={showPreviousSeason}
            setShowPreviousSeason={setShowPreviousSeason}
          />
          <ChartButton
            logs={getCombinedLogs(10).slice(-10)}
            title="L10"
            propLine={props.propLine}
            prop={props.prop}
            filterRange={filterRange}
            setFilterRange={setFilterRange}
            showPreviousSeason={showPreviousSeason}
            setShowPreviousSeason={setShowPreviousSeason}
          />
          <ChartButton
            logs={getCombinedLogs(15).slice(-15)}
            title="L15"
            propLine={props.propLine}
            prop={props.prop}
            filterRange={filterRange}
            setFilterRange={setFilterRange}
            showPreviousSeason={showPreviousSeason}
            setShowPreviousSeason={setShowPreviousSeason}
          />
          <ChartButton
            logs={props.current_season_logs}
            title="2024-25"
            propLine={props.propLine}
            prop={props.prop}
            filterRange={filterRange}
            setFilterRange={setFilterRange}
            showPreviousSeason={showPreviousSeason}
            setShowPreviousSeason={setShowPreviousSeason}
          />
          <ChartButton
            logs={props.previous_season_logs}
            title="2023-24"
            propLine={props.propLine}
            prop={props.prop}
            filterRange={filterRange}
            setFilterRange={setFilterRange}
            showPreviousSeason={showPreviousSeason}
            setShowPreviousSeason={setShowPreviousSeason}
            prevSeason={true}
          />
        </div>

        <div className="flex flex-col px-2 md:px-8 mt-6 gap-2 ">
          <span className="font-bold text-lg md:text-2xl">{props.prop}</span>
          <div className="flex flex-row items-center gap-4 w-fit">
            <span className="text-sm md:text-lg font-medium">Line</span>
            <Input
              type="number"
              step={0.5}
              defaultValue={props.propLine}
              className="font-medium text-sm md:text-lg bg-background-800 px-2 py-1 rounded-lg w-20"
            />
          </div>
        </div>

        <div>
          <ChartContainer
            config={chartConfig}
            className="min-h-[200px] max-h-[450px] w-full px-2 md:px-8"
          >
            <BarChart
              barCategoryGap={0.75}
              margin={{ top: 25, bottom: 25 }}
              data={filteredLogs}
            >
              <ChartTooltip
                cursor={{ fillOpacity: 0.2 }}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey={propKey} radius={5} minPointSize={4}>
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
                {filteredLogs.length < 16 && (
                  <>
                    <LabelList
                      dataKey="MATCHUP"
                      position="bottom"
                      fill="white"
                      className="hidden sm:block sm:text-[0.55rem] lg:text-sm"
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
                      position={"top"}
                      fontWeight={"bold"}
                      fill="white"
                      className="text-xs"
                    />
                  </>
                )}
              </Bar>
              <ReferenceLine
                y={lineValue}
                stroke="#737373"
                strokeWidth={2}
                strokeDasharray="10 5"
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </>
  );
};

export default StatsChart;
