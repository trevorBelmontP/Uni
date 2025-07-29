import React, { useState } from "react";
import { ArrowLeft, MoreVertical, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLocation, useParams } from "wouter";
import { SideNavigation } from "@/components/SideNavigation";
import { BarcodeModeProvider, useBarcodeMode } from "@/contexts/BarcodeModeContext";

interface ShelfItem {
  id: string;
  shelfCode: string;
  skuCount: number;
  pendingQty: number;
}

interface Section {
  id: string;
  name: string;
  count: number;
}

export const PicklistDetailPage: React.FC = () => {
  const params = useParams();
  const picklistId = params.id || "PK1000";
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"pending" | "scanned">("pending");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>("Section A");
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const { isBarcodeMode } = useBarcodeMode(); 

  // Sample shelf data
  const pendingShelves: ShelfItem[] = [
    { id: "1", shelfCode: "SHELF_001", skuCount: 5, pendingQty: 120 },
    { id: "2", shelfCode: "SHELF_002", skuCount: 3, pendingQty: 80 },
    { id: "3", shelfCode: "SHELF_003", skuCount: 3, pendingQty: 50 },
    { id: "4", shelfCode: "SHELF_004", skuCount: 3, pendingQty: 50 },
  ];

  const scannedShelves: ShelfItem[] = [];

  // Sample sections data
  const sections: Section[] = [
    { id: "a", name: "Section A", count: 50 },
    { id: "b", name: "Section B", count: 200 },
    { id: "c", name: "Section C", count: 35 },
    { id: "d", name: "Section D", count: 13 },
  ];

  // Sort shelves based on sort order
  const sortedShelves = [
    ...(activeTab === "pending" ? pendingShelves : scannedShelves),
  ].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.shelfCode.localeCompare(b.shelfCode);
    } else {
      return b.shelfCode.localeCompare(a.shelfCode);
    }
  });

  const handleBack = () => {
    setLocation("/b2b-packing");
  };

  const handleStartPicking = () => {
    console.log("Start picking clicked");
    if(isBarcodeMode)setLocation(`/tote-scanner/${picklistId}`);
    else{
      setLocation(`/shelf-selection/${picklistId}`);
    }
  };

  const handleMoreOptions = () => {
    console.log("More option  s clicked");
  };

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleSectionClick = () => {
    setIsSectionDialogOpen(true);
  };

  const handleSectionSelect = (sectionName: string) => {
    setSelectedSection(sectionName);
    setIsSectionDialogOpen(false);
  };

  const handleMenuClick = () => {
    setIsSideNavOpen(true);
  };

  const handleCloseSideNav = () => {
    setIsSideNavOpen(false);
  };

  return (
    <div className="bg-white min-h-screen w-full">
      <SideNavigation isOpen={isSideNavOpen} onClose={handleCloseSideNav} />
      <div className="bg-white w-full max-w-md mx-auto min-h-screen relative">
        {/* Header */}
        <header className="flex h-12 items-center justify-between w-full bg-white border-b border-[#e0e0e0] px-4">
          <div className="flex items-center gap-3">
            <button
              className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded transition-colors duration-200"
              onClick={handleMenuClick}
            >
              <MenuIcon className="h-5 w-5 text-text-elementsprimary" />
            </button>
            <button
              className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded transition-colors duration-200"
              onClick={handleBack}
            >
              <ArrowLeft className="h-5 w-5 text-text-elementsprimary" />
            </button>
            <h1 className="font-PAGE-TITLE font-[number:var(--PAGE-TITLE-font-weight)] text-text-elementsprimary text-[length:var(--PAGE-TITLE-font-size)] tracking-[var(--PAGE-TITLE-letter-spacing)] leading-[var(--PAGE-TITLE-line-height)] [font-style:var(--PAGE-TITLE-font-style)]">
              {picklistId}
            </h1>
          </div>

          <button
            className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded transition-colors duration-200"
            onClick={handleMoreOptions}
          >
            <MoreVertical className="h-5 w-5 text-text-elementsprimary" />
          </button>
        </header>

        {/* Content */}
        <div className="flex flex-col pt-4 px-4 pb-20">
          {/* Tabs */}
          <div className="flex mb-6">
            <button
              className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "pending"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("pending")}
            >
              Pending Shelf ({pendingShelves.length})
            </button>
            <button
              className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "scanned"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("scanned")}
            >
              Scanned Shelf ({scannedShelves.length})
            </button>
          </div>

          {/* Section Header */}
          <div className="flex items-center justify-between mb-4 px-2">
            <button
              onClick={handleSectionClick}
              className="text-sm font-medium text-gray-600 uppercase hover:text-gray-800 transition-colors"
            >
              SECTION
            </button>
            <button
              onClick={handleSortToggle}
              className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
            >
              <span className="text-sm text-gray-500">Shelf Code</span>
              <span className="text-sm text-gray-400">
                {sortOrder === "asc" ? "A-Z" : "Z-A"}
              </span>
            </button>
          </div>

          {/* Shelf List */}
          <div className="flex flex-col gap-3">
            {activeTab === "pending" ? (
              sortedShelves.map((shelf) => (
                <Card
                  key={shelf.id}
                  className="border border-gray-200 rounded-lg shadow-sm"
                >
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {shelf.shelfCode}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">SKU Count</span>
                        <span className="text-lg font-medium text-gray-900">
                          {shelf.skuCount}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-gray-500">
                          Pending Qty
                        </span>
                        <span className="text-lg font-medium text-gray-900">
                          {shelf.pendingQty}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <p className="text-sm">No scanned shelves yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Bottom Button */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[412px] bg-white border-t border-gray-200 p-4">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors duration-200"
            onClick={handleStartPicking}
          >
            START PICKING
          </Button>
        </div>

        {/* Section Selection Bottom Sheet */}
        <Dialog
          open={isSectionDialogOpen}
          onOpenChange={setIsSectionDialogOpen}
        >
          <DialogContent className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[412px] max-w-[90vw] rounded-t-2xl border-0 p-0 m-0 translate-y-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom bg-white shadow-xl [&>button]:hidden">
            <DialogHeader className="sr-only">
              <DialogTitle>Select Section</DialogTitle>
              <DialogDescription>
                Choose a section from the list
              </DialogDescription>
            </DialogHeader>

            {/* Header with Cancel/Confirm */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-700 font-medium p-0 h-auto"
                >
                  CANCEL
                </Button>
              </DialogClose>
              <Button
                variant="ghost"
                className="text-blue-600 hover:text-blue-700 font-medium p-0 h-auto"
                onClick={() => setIsSectionDialogOpen(false)}
              >
                CONFIRM
              </Button>
            </div>

            {/* Section List */}
            <div className="flex flex-col py-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  className={`text-center py-4 text-lg transition-colors border-b border-gray-100 last:border-b-0 ${
                    selectedSection === section.name
                      ? "text-blue-600 font-medium bg-blue-50"
                      : "text-gray-800 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                  onClick={() => handleSectionSelect(section.name)}
                >
                  {section.name} ({section.count})
                </button>
              ))}
            </div>

            {/* Bottom safe area for mobile */}
            <div className="h-6 bg-white"></div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
function isBarcodeMode(): { isBarcodeMode: any; } {
    throw new Error("Function not implemented.");
}

