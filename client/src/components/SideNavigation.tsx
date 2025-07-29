import React from "react";
import { X, Package, Truck, ChevronDown, List } from "lucide-react";
import { useLocation } from "wouter";

interface SideNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideNavigation: React.FC<SideNavigationProps> = ({
  isOpen,
  onClose,
}) => {
  const [, navigate] = useLocation();
  
  // Navigation menu items matching the design
  const navigationItems = [
    { label: "Picking", href: "/", isActive: false },
    { label: "Picklists", href: "/b2b-packing", isActive: true },
    { label: "Cycle Count", href: "/cycle-count", isComingSoon: true },
  ];

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[90vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Dark Header with user info */}
        <div className="bg-gray-800 px-4 py-4">
          {/* Top row with logo placeholder and close button */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Logo placeholder - keeping blank as requested */}
              <div className="w-8 h-8 bg-transparent"></div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-white hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* User info row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-gray-400"></div>
              </div>
              <span className="text-white text-sm">johnwick@unicommerce.com</span>
            </div>
            <ChevronDown className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 bg-gray-50">
          {navigationItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-100 transition-colors ${
                item.isActive ? 'bg-white border-l-4 border-l-blue-500' : ''
              }`}
              onClick={() => {
                if (!item.isComingSoon) {
                  navigate(item.href);
                }
                onClose();
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  {item.label === "Picking" && <Package className="w-4 h-4 text-gray-600" />}
                  {item.label === "Picklists" && <List className="w-4 h-4 text-gray-600" />}
                  {item.label === "Cycle Count" && <Truck className="w-4 h-4 text-gray-600" />}
                </div>
                <span className="text-gray-800 font-medium">
                  {item.label}
                </span>
              </div>
              
              {item.isComingSoon && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  COMING SOON!
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-800 px-4 py-3">
          <div className="flex items-center gap-3 text-white">
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-4 h-4 bg-gray-600 rounded"></div>
            </div>
            <span className="text-sm">Facility_name</span>
            <ChevronDown className="w-4 h-4 ml-auto" />
          </div>
        </div>
      </div>
    </>
  );
};