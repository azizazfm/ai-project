import React, { useState, useCallback } from 'react';
import { ChatMessage, ImageFile } from './types';
import { generateDescription, editImage, generateImageFromText } from './services/geminiService';
import ModeSelector from './components/ModeSelector';
import ControlPanel from './components/ControlPanel';
import MainContent from './components/MainContent';

type AppMode = 'initial' | 'text-to-image' | 'image-to-image';

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>('initial');
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      setError(null);
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const imageUrl = reader.result as string;
        
        const fileData = {
          base64: base64String,
          mimeType: file.type,
        };

        setImageFile(fileData);
        setCurrentImage(imageUrl);
        setChatHistory([]);
        setAppMode('image-to-image');

        const description = await generateDescription(fileData.base64, fileData.mimeType);
        
        setChatHistory([
          { type: 'ai-text', content: "Here's a description of your image. How can I help you edit it?" },
          { type: 'ai-text', content: description }
        ]);
      };
      reader.readAsDataURL(file);
    } catch (e) {
      console.error(e);
      setError('Failed to generate image description. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleGenerateFromText = useCallback(async (prompt: string) => {
    try {
      setError(null);
      setIsLoading(true);
      setChatHistory([{ type: 'user', content: prompt }]);
      
      const { base64, mimeType } = await generateImageFromText(prompt);
      const imageUrl = `data:${mimeType};base64,${base64}`;

      setImageFile({ base64, mimeType });
      setCurrentImage(imageUrl);
      setAppMode('text-to-image');
      setChatHistory(prev => [
          ...prev, 
          { type: 'ai-image', content: imageUrl },
          { type: 'ai-text', content: "Image generated! How would you like to modify it?" }
      ]);

    } catch(e) {
       console.error(e);
       setError('Failed to generate image from text. Please try again.');
    } finally {
       setIsLoading(false);
    }
  }, []);


  const handleSendMessage = useCallback(async (prompt: string) => {
    if (!currentImage) return;

    try {
      setError(null);
      setIsLoading(true);
      setChatHistory(prev => [...prev, { type: 'user', content: prompt }]);

      const currentImageBase64 = currentImage.split(',')[1];
      const currentMimeType = imageFile?.mimeType || 'image/jpeg';
      
      const newImageBase64 = await editImage(currentImageBase64, currentMimeType, prompt);

      const newImageUrl = `data:${currentMimeType};base64,${newImageBase64}`;
      setCurrentImage(newImageUrl);
      setImageFile({ base64: newImageBase64, mimeType: currentMimeType });
      setChatHistory(prev => [...prev, { type: 'ai-image', content: newImageUrl }]);

    } catch (e) {
      console.error(e);
      const errorMessage = 'Failed to edit the image. Please check your prompt or try again.';
      setError(errorMessage);
      setChatHistory(prev => [...prev, {type: 'ai-text', content: `Error: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  }, [currentImage, imageFile]);

  const handleReset = () => {
    setAppMode('initial');
    setImageFile(null);
    setCurrentImage(null);
    setChatHistory([]);
    setError(null);
    setIsLoading(false);
  };

  const renderContent = () => {
    if (appMode === 'initial') {
      return <ModeSelector onModeSelect={setAppMode} onImageUpload={handleImageUpload} isLoading={isLoading}/>
    }
    return (
       <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full h-full">
         <div className="lg:col-span-2">
            <ControlPanel 
              appMode={appMode} 
              onGenerateFromText={handleGenerateFromText}
              onImageUpload={handleImageUpload}
              onReset={handleReset}
              isLoading={isLoading}
            />
         </div>
         <div className="lg:col-span-3">
            <MainContent
              imageUrl={currentImage}
              chatHistory={chatHistory}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
         </div>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 font-sans">
      <header className="w-full max-w-7xl text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          AI Art Companion
        </h1>
        <p className="text-gray-400 mt-2">Generate and edit images with the power of AI chat.</p>
      </header>
      
      <main className="w-full max-w-7xl flex-grow flex items-center justify-center">
        {renderContent()}
        {error && (
            <div className="fixed bottom-5 right-5 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 cursor-pointer" onClick={() => setError(null)}>
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
        )}
      </main>
    </div>
  );
}