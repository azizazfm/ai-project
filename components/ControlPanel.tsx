import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import { RestartIcon, SparklesIcon } from './icons';

interface ControlPanelProps {
  appMode: 'text-to-image' | 'image-to-image';
  onGenerateFromText: (prompt: string) => void;
  onImageUpload: (file: File) => void;
  onReset: () => void;
  isLoading: boolean;
}

const TextToImageControls: React.FC<Pick<ControlPanelProps, 'onGenerateFromText' | 'isLoading'>> = ({ onGenerateFromText, isLoading }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !isLoading) {
            onGenerateFromText(prompt.trim());
        }
    };

    return (
        <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Describe the image you want to create:</h3>
            <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A futuristic city at sunset with flying cars, photorealistic"
                    className="w-full flex-grow bg-gray-700 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                    disabled={isLoading}
                    rows={8}
                />
                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-full transition-all"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
                            Generating...
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-5 h-5" />
                            Generate
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

const ControlPanel: React.FC<ControlPanelProps> = ({ appMode, onGenerateFromText, onImageUpload, onReset, isLoading }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6 flex flex-col h-full max-h-[calc(100vh-150px)]">
      <div className="flex-grow">
        {appMode === 'text-to-image' && (
            <TextToImageControls onGenerateFromText={onGenerateFromText} isLoading={isLoading} />
        )}
        {appMode === 'image-to-image' && (
            <div className="flex flex-col h-full">
                <h3 className="text-lg font-semibold text-gray-300 mb-4">Upload an image to start editing:</h3>
                <ImageUploader onImageUpload={onImageUpload} isLoading={isLoading} />
            </div>
        )}
      </div>
      <div className="mt-6 border-t border-gray-700 pt-6">
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full transition-colors"
        >
          <RestartIcon className="w-5 h-5" />
          Start Over
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
