import React, { useState, useMemo } from "react";
import { MenuIcon, Filter, ArrowUpDown, X, ChevronDown, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { SideNavigation } from "@/components/SideNavigation";

interface PicklistItem {
  id: string;
  picklistCode: string;
  pendingQuantity: number;
  pendingSection: number;
  channel: string;
  customer: string;
  sku: string;
  fulfillmentTAT: string;
  order: string;
  paymentMethod: string;
}

interface FilterState {
  sku: string;
  fulfillmentTAT: string;
  order: string;
  paymentMethod: string;
  quantity: string;
  customers: string;
  channel: string;
}

export const B2BPackingPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [assignToMe, setAssignToMe] = useState(false);
  const [picklistCode, setPicklistCode] = useState("");
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<FilterState>({
    sku: "",
    fulfillmentTAT: "",
    order: "",
    paymentMethod: "",
    quantity: "",
    customers: "",
    channel: ""
  });

  // Sample picklist data
  const allPicklistItems: PicklistItem[] = [
    { id: "1", picklistCode: "PL001-WH", pendingQuantity: 25, pendingSection: 5, channel: "Online", customer: "TechCorp Ltd", sku: "SK001", fulfillmentTAT: "18/02/2023 - 18/02/2023", order: "ORD001", paymentMethod: "Credit Card" },
    { id: "2", picklistCode: "PL002-USB", pendingQuantity: 50, pendingSection: 12, channel: "Retail", customer: "ElectroMax", sku: "SK002", fulfillmentTAT: "19/02/2023 - 19/02/2023", order: "ORD002", paymentMethod: "Cash" },
    { id: "3", picklistCode: "PL003-LS", pendingQuantity: 15, pendingSection: 3, channel: "Online", customer: "OfficeSupply Co", sku: "SK003", fulfillmentTAT: "20/02/2023 - 20/02/2023", order: "ORD003", paymentMethod: "Debit Card" },
    { id: "4", picklistCode: "PL004-BM", pendingQuantity: 30, pendingSection: 8, channel: "B2B", customer: "Corporate Solutions", sku: "SK004", fulfillmentTAT: "21/02/2023 - 21/02/2023", order: "ORD004", paymentMethod: "Bank Transfer" },
    { id: "5", picklistCode: "PL005-PC", pendingQuantity: 40, pendingSection: 15, channel: "Retail", customer: "Mobile World", sku: "SK005", fulfillmentTAT: "22/02/2023 - 22/02/2023", order: "ORD005", paymentMethod: "Credit Card" },
    { id: "6", picklistCode: "AL001-TEST", pendingQuantity: 35, pendingSection: 7, channel: "Online", customer: "Alpha Corp", sku: "SK006", fulfillmentTAT: "23/02/2023 - 23/02/2023", order: "ORD006", paymentMethod: "PayPal" },
  ];

  const handleMenuClick = () => {
    setIsSideNavOpen(true);
  };

  const handleCloseSideNav = () => {
    setIsSideNavOpen(false);
  };

  const handleBack = () => {
    setLocation("/");
  };

  const handleFilter = () => {
    setIsFilterModalOpen(true);
  };

  const handleSort = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  const handleApplyFilters = () => {
    setIsFilterModalOpen(false);
  };

  const handleClearAllFilters = () => {
    setFilters({
      sku: "",
      fulfillmentTAT: "",
      order: "",
      paymentMethod: "",
      quantity: "",
      customers: "",
      channel: ""
    });
  };

  // Filter and sort logic
  const filteredAndSortedItems = useMemo(() => {
    let filtered = allPicklistItems;

    // Filter by picklist code search
    if (picklistCode.trim()) {
      filtered = filtered.filter(item => 
        item.picklistCode.toLowerCase().includes(picklistCode.toLowerCase())
      );
    }

    // Apply filters
    if (filters.sku) {
      filtered = filtered.filter(item => 
        item.sku.toLowerCase().includes(filters.sku.toLowerCase())
      );
    }
    if (filters.channel) {
      filtered = filtered.filter(item => 
        item.channel.toLowerCase().includes(filters.channel.toLowerCase())
      );
    }
    if (filters.customers) {
      filtered = filtered.filter(item => 
        item.customer.toLowerCase().includes(filters.customers.toLowerCase())
      );
    }
    if (filters.paymentMethod) {
      filtered = filtered.filter(item => 
        item.paymentMethod.toLowerCase().includes(filters.paymentMethod.toLowerCase())
      );
    }
    if (filters.order) {
      filtered = filtered.filter(item => 
        item.order.toLowerCase().includes(filters.order.toLowerCase())
      );
    }

    // Sort items
    return filtered.sort((a, b) => {
      const comparison = a.picklistCode.localeCompare(b.picklistCode);
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [allPicklistItems, picklistCode, filters, sortOrder]);

  return (
    <div className="bg-white min-h-screen w-full">
      <SideNavigation isOpen={isSideNavOpen} onClose={handleCloseSideNav} />
      <div className="bg-white-100 w-full max-w-md mx-auto min-h-screen relative">
        {/* Header - Same as landing page */}
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
                PICKLISTS
              </h1>
            </div>

            {/* Assign to Me Button in Navbar */}
            <div className="flex items-center gap-2 pr-4">
              <span className="text-xs text-text-elementsprimary">Assign to me</span>
              <Switch
                checked={assignToMe}
                onCheckedChange={setAssignToMe}
                className="scale-75"
              />
            </div>
          </div>
        </header>

        {/* Filter Section - Below Navbar */}
        <div className="absolute top-12 left-0 right-0 p-4 bg-white-100 border-b border-greysbordere-0e-0e-0">
          <div className="flex items-center gap-3">
            {/* Filter Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleFilter}
              className="flex items-center gap-1 border-greysbordere-0e-0e-0"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>

            {/* Picklist Code Input */}
            <div className="flex-1">
              <Input
                placeholder="Picklist Code"
                value={picklistCode}
                onChange={(e) => setPicklistCode(e.target.value)}
                className="h-8 text-sm"
              />
            </div>

            {/* A-Z Sort Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSort}
              className="flex items-center gap-1 border-greysbordere-0e-0e-0"
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortOrder === "asc" ? "A-Z" : "Z-A"}
            </Button>
          </div>
        </div>

        {/* Picklist Items Grid */}
        <div className="absolute top-[120px] left-0 right-0 bottom-0 overflow-y-auto">
          <div className="p-4">
            <div className="grid grid-cols-1 gap-4">
              {filteredAndSortedItems.map((item) => (
                <Card 
                  key={item.id} 
                  className="border border-greysbordere-0e-0e-0 cursor-pointer hover:shadow-md transition-shadow duration-200"
                  onClick={() => setLocation(`/picklist/${item.picklistCode}`)}
                >
                  <CardContent className="p-4">
                    {/* Title Section */}
                    <div className="mb-3">
                      <h3 className="font-medium text-text-elementsprimary font-['Roboto',Helvetica] text-left">
                        {item.picklistCode}
                      </h3>
                    </div>
                    
                    {/* 2x2 Content Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {/* Top Left - Pending Quantity */}
                      <div className="flex flex-col">
                        <span className="text-text-elementssecondary opacity-80">Pending Quantity</span>
                        <span className="text-text-elementsprimary font-medium">{item.pendingQuantity}</span>
                      </div>
                      
                      {/* Top Right - Channel */}
                      <div className="flex flex-col">
                        <span className="text-text-elementssecondary opacity-80">Channel</span>
                        <span className="text-text-elementsprimary font-medium">{item.channel}</span>
                      </div>
                      
                      {/* Bottom Left - Pending Section */}
                      <div className="flex flex-col">
                        <span className="text-text-elementssecondary opacity-80">Pending Section</span>
                        <span className="text-text-elementsprimary font-medium">{item.pendingSection}</span>
                      </div>
                      
                      {/* Bottom Right - Customer */}
                      <div className="flex flex-col">
                        <span className="text-text-elementssecondary opacity-80">Customer</span>
                        <span className="text-text-elementsprimary font-light">{item.customer}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Modal */}
        {isFilterModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">FILTERS</h2>
                <button 
                  onClick={() => setIsFilterModalOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Filter Form */}
              <div className="p-4 space-y-6">
                {/* SKU */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">SKU</label>
                  <Select value={filters.sku} onValueChange={(value) => setFilters(prev => ({...prev, sku: value}))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="SK001, SK002, SK003" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SK001">SK001</SelectItem>
                      <SelectItem value="SK002">SK002</SelectItem>
                      <SelectItem value="SK003">SK003</SelectItem>
                      <SelectItem value="SK004">SK004</SelectItem>
                      <SelectItem value="SK005">SK005</SelectItem>
                      <SelectItem value="SK006">SK006</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Fulfilment TAT */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Fulfilment TAT</label>
                  <div className="relative">
                    <Input
                      value={filters.fulfillmentTAT}
                      onChange={(e) => setFilters(prev => ({...prev, fulfillmentTAT: e.target.value}))}
                      placeholder="18/02/2023 - 18/02/2023"
                      className="pr-10"
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                {/* Order */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Order</label>
                  <Select value={filters.order} onValueChange={(value) => setFilters(prev => ({...prev, order: value}))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Hint text" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ORD001">ORD001</SelectItem>
                      <SelectItem value="ORD002">ORD002</SelectItem>
                      <SelectItem value="ORD003">ORD003</SelectItem>
                      <SelectItem value="ORD004">ORD004</SelectItem>
                      <SelectItem value="ORD005">ORD005</SelectItem>
                      <SelectItem value="ORD006">ORD006</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Payment Method</label>
                  <Select value={filters.paymentMethod} onValueChange={(value) => setFilters(prev => ({...prev, paymentMethod: value}))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Hint text" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Debit Card">Debit Card</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="PayPal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Quantity</label>
                  <Select value={filters.quantity} onValueChange={(value) => setFilters(prev => ({...prev, quantity: value}))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Hint text" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-25">0-25</SelectItem>
                      <SelectItem value="26-50">26-50</SelectItem>
                      <SelectItem value="51-100">51-100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Customers */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Customers</label>
                  <Select value={filters.customers} onValueChange={(value) => setFilters(prev => ({...prev, customers: value}))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Hint Text" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TechCorp Ltd">TechCorp Ltd</SelectItem>
                      <SelectItem value="ElectroMax">ElectroMax</SelectItem>
                      <SelectItem value="OfficeSupply Co">OfficeSupply Co</SelectItem>
                      <SelectItem value="Corporate Solutions">Corporate Solutions</SelectItem>
                      <SelectItem value="Mobile World">Mobile World</SelectItem>
                      <SelectItem value="Alpha Corp">Alpha Corp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Channel */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Channel</label>
                  <Select value={filters.channel} onValueChange={(value) => setFilters(prev => ({...prev, channel: value}))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Hint Text" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="B2B">B2B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-between items-center p-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  onClick={handleClearAllFilters}
                  className="text-gray-600 hover:text-gray-800"
                >
                  CLEAR ALL
                </Button>
                <Button
                  onClick={handleApplyFilters}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6"
                >
                  APPLY
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};