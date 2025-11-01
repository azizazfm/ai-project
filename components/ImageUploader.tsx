import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg transition-colors duration-300 ${isDragging ? 'border-purple-400 bg-gray-700' : 'border-gray-600 hover:border-purple-400 bg-gray-700/50'}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        id="file-upload"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        disabled={isLoading}
      />
      <label htmlFor="file-upload" className="flex flex-col items-center justify-center text-center p-6 cursor-pointer">
        {isLoading ? (
          <>
            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
            <p className="mt-4 text-lg font-semibold text-gray-300">Analyzing your image...</p>
          </>
        ) : (
          <>
            <UploadIcon className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-lg font-semibold text-gray-300">
              <span className="text-purple-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-gray-500">PNG or JPG</p>
          </>
        )}
      </label>
    </div>
  );
};

export default ImageUploader;