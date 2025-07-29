import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Trash2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useParams } from "wouter";
import { CameraCapture } from "@/components/CameraCapture";

export const ToteScannerPage: React.FC = () => {
  const params = useParams();
  const picklistId = params.id || "PK1000";
  const [, setLocation] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [scannedData, setScannedData] = useState<string>("");
  const [cameraError, setCameraError] = useState<string>("");
  const [showCameraCapture, setShowCameraCapture] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [capturedImageData, setCapturedImageData] = useState<string | null>(null);

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
      setCameraError("Camera access denied. Please allow camera permissions and refresh.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const handleBack = () => {
    stopCamera();
    setLocation(`/picklist/${picklistId}`);
  };

  const handleClose = () => {
    stopCamera();
    setLocation(`/picklist/${picklistId}`);
  };

  const handleToteIconClick = () => {
    setShowCameraCapture(true);
  };

  const handleCameraCapture = (imageData: string) => {
    console.log("Tote photo captured");
    setCapturedImageData(imageData);
    setCapturedImages(prev => [...prev, imageData]);
    
    // Mock barcode data for now
    const mockBarcodeData = "TOTE_001_12345";
    setScannedData(mockBarcodeData);
    console.log("Scanned data:", mockBarcodeData);
    
    // After scanning, navigate to shelf detail page
    setTimeout(() => {
      stopCamera();
      setLocation(`/shelf-detail/${picklistId}`);
    }, 1000);
  };

  const handleDeleteImage = () => {
    setCapturedImageData(null);
    setCapturedImages([]);
  };

  const handleAddImage = () => {
    setShowCameraCapture(true);
  };

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

        {/* Content */}
        <div className="flex flex-col h-[60%]">
          {/* Scan SHELF Section - Camera View */}
          <div className="bg-red-700 flex flex-col items-center justify-center relative flex-1 rounded-xl">
            {/* Scan SHELF Title */}
            <div className="absolute top-6 left-0 right-0 flex items-center justify-center">
              <h2 className="text-white text-lg font-medium">Scan SHELF</h2>
              <button 
                className="absolute right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                onClick={handleToteIconClick}
              >
              </button>
            </div>

            {/* Camera Scanner Area */}
            <div className="relative flex items-center justify-center">
              <CameraCapture
                isActive={true}
                onCapture={handleCameraCapture}
                showCapturedImage={!!capturedImageData}
                capturedImageData={capturedImageData}
                onDeleteImage={handleDeleteImage}
                width={256}
                height={128}
              />
            </div>

            {/* Scanned Data Display */}
            {scannedData && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <div className="bg-green-600 text-white px-4 py-2 rounded-lg">
                  Scanned: {scannedData}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Instruction */}
          <div className="bg-white flex flex-col items-center justify-center py-4">
            <p className="text-gray-700 text-lg font-medium mb-4">
              Scan tote to continue picking
            </p>
            
            {/* Captured Images */}
            {capturedImages.length > 0 && (
              <div className="mb-4 w-full max-w-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Captured Images ({capturedImages.length})</h3>
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


            
            {scannedData && (
              <div className="mt-3 text-sm text-green-600">
                Ready to continue with: {scannedData}
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
};