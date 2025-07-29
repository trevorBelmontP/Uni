import { MenuIcon } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SideNavigation } from "@/components/SideNavigation";
import { useLocation } from "wouter";

export const PickingLandingPage = (): JSX.Element => {
  // State for sidebar navigation
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [, setLocation] = useLocation();

  const handleMenuClick = () => {
    setIsSideNavOpen(true);
  };

  const handleCloseSideNav = () => {
    setIsSideNavOpen(false);
  };

  const handleB2BPackingClick = () => {
    setLocation("/b2b-packing");
  };

  const pickingOptions = [
    {
      title: "B2B PACKING",
      isDisabled: false,
      comingSoon: false,
      className:
        "bg-white-100 border border-solid border-[#e0e0e0] shadow-[0px_4px_4px_#0000001a] cursor-pointer hover:bg-gray-50 transition-colors duration-200",
      onClick: handleB2BPackingClick,
    },
    {
      title: "PICKLISTS",
      isDisabled: true,
      comingSoon: true,
      className: "bg-greyseeeeee cursor-not-allowed",
      onClick: () => {},
    },
  ];

  return (
    <div className="bg-white min-h-screen w-full">
      <SideNavigation isOpen={isSideNavOpen} onClose={handleCloseSideNav} />
      <div className="bg-white-100 w-full max-w-md mx-auto min-h-screen relative">
        {/* Header */}
        <header className="flex flex-col w-full items-start gap-4 sticky top-0 bg-transparent z-10">
          <div className="flex h-12 items-center relative self-stretch w-full bg-white-100 border-b [border-bottom-style:solid] border-[#e0e0e0]">
            <button
              className="relative w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
              onClick={handleMenuClick}
            >
              <MenuIcon className="h-6 w-6 text-text-elementsprimary" />
            </button>

            <div className="flex items-center gap-8 relative flex-1 grow">
              <h1 className="relative w-fit mt-[-1.00px] font-PAGE-TITLE font-[number:var(--PAGE-TITLE-font-weight)] text-text-elementsprimary text-[length:var(--PAGE-TITLE-font-size)] tracking-[var(--PAGE-TITLE-letter-spacing)] leading-[var(--PAGE-TITLE-line-height)] whitespace-nowrap [font-style:var(--PAGE-TITLE-font-style)]">
                PICKING
              </h1>
            </div>
          </div>
        </header>

        {/* Picking options */}
        <div className="flex flex-col w-full items-start gap-8 px-8 py-4 mt-64">
          {pickingOptions.map((option, index) => (
            <Card
              key={index}
              className={`flex flex-col h-[120px] items-center justify-center gap-4 px-0 py-4 relative self-stretch w-full rounded-lg ${option.className}`}
              onClick={option.onClick}
            >
              <CardContent className="p-0 flex flex-col items-center justify-center gap-4">
                <div
                  className={`relative w-fit font-medium ${option.isDisabled ? "text-greysa-7a-7a-7" : "text-text-elementsprimary"} text-xl tracking-[0] leading-[30px] whitespace-nowrap font-['Roboto',Helvetica]`}
                >
                  {option.title}
                </div>

                {option.comingSoon && (
                  <Badge className="h-4 items-center justify-center gap-2 p-2 bg-coloursprimaryblue rounded-sm">
                    <span className="mt-[-8.00px] mb-[-6.00px] font-medium text-white-100 text-xs tracking-[0] leading-[14px] whitespace-nowrap font-['Roboto',Helvetica]">
                      COMING SOON!
                    </span>
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
