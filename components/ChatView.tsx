import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { SendIcon, BotIcon, UserIcon } from './icons';

interface ChatViewProps {
  chatHistory: ChatMessage[];
  onSendMessage: (prompt: string) => void;
  isLoading: boolean;
}

const ChatMessageItem: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.type === 'user';
  const isAiText = message.type === 'ai-text';
  const isAiImage = message.type === 'ai-image';

  return (
    <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <BotIcon className="w-5 h-5 text-white" />
        </div>
      )}
      <div
        className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow ${
          isUser
            ? 'bg-purple-600 text-white rounded-br-none'
            : 'bg-gray-700 text-gray-200 rounded-bl-none'
        }`}
      >
        {isAiText && <p className="text-sm whitespace-pre-wrap">{message.content}</p>}
        {isUser && <p className="text-sm whitespace-pre-wrap">{message.content}</p>}
        {isAiImage && (
          <img src={message.content} alt="Generated" className="rounded-lg max-w-full h-auto" />
        )}
      </div>
       {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-gray-300" />
        </div>
      )}
    </div>
  );
};


const ChatView: React.FC<ChatViewProps> = ({ chatHistory, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl flex flex-col h-full">
      <div className="flex-grow p-4 overflow-y-auto">
        {chatHistory.map((msg, index) => (
          <ChatMessageItem key={index} message={msg} />
        ))}
        {isLoading && chatHistory.length > 0 && chatHistory[chatHistory.length -1].type === 'user' && (
            <div className="flex items-start gap-3 my-4 justify-start">
                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <BotIcon className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-700 p-3 rounded-2xl rounded-bl-none">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., 'add stars in the sky'"
            className="flex-grow bg-gray-700 border border-gray-600 rounded-full py-2 px-4 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-full p-2.5 transition-colors"
            aria-label="Send message"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;