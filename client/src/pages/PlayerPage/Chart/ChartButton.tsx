import { GameLog } from "@/Interface";
type Props = {
  title: string;
  prop: string | null;
  propLine: number;
  logs: GameLog[];

  setFilterRange: (n: number | null) => void;
  setShowPreviousSeason: (b: boolean) => void;
  setShowH2H: (b: boolean) => void;
  filterRange: number | null;
  showPreviousSeason: boolean;
  showH2H: boolean;

  prevSeason?: boolean;
  h2h?: boolean;
};

const calculateAverage = (logs: GameLog[], key: string) => {
  if (logs.length === 0 || !key) return -1;
  const total = logs.reduce((sum, log) => {
    const value = Number(log[key as keyof GameLog]);
    return sum + (isNaN(value) ? 0 : value);
  }, 0);
  return total / logs.length;
};

const calculateHitRate = (logs: GameLog[], key: string, line: number) => {
  if (logs.length === 0 || !key) return -1;
  const hits = logs.filter((log) => {
    const value = Number(log[key as keyof GameLog]);
    return !isNaN(value) && value >= line;
  }).length;
  return (hits / logs.length) * 100;
};

const ChartButton = (props: Props) => {
  const avg = calculateAverage(props.logs, props.prop as keyof GameLog);
  const hr = calculateHitRate(
    props.logs,
    props.prop as keyof GameLog,
    props.propLine
  );
  return (
    <>
      {props.prevSeason ? (
        <>
          <button
            onClick={() => {
              props.setFilterRange(null);
              props.setShowPreviousSeason(true);
              props.setShowH2H(false);
            }}
            className={`${
              props.showPreviousSeason ? "bg-opacity-100" : "bg-opacity-40"
            } bg-background-800 hover:bg-opacity-100 transition-all font-bold min-w-fit md:min-w-0 text-white px-4 md:px-6 py-2 text-xs md:text-sm rounded text-center flex flex-col justify-center`}
          >
            <span>{props.title}</span>
            {props.logs.length > 0 ? (
              <>
                <span
                  className={`font-semibold text-xs md:text-sm ${
                    hr > 50
                      ? "text-bpGreen"
                      : hr === 50
                      ? "text-gray-300"
                      : "text-bpRed"
                  }`}
                >
                  HR: {hr.toFixed(0)}%
                </span>
                <span
                  className={`font-semibold text-xs md:text-sm ${
                    avg > props.propLine
                      ? "text-bpGreen"
                      : avg === props.propLine
                      ? "text-gray-300"
                      : "text-bpRed"
                  }`}
                >
                  Avg: {avg.toFixed(2)}
                </span>
              </>
            ) : (
              <>
                <span
                  className={`font-semibold text-xs md:text-sm text-gray-300`}
                >
                  HR: N/A
                </span>
                <span
                  className={`font-semibold text-xs md:text-sm text-gray-300`}
                >
                  Avg: N/A
                </span>
              </>
            )}
          </button>
        </>
      ) : props.h2h ? (
        <>
          <button
            onClick={() => {
              props.setFilterRange(null);
              props.setShowH2H(true);
              props.setShowPreviousSeason(false);
            }}
            className={`${
              props.showH2H ? "bg-opacity-100" : "bg-opacity-40"
            } bg-background-800 hover:bg-opacity-100 transition-all font-bold min-w-fit md:min-w-0 text-white px-4 md:px-6 py-2 text-xs md:text-sm rounded text-center flex flex-col justify-center`}
          >
            <span>{props.title}</span>
            {props.logs.length > 0 ? (
              <>
                <span
                  className={`font-semibold text-xs md:text-sm ${
                    hr > 50
                      ? "text-bpGreen"
                      : hr === 50
                      ? "text-gray-300"
                      : "text-bpRed"
                  }`}
                >
                  HR: {hr.toFixed(0)}%
                </span>
                <span
                  className={`font-semibold text-xs md:text-sm ${
                    avg > props.propLine
                      ? "text-bpGreen"
                      : avg === props.propLine
                      ? "text-gray-300"
                      : "text-bpRed"
                  }`}
                >
                  Avg: {avg.toFixed(2)}
                </span>
              </>
            ) : (
              <>
                <span
                  className={`font-semibold text-xs md:text-sm text-gray-300`}
                >
                  HR: N/A
                </span>
                <span
                  className={`font-semibold text-xs md:text-sm text-gray-300`}
                >
                  Avg: N/A
                </span>
              </>
            )}
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              props.setFilterRange(props.logs.length);
              props.setShowPreviousSeason(false);
              props.setShowH2H(false);
            }}
            className={`${
              props.filterRange === props.logs.length &&
              !props.showPreviousSeason
                ? "bg-opacity-100"
                : "bg-opacity-40"
            } bg-background-800 hover:bg-opacity-100 transition-all font-bold min-w-fit text-white px-4 md:px-6 py-2 text-xs md:text-sm rounded text-center flex flex-col justify-center`}
          >
            <span>{props.title}</span>
            <span
              className={`font-semibold text-xs md:text-sm ${
                hr > 50
                  ? "text-bpGreen"
                  : hr === 50 || hr === -1
                  ? "text-gray-300"
                  : "text-bpRed"
              }`}
            >
              {hr === -1 ? <>Avg: N/A</> : <>HR: {hr.toFixed(0)}%</>}
            </span>
            <span
              className={`font-semibold text-xs md:text-sm ${
                avg > props.propLine
                  ? "text-bpGreen"
                  : avg === props.propLine || avg === -1
                  ? "text-gray-300"
                  : "text-bpRed"
              }`}
            >
              {avg === -1 ? <>HR: N/A</> : <>Avg: {avg.toFixed(2)}</>}
            </span>
          </button>
        </>
      )}
    </>
  );
};

export default ChartButton;
