/**
 * SideNavigation Component
 * 
 * Purpose: Provides the main navigation menu for the application
 * - Hamburger menu on mobile devices
 * - Expanded sidebar on desktop screens  
 * - Navigation links to all major sections
 * 
 * Features:
 * - Responsive design (collapses on mobile, expands on desktop)
 * - Smooth slide-in/out animations
 * - Professional dark header with user info
 * - Clear navigation hierarchy
 * 
 * Props:
 * - isOpen: Controls whether sidebar is visible
 * - onClose: Called when user wants to close sidebar
 */

import React from "react";
import { X, Package, Truck, ChevronDown, List, BarChart3 } from "lucide-react"; // Icons for navigation and actions
import { useLocation } from "wouter"; // For programmatic navigation
import { Switch } from '@/components/ui/switch';
import { useBarcodeMode } from '@/contexts/BarcodeModeContext';

interface SideNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideNavigation: React.FC<SideNavigationProps> = ({
  isOpen,
  onClose,
}) => {
  const [, navigate] = useLocation();
  const { isBarcodeMode, setIsBarcodeMode } = useBarcodeMode();
  
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
        }
        
        /* Responsive styles for all screen sizes */
        sm:w-96 sm:max-w-[85vw]
        md:w-80 md:max-w-[75vw]
        lg:static lg:translate-x-0 lg:w-64 lg:shadow-none lg:border-r lg:border-gray-200
        xl:w-72
        2xl:w-80
        `}
      >
        {/* Dark Header with user info */}
        <div className="bg-gray-800 px-4 py-4 sm:px-6 sm:py-5 lg:px-4 lg:py-4">
          {/* Top row with logo placeholder and close button */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Logo placeholder - keeping blank as requested */}
              <div className="w-8 h-8 bg-transparent sm:w-10 sm:h-10 lg:w-8 lg:h-8"></div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-white hover:bg-gray-700 rounded transition-colors sm:w-10 sm:h-10 lg:w-8 lg:h-8 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* User info row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center sm:w-8 sm:h-8 lg:w-6 lg:h-6">
                <div className="w-4 h-4 rounded-full bg-gray-400 sm:w-5 sm:h-5 lg:w-4 lg:h-4"></div>
              </div>
              <span className="text-white text-sm sm:text-base lg:text-sm truncate">johnwick@unicommerce.com</span>
            </div>
            <ChevronDown className="w-4 h-4 text-white sm:w-5 sm:h-5 lg:w-4 lg:h-4 flex-shrink-0" />
          </div>
        </div>

        {/* Barcode Mode Toggle */}
        <div className="bg-white px-6 py-4 border-b border-gray-200 sm:px-8 sm:py-5 lg:px-6 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-gray-600 sm:w-6 sm:h-6 lg:w-5 lg:h-5" />
              <span className="text-gray-700 font-medium sm:text-lg lg:text-base">Barcode Mode</span>
            </div>
            <Switch
              checked={isBarcodeMode}
              onCheckedChange={setIsBarcodeMode}
              className="sm:scale-110 lg:scale-100"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 sm:text-sm lg:text-xs">
            {isBarcodeMode ? "Camera scanning enabled" : "Input box mode enabled"}
          </p>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 bg-gray-50">
          {navigationItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-100 transition-colors sm:px-8 sm:py-5 lg:px-6 lg:py-4 ${
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
                <div className="w-5 h-5 flex items-center justify-center sm:w-6 sm:h-6 lg:w-5 lg:h-5">
                  {item.label === "Picking" && <Package className="w-4 h-4 text-gray-600 sm:w-5 sm:h-5 lg:w-4 lg:h-4" />}
                  {item.label === "Picklists" && <List className="w-4 h-4 text-gray-600 sm:w-5 sm:h-5 lg:w-4 lg:h-4" />}
                  {item.label === "Cycle Count" && <Truck className="w-4 h-4 text-gray-600 sm:w-5 sm:h-5 lg:w-4 lg:h-4" />}
                </div>
                <span className="text-gray-800 font-medium sm:text-lg lg:text-base">
                  {item.label}
                </span>
              </div>
              
              {item.isComingSoon && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium sm:text-sm sm:px-3 sm:py-1.5 lg:text-xs lg:px-2 lg:py-1 flex-shrink-0">
                  COMING SOON!
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-800 px-4 py-3 sm:px-6 sm:py-4 lg:px-4 lg:py-3">
          <div className="flex items-center gap-3 text-white">
            <div className="w-5 h-5 flex items-center justify-center sm:w-6 sm:h-6 lg:w-5 lg:h-5">
              <div className="w-4 h-4 bg-gray-600 rounded sm:w-5 sm:h-5 lg:w-4 lg:h-4"></div>
            </div>
            <span className="text-sm sm:text-base lg:text-sm truncate">Facility_name</span>
            <ChevronDown className="w-4 h-4 ml-auto sm:w-5 sm:h-5 lg:w-4 lg:h-4 flex-shrink-0" />
          </div>
        </div>
      </div>
    </>
  );
};