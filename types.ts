
export interface ImageFile {
  base64: string;
  mimeType: string;
}

export type ChatMessage = {
  type: 'user' | 'ai-text' | 'ai-image';
  content: string;
};
