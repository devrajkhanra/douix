
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RotateCw, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Form,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ExpiryYear from "./ExpiryYear"; // Import ExpiryYear component
import { useGetExpiryDatesQuery } from "@/store/expirySlice";
import { useDispatch, useSelector } from "react-redux"; // Import useSelector
import { setCollectionName, setInstrument } from "@/store/setNamesSlice"; // Import setCollectionName and setInstrument actions and RootState type
import { RootState } from "@/store/store";
import * as z from "zod";
import { Separator } from "./ui/separator";

const formSchema = z.object({
  collectionName: z.enum(["", "nifties", "banknifties"]),
  instrument: z.enum(["", "FUTIDX", "OPTIDX"]),
});

const Expiry = () => {
  const [responseList, setResponseList] = useState<string[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const dispatch = useDispatch(); // Get dispatch function

  // Get collectionName and instrument from the store state
  const { collectionName, instrument } = useSelector(
    (state: RootState) => state.setNames
  );

  // Fetching expiry dates using the provided slice
  const { data, error, isLoading } = useGetExpiryDatesQuery(
    form.getValues(),
    { refetchOnMountOrArgChange: true }
  );

  const handleFetchData = async (values: z.infer<typeof formSchema>) => {
    console.log({ values });
  };

  const handleClearDates = () => {
    setResponseList([]);
    form.reset({
      collectionName: "",
      instrument: "",
    });

    // Dispatch actions to clear collectionName and instrument in the store
    dispatch(setCollectionName(""));
    dispatch(setInstrument(""));
  };

  return (
    <div className="flex gap-4 border justify-start items-start p-1 shadow">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFetchData)}
          className="flex flex-row items-end gap-4"
        >
          <FormItem>
            <FormLabel className="text-xs p-0 m-0 font-bold">Indices</FormLabel>
            <Select
              onValueChange={(value) => {
                if (value === "nifties" || value === "banknifties") {
                  form.setValue("collectionName", value);
                  dispatch(setCollectionName(value)); // Dispatch action to update collectionName
                } else {
                  // Handle invalid value
                  console.error("Invalid value:", value);
                }
              }}
              value={collectionName} // Set value to ensure it's controlled
            >
              <SelectTrigger className="text-sm p-0 m-0">
                <SelectValue placeholder="Select an Indice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="text-sm" value="nifties">Nifty</SelectItem>
                <SelectItem className="text-sm" value="banknifties">Bank Nifty</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>

          <FormItem>
            <FormLabel className="text-xs p-0 m-0 font-bold">Instruments</FormLabel>
            <Select
              onValueChange={(value) => {
                if (value === "FUTIDX" || value === "OPTIDX") {
                  form.setValue("instrument", value);
                  dispatch(setInstrument(value)); // Dispatch action to update instrument
                } else {
                  // Handle invalid value
                  console.error("Invalid value:", value);
                }
              }}
              value={instrument} // Set value to ensure it's controlled
            >
              <SelectTrigger className="text-sm p-0 m-0">
                <SelectValue placeholder="Select an Instrument" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="text-sm" value="FUTIDX">Future</SelectItem>
                <SelectItem className="text-sm" value="OPTIDX">Options</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>

          <Button type="submit" variant="outline" size="icon">
            {(collectionName === "" || instrument === "") ? <Plus className="h-4 w-4 disabled:* cursor-not-allowed" /> :
              (isLoading ? <RotateCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />)}
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleClearDates}
          >
            <X className="h-4 w-4" />
          </Button>

        </form>
      </Form>

      <Separator orientation="vertical" />

      {/* Render ExpiryYear component and pass data, error, and isLoading */}
      <ExpiryYear data={data} error={error} isLoading={isLoading} />

    </div>
  );
};

export default Expiry;
