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
  handleSelectAll: () => void;
  handleDeselectAll: () => void;
};

const PropsFilter = (props: Props) => {
  const [open, setOpen] = useState(false);

  const hasSelectedProps = props.selectedProps.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          role="combobox"
          aria-expanded={open}
          className="bg-background-800 h-full text-sm font-semibold justify-between w-44 md:w-48 hover:bg-opacity-60"
        >
          Prop Types
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="bg-background-900 w-44 md:w-48 text-white font-normal">
        <div className="flex flex-col gap-2 overflow-y-scroll max-h-40 table-scrollbar">
          {props.availableProps.map((prop) => (
            <label
              key={prop}
              className="flex rounded-sm justify-between items-center text-sm hover:bg-background-600 px-2 "
            >
              {prop}
              <input
                type="checkbox"
                value={prop}
                onChange={() => props.handlePropSelection(prop)}
                checked={props.selectedProps.includes(prop)}
              />
            </label>
          ))}
        </div>
        <div className="flex flex-row gap-1 mt-2">
          <Button
            onClick={
              hasSelectedProps ? props.handleDeselectAll : props.handleSelectAll
            }
            className="w-full text-xs  hover:bg-background-700 transition-colors bg-background-800"
          >
            {hasSelectedProps ? "Clear" : "Select All"}
          </Button>
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

export default PropsFilter;
