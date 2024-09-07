import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export const FilterItems = ({
  handleFilter,
  placeholder,
  defaultValue = "",
}: {
  handleFilter: CallableFunction;
  placeholder: string;
  defaultValue: string;
}) => {
    
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
                  value={inputValue}

          placeholder={placeholder}
          onChange={(event) => setInputValue(event.target.value)}
          onBlur={(event) => handleFilter(inputValue)}
          className="max-w-sm"
        />
      </div>
    </div>
  );
};
