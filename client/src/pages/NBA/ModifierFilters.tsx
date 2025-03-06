import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

type Props = {
  filterModifiers: { goblin: boolean; demon: boolean; standard: boolean };
  toggleFilter: (filter: "demon" | "goblin" | "standard") => void;
};

const ModifierFilters = (props: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          role="combobox"
          aria-expanded={open}
          className="bg-background-800 h-full text-sm font-semibold justify-between w-44 md:w-48 hover:bg-opacity-60"
        >
          Modifier Options
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="bg-background-900 text-white w-44 md:w-48 font-normal">
        <div className="flex flex-col gap-2">
          <label className="flex rounded-sm justify-between items-center text-sm hover:bg-background-600 px-2">
            <span>Goblin</span>
            <input
              type="checkbox"
              checked={props.filterModifiers.goblin}
              onChange={() => props.toggleFilter("goblin")}
            />
          </label>
          <label className="flex rounded-sm justify-between items-center text-sm hover:bg-background-600 px-2">
            <span>Demon</span>
            <input
              type="checkbox"
              checked={props.filterModifiers.demon}
              onChange={() => props.toggleFilter("demon")}
            />
          </label>
          <label className="flex rounded-sm justify-between items-center text-sm hover:bg-background-600 px-2">
            <span>Standard</span>
            <input
              type="checkbox"
              checked={props.filterModifiers.standard}
              onChange={() => props.toggleFilter("standard")}
            />
          </label>
        </div>
        <div className="flex flex-row gap-1 mt-2">
          <Button
            onClick={() => {
              setOpen(!open);
            }}
            className="w-full text-xs hover:bg-background-700 transition-colors bg-background-800"
          >
            Close
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ModifierFilters;
