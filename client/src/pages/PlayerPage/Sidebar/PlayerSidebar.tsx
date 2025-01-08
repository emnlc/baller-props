import { GameLog } from "@/Interface";

type Props = {
  current_season_logs: GameLog[];
  selected_prop: string | null;
  prop_line: number;
  opponent: string;
};

import AverageDetails from "./AverageDetails";

const PlayerSidebar = (props: Props) => {
  const homeLogs = props.current_season_logs.filter((game) =>
    game.MATCHUP.includes("vs.")
  );
  const awayLogs = props.current_season_logs.filter((game) =>
    game.MATCHUP.includes("@")
  );
  const h2hLogs = props.current_season_logs.filter((game) =>
    game.MATCHUP.includes(props.opponent)
  );

  return (
    <>
      <div className="flex flex-col md:min-w-fit px-4 md:px-8 rounded-3xl bg-background-900">
        <div className="flex flex-row justify-between md:flex-col gap-4 pt-8">
          <h1 className="md:text-3xl font-bold">Quick Averages</h1>
          <h1 className="md:text-xl font-medium">{props.selected_prop}</h1>
        </div>

        <div className="flex flex-row xl:flex-col pb-2 md:pb-0 gap-2 md:gap-8 mb-2 mt-6 md:my-8 overflow-x-scroll md:overflow-hidden">
          <AverageDetails
            logs={props.current_season_logs}
            title="2024-25"
            prop={props.selected_prop}
            propLine={props.prop_line}
          />
          <AverageDetails
            logs={homeLogs}
            title="2024-25 Home"
            prop={props.selected_prop}
            propLine={props.prop_line}
          />
          <AverageDetails
            logs={awayLogs}
            title="2024-25 Away"
            prop={props.selected_prop}
            propLine={props.prop_line}
          />

          <AverageDetails
            logs={h2hLogs}
            title={`2024-25 vs. ${props.opponent}`}
            prop={props.selected_prop}
            propLine={props.prop_line}
            h2h={true}
            opponent={props.opponent}
          />
        </div>
      </div>
    </>
  );
};

export default PlayerSidebar;
