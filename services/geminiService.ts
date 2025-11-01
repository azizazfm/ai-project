import { GoogleGenAI, Modality } from "@google/genai";

// Fix: Use process.env.API_KEY directly as per the coding guidelines to resolve the 'import.meta.env' error.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateDescription(imageBase64: string, mimeType: string): Promise<string> {
  try {
    const model = 'gemini-2.5-flash';
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    };
    const textPart = {
      text: "Describe this image in detail. This description will be used as a base prompt for further image editing.",
    };

    const response = await ai.models.generateContent({
      model,
      contents: { parts: [imagePart, textPart] },
    });
    
    return response.text;
  } catch(error) {
    console.error("Error generating description:", error);
    throw new Error("Failed to communicate with the AI to generate a description.");
  }
}

export async function editImage(imageBase64: string, mimeType: string, prompt: string): Promise<string> {
  try {
    const model = 'gemini-2.5-flash-image';
    
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    };
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model,
      contents: { parts: [imagePart, textPart] },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Fix: Loop through parts to find the image data, as recommended by the guidelines.
    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    throw new Error("API did not return an image. It might be due to safety policies or an invalid prompt.");
  } catch(error) {
    console.error("Error editing image:", error);
    throw new Error("Failed to communicate with the AI to edit the image.");
  }
}

export async function generateImageFromText(prompt: string): Promise<{ base64: string, mimeType: string }> {
  try {
    const model = 'imagen-4.0-generate-001';
    const mimeType = 'image/jpeg';
    
    const response = await ai.models.generateImages({
        model,
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: mimeType,
          aspectRatio: '1:1',
        },
    });

    const image = response.generatedImages?.[0]?.image?.imageBytes;
    
    if (image) {
      return { base64: image, mimeType };
    }

    throw new Error("API did not return an image. It might be due to safety policies or an invalid prompt.");
  } catch(error) {
    console.error("Error generating image from text:", error);
    throw new Error("Failed to communicate with the AI to generate the image.");
  }
}
