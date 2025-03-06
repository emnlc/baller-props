import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

type GameFilterProps = {
  availableGames: string[];
  selectedGames: string[];
  toggleGameSelection: (game: string) => void;
};

const GamesFilter = ({
  availableGames,
  selectedGames,
  toggleGameSelection,
}: GameFilterProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          role="combobox"
          aria-expanded={open}
          className="bg-background-800 h-full text-sm font-semibold justify-between w-44 md:w-48 hover:bg-opacity-60"
        >
          Available Games
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="bg-background-900 w-44 md:w-48 text-white font-normal">
        <div className="flex flex-col gap-2">
          {availableGames.map((game) => (
            <label
              key={game}
              className="flex rounded-sm justify-between items-center text-sm hover:bg-background-600 px-2"
            >
              <span>{game}</span>
              <input
                type="checkbox"
                checked={selectedGames.includes(game)}
                onChange={() => toggleGameSelection(game)}
              />
            </label>
          ))}
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

export default GamesFilter;
