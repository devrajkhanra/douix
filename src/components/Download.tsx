"use client";
// const indiceURL = `https://archives.nseindia.com/content/indices/ind_close_all_${dateStr}.csv`; // Adjusted URL with selected date
// const stockURL = `https://archives.nseindia.com/products/content/sec_bhavdata_full_${dateStr}.csv`; // Adjusted URL with selected date

// Download.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/utils/dateHelper";
import axios from "axios";
import {
  AlertCircle,
  CalendarPlus,
  Check,
  DownloadCloud,
  LucideCalendarCheck,
  RotateCw,
} from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";
import { useGetLastUpdatedDateQuery } from "@/store/lastDownloadSlice";
import { Separator } from "./ui/separator";

const Download = () => {
  const {
    data: lastUpdatedDate,
    error,
    isLoading,
    refetch,
  } = useGetLastUpdatedDateQuery();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined); // Initially undefined
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleDownload = async () => {
    try {
      if (selectedDate !== undefined) {
        setLoading(true); // Start loading
        const dateStr = formatDate(selectedDate);
        const dateStrOption = format(selectedDate, "ddMMMyyyy").toUpperCase();

        const optionURL = `C:/Users/Rar/Desktop/fo/fo${dateStrOption}bhav.csv.zip`;
        const indiceURL = `https://archives.nseindia.com/content/indices/ind_close_all_${dateStr}.csv`;
        const stockURL = `https://archives.nseindia.com/products/content/sec_bhavdata_full_${dateStr}.csv`;
        await axios.post("/api/parseAndSaveData", {
          optionURL,
          indiceURL,
          stockURL,
          dateStr,
        });

        setCompleted(true); // Set completion flag
        refetch();
      }
    } catch (error) {
      console.error("An error occurred during data parsing and saving:", error);
      setCompleted(false);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className=" p-2 flex gap-3 items-center">
      <Popover>
        <PopoverTrigger>
          {selectedDate === undefined ? (
            <div className="flex gap-2 justify-center items-center">
              <CalendarPlus className="h-4 w-4" />
              <p>Select Date</p>
            </div>
          ) : (
            <div className="flex gap-2 justify-center items-center">
              <LucideCalendarCheck className="h-4 w-4" />
              <p>{formatDate(selectedDate)}</p>
            </div>
          )}
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md"
          />
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="h-8" />

      <Button
        onClick={handleDownload}
        disabled={loading}
        variant="ghost"
        size="default"
      >
        {loading ? (
          <div className="flex gap-2 justify-center items-center">
            <RotateCw className="animate-spin h-4 w-4" />
            <p>Downloading...</p>
          </div>
        ) : selectedDate === undefined ? (
          <></>
        ) : completed ? (
          <div className="flex gap-2 justify-center items-center">
            <Check className="h-4 w-4" />
            <p>Downloaded</p>
          </div>
        ) : (
          <DownloadCloud className="h-4 w-4" />
        )}
      </Button>

      <Separator orientation="vertical" className="h-8" />

      <div className="flex gap-2 justify-center items-center">

        {isLoading ? (
          <RotateCw className="animate-spin h-4 w-4" />
        ) : error ? (
          <AlertCircle className="h-4 w-4" />
        ) : (
          <div className="flex gap-1">
            <p>Last Updated:</p>
            <p className="font-bold">{lastUpdatedDate?.date}</p>
          </div>

        )}
      </div>
    </div>
  );
};

export default Download;
