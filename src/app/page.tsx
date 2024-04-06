// import Image from "next/image";

// import { AppProps } from 'next/app';

"use client";
import { Provider } from "react-redux";
import store from "../store/store";
import { ThemeProvider } from "@/components/themeProvider";
import DashboardPage from "@/components/DashboardPage";

export default function Home() {
  return (
    // Provide the Redux store to the entire application
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <DashboardPage />
      </ThemeProvider>
    </Provider>
  );
}
