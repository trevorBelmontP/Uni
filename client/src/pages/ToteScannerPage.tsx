/**
 * ToteScannerPage Component
 * 
 * Purpose: First step in the picking process - scan tote/container barcode
 * This page allows workers to scan the container they'll use for picking
 * 
 * User Journey:
 * 1. User arrives after clicking "Start Picking" on a picking list
 * 2. Camera shows live feed with scanning overlay
 * 3. User positions tote barcode in camera view
 * 4. User clicks "Click Picture" to capture barcode image
 * 5. After successful scan, automatically navigates to shelf detail page
 * 
 * Features:
 * - Live camera feed with scanning guides
 * - Direct photo capture without modal
 * - Bin button to clear captured photos
 * - Automatic navigation after scanning
 */

import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Trash2, Camera } from "lucide-react"; // Icons for navigation and actions
import { Button } from "@/components/ui/button"; // Reusable button component
import { useLocation, useParams } from "wouter"; // For navigation and getting URL parameters
import { CameraCapture } from "@/components/CameraCapture"; // Camera functionality component

export const ToteScannerPage: React.FC = () => {
  // Get URL parameters (like the picking list ID from /tote-scanner/123)
  const params = useParams();
  const picklistId = params.id || "PK1000"; // Default fallback ID
  const [, setLocation] = useLocation(); // For programmatic navigation between pages
  
  // Camera-related state variables
  const videoRef = useRef<HTMLVideoElement>(null); // Reference to video element for direct access
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null); // Active camera stream
  const [scannedData, setScannedData] = useState<string>(""); // Mock barcode data after scanning
  const [cameraError, setCameraError] = useState<string>(""); // Error messages for camera issues
  const [showCameraCapture, setShowCameraCapture] = useState(false); // Show/hide camera modal
  const [capturedImages, setCapturedImages] = useState<string[]>([]); // Array of captured image data
  const [capturedImageData, setCapturedImageData] = useState<string | null>(null); // Currently displayed image

  // Start camera when component loads and cleanup when component unloads
  useEffect(() => {
    startCamera(); // Initialize camera on page load
    return () => {
      stopCamera(); // Cleanup camera when leaving page
    };
  }, []);

  // Function to request camera permission and start video stream
  const startCamera = async () => {
    try {
      // Request camera access with specific settings
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera (better for barcode scanning)
          width: { ideal: 1280 }, // High resolution for better barcode recognition
          height: { ideal: 720 }
        }
      });
      
      // Connect camera stream to video element if it exists
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStream(stream);
        setCameraError(""); // Clear any previous errors
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraError("Camera access denied. Please allow camera permissions and refresh.");
    }
  };

  // Function to stop camera and release resources
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop()); // Stop all camera tracks
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
    // Capture photo directly from video stream
    if (videoRef.current && !capturedImageData) {
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        handleCameraCapture(imageData);
      }
    }
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
    // Restart camera when image is deleted
    startCamera();
  };

  const handleAddImage = () => {
    setShowCameraCapture(true);
  };

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="bg-white w-full min-h-screen relative container-responsive">
        {/* Header */}
        <header className="flex items-center justify-between w-full bg-white border-b border-[#e0e0e0] header-responsive">
          <div className="flex items-center gap-3">
            <button 
              className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded transition-colors duration-200 sm:w-10 sm:h-10"
              onClick={handleBack}
            >
              <ArrowLeft className="h-5 w-5 text-text-elementsprimary sm:h-6 sm:w-6" />
            </button>
            <h1 className="font-PAGE-TITLE font-[number:var(--PAGE-TITLE-font-weight)] text-text-elementsprimary text-[length:var(--PAGE-TITLE-font-size)] tracking-[var(--PAGE-TITLE-letter-spacing)] leading-[var(--PAGE-TITLE-line-height)] [font-style:var(--PAGE-TITLE-font-style)] sm:text-xl lg:text-2xl">
              TOTE_01
            </h1>
          </div>
          
          <Button 
            variant="ghost" 
            className="text-gray-600 hover:text-gray-800 font-medium sm:text-lg lg:text-xl"
            onClick={handleClose}
          >
            CLOSE
          </Button>
        </header>

        {/* Main Content - Full Height */}
        <div className="flex-1 flex flex-col">
          {/* Scan TOTE Section - Camera View */}
          <div className="bg-gray-800 flex flex-col items-center justify-center relative flex-1">
            {/* Scan TOTE Title */}
            <div className="absolute top-6 left-0 right-0 flex items-center justify-center">
              <h2 className="text-white text-lg font-medium sm:text-xl lg:text-2xl">Scan TOTE</h2>
              <button 
                className="absolute right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors sm:w-12 sm:h-12 lg:w-14 lg:h-14"
                onClick={handleDeleteImage}
              >
                <Trash2 className="h-4 w-4 text-gray-600 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              </button>
            </div>

            {/* Camera Scanner Area */}
            <div className="relative flex flex-col items-center justify-center">
              {/* Camera Lens with captured image overlay */}
              <div className="relative camera-responsive rounded-2xl overflow-hidden mb-4">
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
                      <div className="absolute top-1 left-1 w-6 h-6 border-t-2 border-l-2 border-white rounded-tl-lg sm:w-8 sm:h-8 lg:w-10 lg:h-10"></div>
                      <div className="absolute top-1 right-1 w-6 h-6 border-t-2 border-r-2 border-white rounded-tr-lg sm:w-8 sm:h-8 lg:w-10 lg:h-10"></div>
                      <div className="absolute bottom-1 left-1 w-6 h-6 border-b-2 border-l-2 border-white rounded-bl-lg sm:w-8 sm:h-8 lg:w-10 lg:h-10"></div>
                      <div className="absolute bottom-1 right-1 w-6 h-6 border-b-2 border-r-2 border-white rounded-br-lg sm:w-8 sm:h-8 lg:w-10 lg:h-10"></div>
                      
                      {/* Scanning line animation */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4/5 h-0.5 bg-red-500 animate-pulse shadow-lg sm:h-1 lg:h-1.5"></div>
                      </div>
                      
                      {/* Center instruction */}
                      {!cameraError && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-white text-xs text-center bg-black bg-opacity-70 px-3 py-1 rounded-full backdrop-blur-sm sm:text-sm sm:px-4 sm:py-2 lg:text-base lg:px-6 lg:py-3">
                            Position tote barcode here
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
                    <div className="text-white text-xs text-center px-3 sm:text-sm lg:text-base">
                      {cameraError}
                    </div>
                  </div>
                )}
              </div>

              {/* Click Picture Button */}
              {!capturedImageData && (
                <Button
                  onClick={handleToteIconClick}
                  className="bg-white text-black hover:bg-gray-100 border border-gray-300 px-6 py-2 rounded-full font-medium sm:px-8 sm:py-3 sm:text-lg lg:px-10 lg:py-4 lg:text-xl"
                >
                  <Camera className="w-4 h-4 mr-2 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                  Click Picture
                </Button>
              )}
            </div>

            {/* Scanned Data Display */}
            {scannedData && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <div className="bg-green-600 text-white px-4 py-2 rounded-lg sm:px-6 sm:py-3 sm:text-lg lg:px-8 lg:py-4 lg:text-xl">
                  Scanned: {scannedData}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Instruction */}
          <div className="bg-white flex flex-col items-center justify-center py-4 sm:py-6 lg:py-8">
            <p className="text-gray-700 text-lg font-medium mb-4 sm:text-xl sm:mb-6 lg:text-2xl lg:mb-8">
              Scan tote to continue picking
            </p>
            



            
            {scannedData && (
              <div className="mt-3 text-sm text-green-600 sm:text-base lg:text-lg">
                Ready to continue with: {scannedData}
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
};