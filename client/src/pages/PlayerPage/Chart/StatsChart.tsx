import { GameLog } from "@/Interface";
import { Bar, BarChart, LabelList, ReferenceLine, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { type ChartConfig } from "@/components/ui/chart";
import { useState, useMemo, useCallback } from "react";

type Props = {
  current_season_logs: GameLog[];
  previous_season_logs: GameLog[];
  prop: string | null;
  propLine: number;
  propOdd: string | null;
  opponent: string;
};

import ChartButton from "./ChartButton";

const StatsChart = (props: Props) => {
  const [filterRange, setFilterRange] = useState<number | null>(10);
  const [showPreviousSeason, setShowPreviousSeason] = useState(false);
  const [showH2H, setShowH2H] = useState(false);
  const [propLine, setPropLine] = useState<number>(props.propLine); // Local state for live line adjustment

  const getH2HLogs = useCallback(
    (opponent: string) => {
      const currentLogs = props.current_season_logs;
      const previousLogs = props.previous_season_logs;

      const allLogs = [...previousLogs, ...currentLogs];

      const h2hLogs = allLogs.filter((log) => log.MATCHUP.includes(opponent));

      console.log(h2hLogs);
      return h2hLogs;
    },
    [props.current_season_logs, props.previous_season_logs] // Dependencies for useCallback
  );

  const filteredLogs = useMemo(() => {
    const currentLogs = props.current_season_logs;
    const previousLogs = props.previous_season_logs;

    if (showPreviousSeason) {
      return filterRange === null
        ? previousLogs
        : previousLogs.slice(-filterRange);
    }

    if (showH2H) {
      return getH2HLogs(props.opponent);
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
  }, [
    filterRange,
    showPreviousSeason,
    showH2H,
    props.opponent,
    props.current_season_logs,
    props.previous_season_logs,
    getH2HLogs,
  ]);

  const chartConfig = {
    prop: {
      label: props.prop,
    },
  } satisfies ChartConfig;

  const propKey = props.prop || "";

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
      <div className="flex flex-col w-full bg-background-900 rounded-3xl px-2 md:py-8 border border-background-600">
        {/* Button Controls */}
        <div className="flex flex-row px-2 md:px-8 gap-1 md:gap-2 pt-6 md:py-0 pb-2 md:pb-0 overflow-x-scroll md:overflow-hidden">
          {[5, 10, 15].map((range) => (
            <ChartButton
              key={range}
              logs={getCombinedLogs(range).slice(-range)}
              title={`L${range}`}
              propLine={propLine}
              prop={props.prop}
              filterRange={filterRange}
              setFilterRange={setFilterRange}
              showPreviousSeason={showPreviousSeason}
              showH2H={showH2H}
              setShowPreviousSeason={setShowPreviousSeason}
              setShowH2H={setShowH2H}
            />
          ))}
          <ChartButton
            logs={props.current_season_logs}
            title="2024-25"
            propLine={propLine}
            prop={props.prop}
            filterRange={filterRange}
            setFilterRange={setFilterRange}
            showPreviousSeason={showPreviousSeason}
            showH2H={showH2H}
            setShowPreviousSeason={setShowPreviousSeason}
            setShowH2H={setShowH2H}
          />
          <ChartButton
            logs={props.previous_season_logs}
            title="2023-24"
            propLine={propLine}
            prop={props.prop}
            filterRange={filterRange}
            setFilterRange={setFilterRange}
            showPreviousSeason={showPreviousSeason}
            showH2H={showH2H}
            setShowPreviousSeason={setShowPreviousSeason}
            setShowH2H={setShowH2H}
            prevSeason={true}
          />
          <ChartButton
            logs={getH2HLogs(props.opponent)}
            title="H2H"
            propLine={propLine}
            prop={props.prop}
            filterRange={filterRange}
            setFilterRange={setFilterRange}
            showPreviousSeason={showPreviousSeason}
            showH2H={showH2H}
            setShowPreviousSeason={setShowPreviousSeason}
            setShowH2H={setShowH2H}
            h2h={true}
          />
        </div>

        {/* Line Input Control */}
        <div className="flex flex-col px-2 md:px-8 mt-6 gap-2">
          <span className="font-bold text-lg md:text-2xl flex flex-row justify-start items-center">
            {props.prop}{" "}
            <img
              src={`${
                props.propOdd === "goblin"
                  ? "goblin.png"
                  : props.propOdd === "standard"
                  ? ""
                  : "demon.png"
              }`}
              className="w-10"
              alt=""
            />
          </span>
          <div className="flex flex-row items-center gap-4 w-fit">
            <span className="text-sm font-medium">Line</span>
            <Input
              type="number"
              step={0.5}
              min={0}
              value={propLine}
              onChange={(e) => setPropLine(Number(e.target.value))}
              className="font-medium text-sm bg-background-800 px-2 py-1 rounded-lg w-20 border border-background-600"
            />
          </div>
        </div>

        {/* Chart Section */}
        <div className="flex h-auto">
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
                    !isNaN(value) && value > propLine
                      ? "#59FFA0"
                      : value === propLine
                      ? "gray"
                      : "#CF293A";

                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
                {filteredLogs.length < 16 && (
                  <>
                    {/* Keeping Your Label Formatting Logic */}
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
                      className="text-xs "
                    />
                  </>
                )}
              </Bar>
              {/* Line Updating without Full Chart Rerender */}
              <ReferenceLine
                y={propLine}
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
