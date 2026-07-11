import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, Trash2, X, Edit2, Crop } from 'lucide-react';
import ImageCropperModal from './ImageCropperModal';

export default function ImageUploaderCard({ storageKey, initialTitle, onRemove, onTitleChange, onImageUpload }) {
  const [image, setImage] = useState(null);
  const [selectedImageSrc, setSelectedImageSrc] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setImage(saved);
    }
  }, [storageKey]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
    // Reset input value so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = (croppedBase64) => {
    setImage(croppedBase64);
    localStorage.setItem(storageKey, croppedBase64);
    setSelectedImageSrc(null);
    if (onImageUpload) {
      onImageUpload();
    }
  };

  const handleClear = () => {
    setImage(null);
    localStorage.removeItem(storageKey);
  };

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    onTitleChange(title);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col relative group h-[360px] transition-colors">
      <button 
        onClick={onRemove}
        className="absolute top-2 right-2 p-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-200 dark:hover:bg-red-900/50 shadow-sm"
        title="Remove this card"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 pr-10 shrink-0 transition-colors">
        <div className="w-full">
          {isEditing ? (
            <form onSubmit={handleTitleSubmit} className="flex gap-2 w-full">
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
                onBlur={handleTitleSubmit}
              />
            </form>
          ) : (
            <div className="flex items-center gap-2 group/title">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate" title={title}>{title}</h2>
              <button 
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 opacity-0 group-hover/title:opacity-100 transition-opacity shrink-0"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
        
        {image && (
          <button 
            onClick={handleClear}
            className="w-full sm:w-auto flex justify-center items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 text-sm font-medium transition-colors shadow-sm shrink-0"
          >
            <Trash2 className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col min-h-0 relative">
        {!image ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-200 dark:border-indigo-800 rounded-2xl p-6 sm:p-8 bg-indigo-50/30 dark:bg-indigo-900/10 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/20 transition-all cursor-pointer group/upload w-full max-w-xs mx-auto"
            >
              <UploadCloud className="w-10 h-10 text-indigo-400 mx-auto mb-3 group-hover/upload:scale-110 group-hover/upload:text-indigo-500 transition-all" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Upload Image</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Click to select an image</p>
              <span className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium shadow-sm inline-block">
                Select Image
              </span>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleUpload} 
              className="hidden" 
            />
          </div>
        ) : (
          <>
            <div className="absolute inset-0 p-4 overflow-y-auto bg-gray-50/30 dark:bg-gray-800/10 custom-scrollbar bottom-[52px]">
              <img src={image} alt={title} className="w-full h-auto object-contain rounded shadow-sm border border-gray-200 dark:border-gray-800" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-center transition-colors">
              <button 
                onClick={() => setSelectedImageSrc(image)}
                className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 font-medium transition-colors text-sm border border-indigo-100 dark:border-indigo-800 shadow-sm"
              >
                <Crop className="w-4 h-4" /> Edit Image (Crop & Rotate)
              </button>
            </div>
          </>
        )}
      </div>

      {selectedImageSrc && (
        <ImageCropperModal
          imageSrc={selectedImageSrc}
          onComplete={handleCropComplete}
          onCancel={() => setSelectedImageSrc(null)}
        />
      )}
    </div>
  );
}
