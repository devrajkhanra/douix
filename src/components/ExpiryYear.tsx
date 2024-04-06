
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Label } from "./ui/label";
import { useSelector, useDispatch } from "react-redux";
import {
  addSelectedDate,
  removeSelectedDate,
  clearSelectedDates,
} from "@/store/selectedDatesSlice"; // Import actions from selectedDatesSlice
import { RootState } from "@/store/store"; // Import RootState type
import { AlertCircle, RotateCw } from "lucide-react";

interface ExpiryYearProps {
  data?: {
    expiryDates: string[];
  };
  error: any;
  isLoading: boolean;
}

const ExpiryYear: React.FC<ExpiryYearProps> = ({ data, error, isLoading }) => {
  const [selectedYears, setSelectedYears] = useState<string[]>([]);

  const uniqueYears = data?.expiryDates
    ? Array.from(new Set(data.expiryDates.map(date => new Date(date).getFullYear().toString())))
    : [];

  const dispatch = useDispatch(); // Get dispatch function

  const selectedDates = useSelector((state: RootState) => state.selectedDates.selectedDates); // Get selected dates from the store

  const handleYearChange = (year: string) => {
    if (selectedYears.includes(year)) {
      setSelectedYears(selectedYears.filter(y => y !== year));
      dispatch(clearSelectedDates()); // Clear selected dates for the deselected year
    } else {
      setSelectedYears([...selectedYears, year]);
    }
  };

  const handleDateChange = (date: string) => {
    if (selectedDates.includes(date))
      dispatch(removeSelectedDate(date)); // Remove date if already selected
    else
      dispatch(addSelectedDate(date)); // Add date if not selected
  };

  const formatDate = (dateString: string) => {
    const dateObj = new Date(dateString);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = dateObj.toLocaleString("default", { month: "short" });
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (isLoading) {
    return <RotateCw className="h-4 w-4 animate-spin" />;
  }

  if (error) {
    return <AlertCircle className="h-4 w-4 fill-red-500 " />;
  }

  return (
    <div className="flex justify-start items-start">
      {/* Display checkboxes for selecting years */}
      {data && data.expiryDates && (
        <div>
          <Table className="mt-[2px] h-[50px]">
            <TableBody>
              <Label className="text-xs font-bold">Select Year</Label>
              <ScrollArea className="w-[130px] h-[50px]">
                {uniqueYears.map((year: string) => {
                  return (
                    <TableRow key={year}>
                      <TableCell className="flex gap-1">
                        <Checkbox
                          key={year}
                          checked={selectedYears.includes(year)}
                          onCheckedChange={() => handleYearChange(year)}
                          disabled={!data}
                        />
                        <Separator orientation="vertical" />
                        {year}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </ScrollArea>
            </TableBody>
          </Table>
        </div>
      )}

      <Table className="mt-[2px] h-[50px]">
        <TableBody>
          <Label className="text-xs font-bold">Select Dates</Label>
          <ScrollArea className="w-[130px] h-[50px]">
            {data && data.expiryDates && data.expiryDates.filter(expiryDate => selectedYears.includes(new Date(expiryDate).getFullYear().toString())).map(expiryDate => {
              const formattedDate = formatDate(expiryDate);
              return (
                <TableRow key={expiryDate}>
                  <TableCell className="flex gap-1">
                    <Checkbox
                      key={expiryDate}
                      checked={selectedDates.includes(expiryDate)}
                      onCheckedChange={() => handleDateChange(expiryDate)}
                      disabled={!data}
                    />
                    <Separator orientation="vertical" />
                    {formattedDate}
                  </TableCell>
                </TableRow>
              );
            })}
          </ScrollArea>
        </TableBody>
      </Table>
    </div>
  );
};

export default ExpiryYear;
