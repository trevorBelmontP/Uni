import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Trash2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useParams } from "wouter";
import { CameraCapture } from "@/components/CameraCapture";

// Mock shelf data based on scanned barcode
const mockShelfData = {
  aisle: "15",
  section: "006",
  level: "A",
  shelves: [
    {
      code: "SHELF_001",
      skuCount: 5,
      pendingQty: 120,
    },
    {
      code: "SHELF_002",
      skuCount: 3,
      pendingQty: 80,
    },
  ],
};

export const ShelfDetailPage: React.FC = () => {
  const params = useParams();
  const picklistId = params.id || "PK1000";
  const [, setLocation] = useLocation();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>("");
  const [showBarcodeData, setShowBarcodeData] = useState(false);
  const [showCameraCapture, setShowCameraCapture] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [capturedImageData, setCapturedImageData] = useState<string | null>(
    null,
  );

  // Start camera when component mounts
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
          facingMode: "environment", // Use back camera for barcode scanning
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStream(stream);
        setCameraError("");
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraError(
        "Camera access denied. Please allow camera permissions and refresh.",
      );
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const handleBack = () => {
    stopCamera();
    setLocation(`/tote-scanner/${picklistId}`);
  };

  const handleClose = () => {
    stopCamera();
    setLocation(`/picklist/${picklistId}`);
  };

  const handleScanShelf = () => {
    // Capture photo directly from video stream
    if (videoRef.current && !capturedImageData) {
      const canvas = document.createElement("canvas");
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        handleCameraCapture(imageData);
      }
    }
  };

  const handleCameraCapture = (imageData: string) => {
    console.log("Shelf photo captured");
    setCapturedImageData(imageData);
    setCapturedImages((prev) => [...prev, imageData]);
    setShowBarcodeData(true);
  };

  const handleDeleteImage = (index: number) => {
    setCapturedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddImage = () => {
    setShowCameraCapture(true);
  };

  const handleClickCapture = () => {
    setShowCameraCapture(true);
  };

  // Navigation to SKU scanner
  const handleShelfClick = (shelfCode: string) => {
    stopCamera();
    setLocation(`/sku-scanner/TOTE_01`);
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const sortedShelves = [...mockShelfData.shelves].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.code.localeCompare(b.code);
    } else {
      return b.code.localeCompare(a.code);
    }
  });

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="bg-white w-full max-w-md mx-auto min-h-screen relative">
        {/* Header */}
        <header className="flex h-12 items-center justify-between w-full bg-white border-b border-[#e0e0e0] px-4">
          <div className="flex items-center gap-3">
            <button
              className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded transition-colors duration-200"
              onClick={handleBack}
            >
              <ArrowLeft className="h-5 w-5 text-text-elementsprimary" />
            </button>
            <h1 className="font-PAGE-TITLE font-[number:var(--PAGE-TITLE-font-weight)] text-text-elementsprimary text-[length:var(--PAGE-TITLE-font-size)] tracking-[var(--PAGE-TITLE-letter-spacing)] leading-[var(--PAGE-TITLE-line-height)] [font-style:var(--PAGE-TITLE-font-style)]">
              TOTE_01
            </h1>
          </div>

          <Button
            variant="ghost"
            className="text-gray-600 hover:text-gray-800 font-medium"
            onClick={handleClose}
          >
            CLOSE
          </Button>
        </header>

        {/* Scan SHELF Section */}
        <div className="bg-gray-800 flex flex-col items-center justify-center relative h-64">
          {/* Scan SHELF Title */}
          <div className="absolute top-1 left-0 right-0 flex items-center justify-center">
            <h2 className="text-white text-lg font-medium">Scan SHELF</h2>
            <button
              className="absolute right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              onClick={() => {
                setCapturedImageData(null);
                setCapturedImages([]);
                setShowBarcodeData(false);
                // Restart camera when image is deleted
                startCamera();
              }}
            >
              <Trash2 className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Camera Scanner Area */}
          <div className="relative flex flex-col items-center justify-center">
            {/* Camera Lens with captured image overlay */}
            <div className="relative w-64 h-32 rounded-2xl overflow-hidden mb-4">
              {!capturedImageData ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Scanning Frame Overlay */}
                  <div className="absolute inset-0 border-2 border-white border-opacity-60 rounded-2xl">
                    {/* Corner brackets */}
                    <div className="absolute top-1 left-1 w-6 h-6 border-t-2 border-l-2 border-white rounded-tl-lg"></div>
                    <div className="absolute top-1 right-1 w-6 h-6 border-t-2 border-r-2 border-white rounded-tr-lg"></div>
                    <div className="absolute bottom-1 left-1 w-6 h-6 border-b-2 border-l-2 border-white rounded-bl-lg"></div>
                    <div className="absolute bottom-1 right-1 w-6 h-6 border-b-2 border-r-2 border-white rounded-br-lg"></div>

                    {/* Scanning line animation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4/5 h-0.5 bg-red-500 animate-pulse shadow-lg"></div>
                    </div>

                    {/* Center instruction */}
                    {!cameraError && !showBarcodeData && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-xs text-center bg-black bg-opacity-70 px-3 py-1 rounded-full backdrop-blur-sm">
                          Position shelf barcode here
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <img
                  src={capturedImageData}
                  alt="Captured"
                  className="w-full h-full object-cover rounded-2xl"
                />
              )}

              {/* Camera Error Fallback */}
              {cameraError && !capturedImageData && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center rounded-2xl">
                  <div className="text-white text-xs text-center px-3">
                    {cameraError}
                  </div>
                </div>
              )}
            </div>

            {/* Click Picture Button */}
            {!capturedImageData && (
              <Button
                onClick={handleScanShelf}
                className="bg-white text-black hover:bg-gray-100 border border-gray-300 px-6 py-2 rounded-full font-medium"
              >
                <Camera className="w-4 h-4 mr-2" />
                Click Picture
              </Button>
            )}
          </div>

          {/* Barcode Data Display (shows after scanning) */}
        </div>

        {/* Tabs Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex">
            <button className="flex-1 py-3 px-4 text-blue-600 border-b-2 border-blue-600 font-medium">
              Pending Shelf{" "}
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs ml-1">
                2
              </span>
            </button>
            <button className="flex-1 py-3 px-4 text-gray-500 font-medium">
              Scanned Shelf{" "}
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs ml-1">
                0
              </span>
            </button>
          </div>
        </div>

        {/* Section Header */}
        <div className="bg-gray-100 px-4 py-3 flex justify-between items-center">
          <div className="text-gray-800 font-medium">SECTION</div>
          <button
            onClick={toggleSort}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <span className="text-sm">Shelf Code</span>
            <span className="text-lg">{sortOrder === "asc" ? "A↑" : "Z↓"}</span>
          </button>
        </div>

        {/* Captured Images */}

        {/* Action Buttons */}

        {/* Shelf List */}
        <div className="flex-1 overflow-y-auto">
          {sortedShelves.map((shelf, index) => (
            <button
              key={shelf.code}
              className="w-full bg-white border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors text-left"
              onClick={() => handleShelfClick(shelf.code)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">
                    {shelf.code}
                  </div>
                  <div className="text-gray-500 text-sm">
                    SKU Count{" "}
                    <span className="font-semibold text-gray-700">
                      {shelf.skuCount}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-500 text-sm mb-1">Pending Qty</div>
                  <div className="text-lg font-bold text-gray-900">
                    {shelf.pendingQty}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Test Button - Remove in production */}
        {!showBarcodeData && (
          <div className="fixed bottom-4 right-4">
            <button
              onClick={handleScanShelf}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Test Shelf Scan
            </button>
          </div>
        )}

        {/* Camera Capture Modal */}
        <CameraCapture
          isActive={showCameraCapture}
          onCapture={handleCameraCapture}
          onClose={() => setShowCameraCapture(false)}
        />
      </div>
    </div>
  );
};
