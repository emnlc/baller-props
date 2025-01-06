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
          className="bg-background-800 h-full text-sm font-semibold justify-between w-full md:min-w-fit hover:bg-opacity-60"
        >
          Available Games
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="bg-background-800 text-white font-medium">
        <div className="flex flex-col gap-2">
          {availableGames.map((game) => (
            <label
              key={game}
              className="flex rounded-lg justify-between items-center text-sm md:text-base hover:bg-background-600 px-2"
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
      </PopoverContent>
    </Popover>
  );
};

export default GamesFilter;
