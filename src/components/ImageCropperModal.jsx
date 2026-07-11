import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import { X, RotateCw, Check } from 'lucide-react';

export default function ImageCropperModal({ imageSrc, onComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [originalAspect, setOriginalAspect] = useState(1);
  const [aspect, setAspect] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onMediaLoaded = useCallback((mediaSize) => {
    const ratio = mediaSize.width / mediaSize.height;
    setOriginalAspect(ratio);
    setAspect(ratio);
  }, []);

  // Automatically adjust crop box aspect ratio when rotating
  React.useEffect(() => {
    const normalizedRotation = Math.abs(rotation % 180);
    // If rotation is roughly 90 or 270 degrees, flip the aspect ratio
    if (normalizedRotation > 45 && normalizedRotation < 135) {
      setAspect(1 / originalAspect);
    } else {
      setAspect(originalAspect);
    }
  }, [rotation, originalAspect]);

  const onCropCompleteAction = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      onComplete(croppedImage);
    } catch (e) {
      console.error(e);
      alert('Error cropping image');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col h-[95vh]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
          <h2 className="text-lg font-bold text-gray-900">Crop & Rotate Image</h2>
          <button 
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative flex-1 bg-gray-900 w-full min-h-0 flex items-center justify-center">
          <Cropper
            image={imageSrc}
            crop={crop}
            rotation={rotation}
            zoom={zoom}
            aspect={aspect}
            onMediaLoaded={onMediaLoaded}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onCropComplete={onCropCompleteAction}
            onZoomChange={setZoom}
            objectFit="contain"
          />
        </div>

        <div className="p-4 bg-white border-t border-gray-100 shrink-0 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <span className="text-sm font-medium text-gray-700 w-12">Zoom</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(e.target.value)}
                className="w-full sm:w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <span className="text-sm font-medium text-gray-700 w-16">Rotation</span>
              <input
                type="range"
                value={rotation}
                min={0}
                max={360}
                step={1}
                aria-labelledby="Rotation"
                onChange={(e) => setRotation(e.target.value)}
                className="w-full sm:w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setRotation((prev) => (prev + 90) % 360)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
            >
              <RotateCw className="w-4 h-4" /> 90°
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm disabled:opacity-50"
            >
              <Check className="w-4 h-4" /> 
              {isProcessing ? 'Processing...' : 'Apply & Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
