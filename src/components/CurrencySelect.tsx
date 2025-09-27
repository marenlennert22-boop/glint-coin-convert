import { useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Currency } from "@/lib/currencies";
import { cn } from "@/lib/utils";

interface CurrencySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  currencies: Currency[];
}

export const CurrencySelect = ({ value, onValueChange, currencies }: CurrencySelectProps) => {
  const [open, setOpen] = useState(false);
  const selectedCurrency = currencies.find((currency) => currency.code === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-32 justify-between h-12 bg-background/50 hover:bg-background/80"
        >
          {selectedCurrency ? (
            <div className="flex items-center gap-2">
              <span>{selectedCurrency.flag}</span>
              <span className="font-medium">{selectedCurrency.code}</span>
            </div>
          ) : (
            "Select..."
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Command>
          <CommandInput 
            placeholder="Search currencies..." 
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup>
              {currencies.map((currency) => (
                <CommandItem
                  key={currency.code}
                  value={`${currency.code} ${currency.name}`}
                  onSelect={() => {
                    onValueChange(currency.code);
                    setOpen(false);
                  }}
                  className="cursor-pointer hover:bg-currency-primary/10"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-lg">{currency.flag}</span>
                    <div className="flex flex-col">
                      <span className="font-medium">{currency.code}</span>
                      <span className="text-xs text-muted-foreground">
                        {currency.name}
                      </span>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === currency.code ? "opacity-100 text-currency-success" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};