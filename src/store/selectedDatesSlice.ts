// selectedDatesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectedDatesState {
  selectedDates: string[];
}

const initialState: SelectedDatesState = {
  selectedDates: [],
};

const selectedDatesSlice = createSlice({
  name: "selectedDates",
  initialState,
  reducers: {
    addSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDates.push(action.payload);
    },
    removeSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDates = state.selectedDates.filter(
        (date) => date !== action.payload
      );
    },
    clearSelectedDates: (state) => {
      state.selectedDates = [];
    },
  },
});

export const { addSelectedDate, removeSelectedDate, clearSelectedDates } =
  selectedDatesSlice.actions;

export default selectedDatesSlice.reducer;
