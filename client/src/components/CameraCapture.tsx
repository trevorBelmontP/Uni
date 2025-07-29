/**
 * CameraCapture Component
 * 
 * Purpose: Handles all camera functionality for barcode scanning
 * - Opens device camera and shows live video feed
 * - Captures photos when user clicks button
 * - Handles camera permissions and error states
 * - Used across all scanner pages (Tote, Shelf, SKU)
 * 
 * How it works:
 * 1. Requests camera permission when activated
 * 2. Shows live video feed with scanning overlay
 * 3. User clicks to capture photo
 * 4. Photo replaces video feed until deleted
 */

import React, { useRef, useEffect, useState } from 'react';
import { Camera, Trash2 } from 'lucide-react'; // Icons for camera and delete actions
import { Button } from '@/components/ui/button'; // Reusable button component

// Props interface - defines what data this component expects
interface CameraCaptureProps {
  onCapture?: (imageData: string) => void; // Called when photo is captured
  onClose?: () => void; // Called when modal/component should close
  isActive: boolean; // Whether camera should be active
  title?: string; // Optional title for the camera modal
  showCapturedImage?: boolean; // Whether to show captured image
  capturedImageData?: string | null; // Base64 data of captured image
  onDeleteImage?: () => void; // Called when user wants to delete image
  width?: number; // Camera width in pixels
  height?: number; // Camera height in pixels
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onClose,
  isActive,
  title = "Camera",
  showCapturedImage = false,
  capturedImageData = null,
  onDeleteImage,
  width = 256,
  height = 128
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    if (isActive && !showCapturedImage) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive, showCapturedImage]);

  const startCamera = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setStream(mediaStream);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64 image data
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Store in sessionStorage for temporary storage
    const timestamp = Date.now();
    const storageKey = `captured_image_${timestamp}`;
    sessionStorage.setItem(storageKey, imageData);
    
    // Call the onCapture callback with the image data
    if (onCapture) {
      onCapture(imageData);
    }
    
    // Reset capturing state
    setTimeout(() => setIsCapturing(false), 500);
  };

  if (!isActive) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* Camera lens or captured image */}
      <div 
        className="relative rounded-xl overflow-hidden border-4 border-white shadow-lg"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {showCapturedImage && capturedImageData ? (
          // Show captured image
          <img 
            src={capturedImageData}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        ) : (
          // Show camera feed or error
          <>
            {error ? (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-xs p-2 text-center">
                <div>
                  <p className="mb-2">{error}</p>
                  <button 
                    onClick={startCamera}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Scanning overlay */}
            <div className="absolute inset-0 border-2 border-dashed border-white/50 flex items-center justify-center">
              {isCapturing && (
                <div className="bg-white/20 rounded-full p-2">
                  <Camera className="w-4 h-4 text-white animate-pulse" />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-4">
        {showCapturedImage && capturedImageData ? (
          <>
            <Button
              onClick={onDeleteImage}
              variant="destructive"
              size="sm"
              className="flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
            <Button
              onClick={() => {
                if (onDeleteImage) onDeleteImage();
                startCamera();
              }}
              variant="outline"
              size="sm"
            >
              Add
            </Button>
          </>
        ) : (
          <Button
            onClick={capturePhoto}
            disabled={isCapturing || !!error}
            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600"
            size="sm"
          >
            <Camera className="w-4 h-4" />
            {isCapturing ? "Capturing..." : "Click Picture"}
          </Button>
        )}
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};