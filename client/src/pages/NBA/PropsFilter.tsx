import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type Props = {
  availableProps: string[];
  selectedProps: string[];
  handlePropSelection: (prop: string) => void;
};

const PropsFilter = (props: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          role="combobox"
          aria-expanded={open}
          className="justify-between font-medium"
        >
          Filter by Prop Types
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="bg-neutral-800 text-white font-medium">
        <div className="flex flex-col gap-2">
          {props.availableProps.map((prop) => (
            <label
              key={prop}
              className="flex justify-between items-center text-base hover:bg-neutral-600 px-2"
            >
              <span>{prop}</span>
              <input
                type="checkbox"
                value={prop}
                onChange={() => props.handlePropSelection(prop)}
                checked={props.selectedProps.includes(prop)}
              />
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PropsFilter;
