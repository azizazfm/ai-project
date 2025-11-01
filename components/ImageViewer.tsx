import React from 'react';
import { DownloadIcon } from './icons';

interface ImageViewerProps {
  imageUrl: string | null;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg shadow-xl p-4 flex flex-col items-center justify-center h-full relative">
      <div className="flex-grow w-full flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Generated art"
            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
          />
        ) : (
           <div className="text-gray-500 text-center">
            <p>Your generated image will appear here.</p>
           </div>
        )}
      </div>
      {imageUrl && (
        <div className="absolute top-4 right-4">
          <a
            href={imageUrl}
            download="ai-art.png"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition-colors shadow-md"
            aria-label="Download image"
          >
            <DownloadIcon className="w-5 h-5" />
            Download
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;