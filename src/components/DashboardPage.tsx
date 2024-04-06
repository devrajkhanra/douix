"use client";
import { Metadata } from "next";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Download from "./Download";
import { ThemeToggle } from "./ThemeToggle";
import Expiry from "./Expiry";
import FetchDocumets from "./FetchDocuments";
export const metadata: Metadata = {
  title: "Analysis App",
  description: "Stock Market Analysis",
};

export default function DashboardPage() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="max-w-[100%] min-h-screen rounded-lg border"
    >
      {/* <ResizablePanel defaultSize={10}>
        <div className="flex h-full justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel> */}

      <ResizableHandle />

      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={7}>
            <div className="flex h-full items-center justify-center gap-3">
              <ThemeToggle />
              <Separator orientation="vertical" className="h-8" />
              <Download />
            </div>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={75}>
            <div className="flex flex-col h-full items-center w-full">
              <div className="flex p-1">
                <Expiry />
              </div>
              <FetchDocumets />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
