import React from 'react';
import ImageUploader from './ImageUploader';
import { SparklesIcon, UploadIcon } from './icons';

interface ModeSelectorProps {
  onModeSelect: (mode: 'text-to-image' | 'image-to-image') => void;
  onImageUpload: (file: File) => void;
  isLoading: boolean;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ onModeSelect, onImageUpload, isLoading }) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row gap-6 items-stretch">
      {/* Text-to-Image card */}
      <div className="flex-1 flex flex-col bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 hover:border-purple-500 transition-all duration-300">
        <SparklesIcon className="w-12 h-12 text-purple-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Create with Text</h2>
        <p className="text-gray-400 mb-6 flex-grow">
          Start with a descriptive prompt and generate a unique image from scratch.
        </p>
        <button
          onClick={() => onModeSelect('text-to-image')}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition-colors"
          disabled={isLoading}
        >
          Generate Image
        </button>
      </div>

      {/* Image-to-Image card */}
       <div className="flex-1 flex flex-col bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
        <UploadIcon className="w-12 h-12 text-pink-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Edit with Image</h2>
        <p className="text-gray-400 mb-6 flex-grow">
          Upload your own image and use chat to modify, transform, and perfect it.
        </p>
         <div className="mt-auto">
            <label 
              htmlFor="image-upload-button"
              className={`w-full block text-center bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-full transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              Upload Image
            </label>
            <input 
              id="image-upload-button"
              type="file" 
              className="hidden" 
              accept="image/png, image/jpeg"
              onChange={(e) => e.target.files && onImageUpload(e.target.files[0])}
              disabled={isLoading}
            />
         </div>
      </div>
    </div>
  );
};

export default ModeSelector;
