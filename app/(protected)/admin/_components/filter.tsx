import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuizFormValues } from "@/schemas/quiz";

import { useState, useEffect } from "react";

export const FilterItems = ({
  handleFilter,
  placeholder,
  data,
  filterValue
}: {
  handleFilter: CallableFunction;
  placeholder: string;
  data: Map<string, string> | undefined;
  filterValue:string
}) => {

  const [selectedFilter, setSelectedFilter] = useState<string | "">("")
  const router = useRouter();

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
      
        <Select
          onValueChange={(value) => {
            //handleFilter(value);
            router.push(`/admin/question/liste?filter_by_quiz=${value}`)
            setSelectedFilter(value)
          }}
          defaultValue={selectedFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{placeholder}</SelectLabel>

              {/** display data */}
              {Array.from(data?.entries() ?? []).map(([id, title]) => (
                <SelectItem key={id} value={id}>
                  {title}
                </SelectItem>
              ))}
              
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
