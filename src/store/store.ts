// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { lastDownload } from "./lastDownloadSlice";
import { expiryApi } from "./expirySlice";
import setNamesSlice from "./setNamesSlice";
import selectedDatesReducer from "./selectedDatesSlice";

const store = configureStore({
  reducer: {
    [lastDownload.reducerPath]: lastDownload.reducer,
    [expiryApi.reducerPath]: expiryApi.reducer,
    setNames: setNamesSlice.reducer,
    selectedDates: selectedDatesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      lastDownload.middleware,
      expiryApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
