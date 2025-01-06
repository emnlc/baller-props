type Props = {
  sortOrder: "asc" | "desc";
  sortColumn: "l10Avg" | "l5HitRate" | "l10HitRate" | "l15HitRate";
  handleSort: (
    column: "l10Avg" | "l5HitRate" | "l10HitRate" | "l15HitRate"
  ) => void;
};

const MobileFilters = (props: Props) => {
  return (
    <>
      <div className="card-controls div  flex flex-row justify-between font-bold gap-2 overflow-x-scroll">
        {[
          { column: "l10Avg", label: "Avg" },
          { column: "l5HitRate", label: "L5" },
          { column: "l10HitRate", label: "L10" },
          { column: "l15HitRate", label: "L15" },
        ].map(({ column, label }) => (
          <button
            key={column}
            className={`bg-background-800 px-4 py-2 flex w-full flex-row items-center justify-center rounded-xl ${
              props.sortColumn === column ? "text-accent-300" : "text-white"
            }`}
            onClick={() =>
              props.handleSort(
                column as "l10Avg" | "l5HitRate" | "l10HitRate" | "l15HitRate"
              )
            }
          >
            <span className="">
              {label}
              {""}
              {props.sortColumn === column
                ? props.sortOrder === "asc"
                  ? "↑"
                  : "↓"
                : "↓"}
            </span>
          </button>
        ))}
      </div>
    </>
  );
};

export default MobileFilters;
