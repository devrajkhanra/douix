// setNamesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SetNamesState {
  collectionName: string;
  instrument: string;
}

const initialState: SetNamesState = {
  collectionName: "",
  instrument: "",
};

const setNamesSlice = createSlice({
  name: "setNames",
  initialState,
  reducers: {
    setCollectionName: (state, action: PayloadAction<string>) => {
      state.collectionName = action.payload;
    },
    setInstrument: (state, action: PayloadAction<string>) => {
      state.instrument = action.payload;
    },
    clearSetNamesData: (state) => {
      state.collectionName = "";
      state.instrument = "";
    },
  },
});

export const { setCollectionName, setInstrument, clearSetNamesData } =
  setNamesSlice.actions;

export default setNamesSlice;
