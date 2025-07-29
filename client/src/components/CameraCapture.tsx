import React, { useRef, useEffect, useState } from 'react';
import { Camera, X } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose?: () => void;
  isActive: boolean;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onClose,
  isActive
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

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
    onCapture(imageData);
    
    // Reset capturing state
    setTimeout(() => setIsCapturing(false), 500);
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-black/50 text-white">
        <h2 className="text-lg font-semibold">Camera</h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Camera View */}
      <div className="flex-1 relative flex items-center justify-center">
        {error ? (
          <div className="text-white text-center p-4">
            <p className="mb-4">{error}</p>
            <button 
              onClick={startCamera}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            
            {/* Scanning overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-32 border-2 border-white rounded-lg bg-transparent relative">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-400"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-red-500 opacity-70 animate-pulse"></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Capture Button */}
      <div className="p-6 bg-black/50 flex justify-center">
        <button
          onClick={capturePhoto}
          disabled={!!error || isCapturing}
          className={`w-16 h-16 rounded-full border-4 border-white flex items-center justify-center ${
            isCapturing 
              ? 'bg-green-500 border-green-500' 
              : 'bg-white hover:bg-gray-100'
          } transition-all duration-300 disabled:opacity-50`}
        >
          {isCapturing ? (
            <div className="w-8 h-8 bg-white rounded-full"></div>
          ) : (
            <Camera className="w-8 h-8 text-black" />
          )}
        </button>
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};