import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, X, Trash2, Camera } from "lucide-react";
import { CameraCapture } from "@/components/CameraCapture";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  title: string;
  sku: string;
  image: string;
  totalQuantity: number;
  pickedQuantity: number;
  status: "GOOD" | "DAMAGED";
  vendor: string;
  mrp: number;
  mfgDate: string;
  isPicking?: boolean;
}

const initialProducts: Product[] = [
  {
    id: "1",
    title: "Nike Shoes-Red-Size10-Mens Revolution 6 Nn-Sports Shoes-Men Sneaker",
    sku: "SK238402-437493023012",
    image: "/api/placeholder/60/60",
    totalQuantity: 80,
    pickedQuantity: 0,
    status: "GOOD",
    vendor: "B02363940", 
    mrp: 10000,
    mfgDate: "12/03/23"
  },
  {
    id: "2", 
    title: "Nike Shoes-Blue-Size10-Mens Revolution 6 Nn-Sports Shoes-Men Sneaker",
    sku: "SK238402-437493023012",
    image: "/api/placeholder/60/60",
    totalQuantity: 50,
    pickedQuantity: 0,
    status: "GOOD",
    vendor: "B02363940",
    mrp: 10000,
    mfgDate: "12/03/23"
  },
  {
    id: "3",
    title: "Nike Shoes-Black-Size10-Mens Revolution 6 Nn-Sports Shoes-Men Sneaker", 
    sku: "SK238402-437493023012",
    image: "/api/placeholder/60/60",
    totalQuantity: 60,
    pickedQuantity: 0,
    status: "GOOD",
    vendor: "B02363940",
    mrp: 10000,
    mfgDate: "12/03/23"
  },
  {
    id: "4",
    title: "Nike Shoes-Yellow-Size10-Mens Revolution 6 Nn-Sports Shoes-Men Sneaker", 
    sku: "SK238402-437493023012",
    image: "/api/placeholder/60/60",
    totalQuantity: 20,
    pickedQuantity: 0,
    status: "GOOD",
    vendor: "B02363940",
    mrp: 10000,
    mfgDate: "12/03/23"
  }
];

