import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { PickingLandingPage } from "@/pages/PickingLandingPage";
import { B2BPackingPage } from "@/pages/B2BPackingPage";
import { PicklistDetailPage } from "@/pages/PicklistDetailPage";
import { ToteScannerPage } from "@/pages/ToteScannerPage";
import { ShelfDetailPage } from "@/pages/ShelfDetailPage";
import { SKUScannerPage } from "@/pages/SKUScannerPage";

function Router() {
  return (
    <Switch>
      {/* Add pages below */}
      <Route path="/" component={PickingLandingPage} />
      <Route path="/b2b-packing" component={B2BPackingPage} />
      <Route path="/picklist/:id" component={PicklistDetailPage} />
      <Route path="/tote-scanner/:id" component={ToteScannerPage} />
      <Route path="/shelf-detail/:id" component={ShelfDetailPage} />
      <Route path="/sku-scanner/:toteId" component={SKUScannerPage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
