import React from 'react';
import ImageViewer from './ImageViewer';
import ChatView from './ChatView';
import { ChatMessage } from '../types';

interface MainContentProps {
  imageUrl: string | null;
  chatHistory: ChatMessage[];
  onSendMessage: (prompt: string) => void;
  isLoading: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ imageUrl, chatHistory, onSendMessage, isLoading }) => {
  return (
    <div className="flex flex-col md:flex-row h-full max-h-[calc(100vh-150px)] gap-4">
      <div className="flex-1 min-h-0 md:min-w-0">
         <ImageViewer imageUrl={imageUrl} />
      </div>
      <div className="flex-1 min-h-0 md:min-w-0">
        <ChatView 
          chatHistory={chatHistory} 
          onSendMessage={onSendMessage} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
};

export default MainContent;