export function SKUScannerPage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"pending" | "scanned">("pending");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [showBulkPickModal, setShowBulkPickModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showShelfEmptyAlert, setShowShelfEmptyAlert] = useState(false);
  const [bulkQuantity, setBulkQuantity] = useState(1);
  const [inventoryType, setInventoryType] = useState("Good");
  const [showCameraCapture, setShowCameraCapture] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);

  // Camera functionality
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStream(stream);
        setCameraError("");
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraError("Camera access denied. Please allow camera permissions.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const simulateBarcodeScanner = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Simulate successful scan - could integrate with real barcode scanning library
      console.log("Barcode scanned successfully");
    }, 1500);
  };

  const handleBack = () => {
    stopCamera();
    navigate("/shelf-detail/1");
  };

  const handleClose = () => {
    stopCamera();
    navigate("/b2b-packing");
  };

  const pendingProducts = products.filter(p => p.pickedQuantity < p.totalQuantity);
  const scannedProducts = products.filter(p => p.pickedQuantity > 0);
  const currentProducts = activeTab === "pending" ? pendingProducts : scannedProducts;

  const handleProductClick = (product: Product) => {
    if (activeTab === "pending" && product.pickedQuantity < product.totalQuantity && !product.isPicking) {
      // Pick one item directly when clicking the card
      setProducts(prev => prev.map(p => {
        if (p.id === product.id) {
          const newPickedQuantity = Math.min(p.pickedQuantity + 1, p.totalQuantity);
          return { ...p, pickedQuantity: newPickedQuantity };
        }
        return p;
      }));
      
      // Check if all items are now picked
      const updatedProducts = products.map(p => 
        p.id === product.id 
          ? { ...p, pickedQuantity: Math.min(p.pickedQuantity + 1, p.totalQuantity) }
          : p
      );
      const allPicked = updatedProducts.every(p => p.pickedQuantity === p.totalQuantity);
      if (allPicked) {
        setTimeout(() => setShowShelfEmptyAlert(true), 500);
      }
    } else if (activeTab === "scanned" && product.pickedQuantity > 0) {
      // Move item back to pending by reducing picked quantity by 1
      setProducts(prev => prev.map(p => {
        if (p.id === product.id) {
          const newPickedQuantity = Math.max(p.pickedQuantity - 1, 0);
          return { 
            ...p, 
            pickedQuantity: newPickedQuantity,
            isPicking: false
          };
        }
        return p;
      }));
    }
  };

  const handleQuantityAction = (product: Product) => {
    setSelectedProduct(product);
    setShowActionsModal(true);
  };

  const handlePickInBulk = () => {
    setShowActionsModal(false);
    setBulkQuantity(1);
    setInventoryType("Good");
    setShowBulkPickModal(true);
  };

  const handleMarkDamaged = () => {
    if (!selectedProduct) return;
    setProducts(prev => prev.map(p => 
      p.id === selectedProduct.id ? { ...p, status: "DAMAGED" as const, isPicking: false } : p
    ));
    setShowActionsModal(false);
  };

  const handleMarkNotFound = () => {
    if (!selectedProduct) return;
    setProducts(prev => prev.map(p => 
      p.id === selectedProduct.id ? { ...p, isPicking: false } : p
    ));
    setShowActionsModal(false);
  };

  const handleShortPick = () => {
    if (!selectedProduct) return;
    setProducts(prev => prev.map(p => 
      p.id === selectedProduct.id ? { ...p, isPicking: false } : p
    ));
    setShowActionsModal(false);
  };

  const handleCameraCapture = (imageData: string) => {
    console.log("SKU photo captured");
    setCapturedImages(prev => [...prev, imageData]);
    setShowCameraCapture(false);
  };

  const handleDeleteImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddImage = () => {
    setShowCameraCapture(true);
  };

  const handleClickCapture = () => {
    setShowCameraCapture(true);
  };



  const handleBulkPickSubmit = () => {
    if (!selectedProduct) return;
    
    setProducts(prev => prev.map(p => {
      if (p.id === selectedProduct.id) {
        const newPickedQuantity = Math.min(p.pickedQuantity + bulkQuantity, p.totalQuantity);
        return { 
          ...p, 
          pickedQuantity: newPickedQuantity,
          isPicking: false
        };
      }
      return p;
    }));
    
    setShowBulkPickModal(false);
    
    // Check if all items are now picked
    const updatedProducts = products.map(p => 
      p.id === selectedProduct.id 
        ? { ...p, pickedQuantity: Math.min(p.pickedQuantity + bulkQuantity, p.totalQuantity) }
        : p
    );
    const allPicked = updatedProducts.every(p => p.pickedQuantity === p.totalQuantity);
    if (allPicked) {
      setTimeout(() => setShowShelfEmptyAlert(true), 500);
    }
  };

  const handleShelfEmptyConfirm = () => {
    setShowShelfEmptyAlert(false);
    navigate("/shelf-detail/1");
  };

  const checkIfShelfEmpty = () => {
    setTimeout(() => {
      const allPicked = products.every(p => p.pickedQuantity >= p.totalQuantity);
      if (allPicked) {
        setShowShelfEmptyAlert(true);
        setTimeout(() => {
          setShowShelfEmptyAlert(false);
          navigate("/shelf-detail/1");
        }, 2000);
      }
    }, 100);
  };

  const getShoeColor = (title: string) => {
    if (title.includes('Red')) return { start: '#dc2626', end: '#b91c1c', bg: '#fef2f2', accent: '#dc2626' };
    if (title.includes('Blue')) return { start: '#2563eb', end: '#1d4ed8', bg: '#eff6ff', accent: '#2563eb' };
    if (title.includes('Yellow')) return { start: '#eab308', end: '#ca8a04', bg: '#fefce8', accent: '#eab308' };
    return { start: '#1f2937', end: '#111827', bg: '#f9fafb', accent: '#1f2937' };
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const pendingQty = product.totalQuantity - product.pickedQuantity;
    const colors = getShoeColor(product.title);
    
    return (
      <div 
        className={`bg-white rounded-lg border p-4 transition-all ${
          product.isPicking 
            ? 'border-green-500 border-2 bg-green-50' 
            : activeTab === 'pending' && pendingQty > 0
            ? 'border-gray-200 hover:border-gray-300 cursor-pointer'
            : activeTab === 'scanned' && product.pickedQuantity > 0
            ? 'border-gray-200 hover:border-gray-300 cursor-pointer'
            : 'border-gray-200'
        }`}
        onClick={() => handleProductClick(product)}
      >
        {/* Status Badge and Quantity Button */}
        <div className="flex justify-between items-start mb-2">
          {product.isPicking && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
              • PICKING
            </span>
          )}
          <div className="flex-1"></div>
          {/* Always show quantity button for pending items */}
          {activeTab === 'pending' && pendingQty > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQuantityAction(product);
              }}
              className="bg-blue-500 text-white px-2 py-1 rounded text-sm font-medium hover:bg-blue-600"
            >
              {pendingQty}
            </button>
          )}
        </div>

        <div className="mb-2">
          <h3 className="text-sm font-medium text-gray-900 leading-tight mb-1">
            {product.title}
          </h3>
          <p className="text-xs text-gray-600">{product.sku}</p>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
            <img 
              src={`data:image/svg+xml;base64,${btoa(`
                <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="shoeGrad${product.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:${colors.start};stop-opacity:1" />
                      <stop offset="100%" style="stop-color:${colors.end};stop-opacity:1" />
                    </linearGradient>
                  </defs>
                  <rect width="64" height="64" fill="#f8fafc"/>
                  <ellipse cx="32" cy="50" rx="28" ry="8" fill="#e2e8f0"/>
                  <path d="M8 40 Q8 35 12 32 Q16 28 24 26 Q32 24 40 26 Q48 28 52 32 Q56 35 56 40 L54 42 Q52 44 48 45 Q44 46 40 46 L24 46 Q20 46 16 45 Q12 44 10 42 Z" fill="url(#shoeGrad${product.id})"/>
                  <path d="M12 38 Q16 34 24 32 Q32 30 40 32 Q48 34 52 38" stroke="white" stroke-width="1" fill="none" opacity="0.3"/>
                  <circle cx="20" cy="38" r="1.5" fill="white" opacity="0.6"/>
                  <text x="32" y="18" text-anchor="middle" fill="#64748b" font-size="6" font-family="Arial, sans-serif" font-weight="bold">NIKE</text>
                </svg>
              `)}`}
              alt="Product"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div>
              <span className="text-gray-500">Qty </span>
              <span className="font-medium">
                {activeTab === 'pending' ? pendingQty : product.pickedQuantity}
              </span>
              {activeTab === 'scanned' && (
                <span className="text-xs text-blue-600 ml-1">(click to unpick)</span>
              )}
            </div>
            <div className="text-right">
              <span className="text-gray-500">Vendor </span>
              <span className="font-medium">{product.vendor}</span>
            </div>
            
            <div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                product.status === 'GOOD' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {product.status}
              </span>
            </div>
            <div className="text-right">
              <span className="text-gray-500">MRP </span>
              <span className="font-medium">₹{product.mrp.toLocaleString()}</span>
            </div>
            
            <div className="col-span-2">
              <span className="text-gray-500">Mfg </span>
              <span className="font-medium">{product.mfgDate}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">TOTE_01</h1>
        </div>
        <button 
          onClick={handleClose}
          className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded"
        >
          CLOSE
        </button>
      </div>

      {/* Scanner Section */}
      <div className="bg-black text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Scan SKU Code</h2>
          <Trash2 className="w-5 h-5 text-gray-400" />
        </div>

        {/* Captured Images */}
        {capturedImages.length > 0 && (
          <div className="mb-4">
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-white">Captured Images ({capturedImages.length})</h3>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {capturedImages.map((image, index) => (
                  <div key={index} className="relative flex-shrink-0">
                    <img 
                      src={image} 
                      alt={`Captured ${index + 1}`}
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <button
                      onClick={() => handleDeleteImage(index)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          <Button
            onClick={() => handleDeleteImage(capturedImages.length - 1)}
            disabled={capturedImages.length === 0}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
            size="sm"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
          <Button
            onClick={handleAddImage}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            size="sm"
          >
            <Camera className="w-4 h-4 mr-1" />
            Add
          </Button>
          <Button
            onClick={handleClickCapture}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            size="sm"
          >
            <Camera className="w-4 h-4 mr-1" />
            Click
          </Button>
        </div>
        
        {/* Live Camera Scanner */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <div className="relative rounded-lg overflow-hidden">
            {cameraError ? (
              <div className="bg-gray-700 h-32 flex items-center justify-center rounded-lg">
                <p className="text-white text-sm text-center px-4">{cameraError}</p>
              </div>
            ) : (
              <div className="relative h-32 bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Scanning Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-64 h-20 border-2 border-white border-opacity-60 rounded-lg">
                    {/* Corner brackets */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-white"></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-white"></div>
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-white"></div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-white"></div>
                    
                    {/* Scanning line */}
                    {isScanning && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-red-500 animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Scan Button */}
                <button
                  onClick={simulateBarcodeScanner}
                  disabled={isScanning}
                  className="absolute bottom-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all disabled:opacity-50"
                >
                  <div className="w-6 h-6 border-2 border-gray-800 rounded flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-800 rounded"></div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === "pending"
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent"
            }`}
          >
            Pending ({pendingProducts.length})
          </button>
          <button
            onClick={() => setActiveTab("scanned")}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === "scanned"
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent"
            }`}
          >
            Scanned ({scannedProducts.length})
          </button>
        </div>
      </div>

      {/* Product List */}
      <div className="p-4 pb-20">
        {currentProducts.length > 0 ? (
          <div className="space-y-3">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {activeTab === "pending" ? "No pending items" : "No scanned items yet"}
            </p>
          </div>
        )}
      </div>

      {/* Actions Modal */}
      {showActionsModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-lg animate-slide-up">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">ACTIONS</h3>
              <button 
                onClick={() => setShowActionsModal(false)}
                className="p-1"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="p-0">
              <button
                onClick={handlePickInBulk}
                className="w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100"
              >
                Pick in Bulk
              </button>
              <button
                onClick={handleMarkDamaged}
                className="w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100"
              >
                Mark Damaged
              </button>
              <button
                onClick={handleMarkNotFound}
                className="w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100"
              >
                Mark Not Found
              </button>
              <button
                onClick={handleShortPick}
                className="w-full p-4 text-left hover:bg-gray-50"
              >
                Short Pick
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Pick Modal */}
      {showBulkPickModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">PICK IN BULK</h3>
              <button 
                onClick={() => setShowBulkPickModal(false)}
                className="p-1"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="p-4">
              {/* Product Info */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-1">{selectedProduct.title}</h4>
                <p className="text-sm text-gray-600">{selectedProduct.sku}</p>
              </div>

              {/* Product Image */}
              <div className="bg-gray-100 rounded-lg p-8 mb-4 flex items-center justify-center">
                <div className="w-32 h-32">
                  <img 
                    src={`data:image/svg+xml;base64,${btoa(`
                      <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                        <rect width="128" height="128" fill="${getShoeColor(selectedProduct.title).bg}"/>
                        <path d="M20 80 Q30 70 50 75 Q70 80 90 75 Q100 70 108 80 L108 95 Q100 100 90 95 Q70 100 50 95 Q30 100 20 95 Z" fill="${getShoeColor(selectedProduct.title).accent}"/>
                        <path d="M25 85 Q35 75 55 80 Q75 85 95 80 Q105 75 108 85" stroke="white" stroke-width="2" fill="none"/>
                        <circle cx="95" cy="82" r="3" fill="white"/>
                      </svg>
                    `)}`}
                    alt="Nike Shoe"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Quantity and Inventory Type */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">* Quantity</label>
                  <div className="flex items-center border border-gray-300 rounded">
                    <input
                      type="number"
                      value={bulkQuantity}
                      onChange={(e) => setBulkQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, selectedProduct.totalQuantity - selectedProduct.pickedQuantity)))}
                      className="flex-1 px-3 py-2 text-center border-none outline-none"
                      min="1"
                      max={selectedProduct.totalQuantity - selectedProduct.pickedQuantity}
                    />
                    <span className="px-2 text-gray-500">/{selectedProduct.totalQuantity - selectedProduct.pickedQuantity}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">* Inventory Type</label>
                  <select
                    value={inventoryType}
                    onChange={(e) => setInventoryType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white"
                  >
                    <option value="Good">Good</option>
                    <option value="Damaged">Damaged</option>
                  </select>
                </div>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-6">
                <div>
                  <span className="text-gray-600">Batch</span>
                  <div className="font-medium">B1001234355</div>
                </div>
                <div>
                  <span className="text-gray-600">MRP</span>
                  <div className="font-medium">₹{selectedProduct.mrp.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Mfg. Date</span>
                  <div className="font-medium">{selectedProduct.mfgDate}</div>
                </div>
                <div>
                  <span className="text-gray-600">Expiry Date</span>
                  <div className="font-medium">02/05/2035</div>
                </div>
                <div>
                  <span className="text-gray-600">Cost</span>
                  <div className="font-medium">₹6,000</div>
                </div>
                <div>
                  <span className="text-gray-600">MRP</span>
                  <div className="font-medium">₹10,000</div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleBulkPickSubmit}
                className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700"
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shelf Empty Alert */}
      {showShelfEmptyAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 m-4 text-center">
            <div className="text-green-600 text-4xl mb-4">✓</div>
            <h3 className="text-lg font-semibold mb-2">All items scanned!</h3>
            <p className="text-gray-600 mb-4">All items from this shelf have been picked successfully.</p>
            <button
              onClick={handleShelfEmptyConfirm}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Camera Capture Modal */}
      <CameraCapture
        isActive={showCameraCapture}
        onCapture={handleCameraCapture}
        onClose={() => setShowCameraCapture(false)}
      />

    </div>
  );
}