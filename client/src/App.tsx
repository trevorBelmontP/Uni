// Main application entry point - sets up routing and global providers
import { useState } from "react"; // React state management
import { Switch, Route } from "wouter"; // Router for navigation between pages
import { queryClient } from "./lib/queryClient"; // Pre-configured query client for data fetching
import { QueryClientProvider } from "@tanstack/react-query"; // Provides data fetching capabilities to all components
import { Toaster } from "@/components/ui/toaster"; // Toast notifications for user feedback
import { TooltipProvider } from "@/components/ui/tooltip"; // Provides tooltip functionality
import NotFound from "@/pages/not-found"; // 404 error page

// Import all the different pages/screens of the application
import { PickingLandingPage } from "@/pages/PickingLandingPage"; // Welcome/home screen - entry point
import { B2BPackingPage } from "@/pages/B2BPackingPage"; // Main picking lists page - shows all available picking tasks
import { PicklistDetailPage } from "@/pages/PicklistDetailPage"; // Individual picking list details - shows specific list info
import { ToteScannerPage } from "@/pages/ToteScannerPage"; // Step 1: Scan tote/container barcode
import { ShelfDetailPage } from "@/pages/ShelfDetailPage"; // Step 2: Scan shelf location barcode  
import { SKUScannerPage } from "@/pages/SKUScannerPage"; // Step 3: Scan individual product barcodes
import { ShelfSelectionPage } from "@/pages/ShelfSelectionPage"; // Alternative: Shelf selection for input mode
import { SKUInputPage } from "@/pages/SKUInputPage"; // Alternative: SKU input for input mode
import { BarcodeModeProvider } from "@/contexts/BarcodeModeContext"; // Global state for barcode mode

// Router component - defines all the routes/pages in the application
function Router() {
  return (
    <Switch>
      {/* ROUTE DEFINITIONS - These define what page shows for each URL */}
      
      {/* Home/Welcome page - first page users see */}
      <Route path="/" component={PickingLandingPage} />
      
      {/* Main picking lists page - shows all available picking tasks */}
      <Route path="/b2b-packing" component={B2BPackingPage} />
      
      {/* Individual picking list details - :id is a parameter (like /picklist/123) */}
      <Route path="/picklist/:id" component={PicklistDetailPage} />
      
      {/* Step 1: Tote scanner - scan container/tote barcode */}
      <Route path="/tote-scanner/:id" component={ToteScannerPage} />
      
      {/* Step 2: Shelf detail - shows shelf info and allows shelf scanning */}
      <Route path="/shelf-detail/:id" component={ShelfDetailPage} />
      
      {/* Step 3: SKU scanner - scan individual product barcodes */}
      <Route path="/sku-scanner/:toteId" component={SKUScannerPage} />
      
      {/* Alternative routes for input mode (when barcode is OFF) */}
      <Route path="/shelf-selection/:id" component={ShelfSelectionPage} />
      <Route path="/sku-input/:id/:shelfCode" component={SKUInputPage} />
      
      {/* 404 Fallback - shows when user visits a page that doesn't exist */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Main App component - wraps everything with necessary providers and manages global state
function App() {
  return (
    // QueryClientProvider: Enables data fetching and caching throughout the app
    <QueryClientProvider client={queryClient}>
      {/* BarcodeModeProvider: Manages global barcode mode state */}
      <BarcodeModeProvider>
        {/* TooltipProvider: Enables tooltips on hover for better user experience */}
        <TooltipProvider>
          {/* Toaster: Shows popup notifications to users (success, error messages) */}
          <Toaster />
          {/* Router: Handles all page navigation and URL routing */}
          <Router />
        </TooltipProvider>
      </BarcodeModeProvider>
    </QueryClientProvider>
  );
}

export default App;
