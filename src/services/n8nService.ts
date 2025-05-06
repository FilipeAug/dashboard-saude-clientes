
import { ChatMessage } from "@/lib/types";

const N8N_WEBHOOK_URL = 'https://n8n-n8n.p6jvp3.easypanel.host/webhook/lovable';

export async function sendChatMessage(message: string): Promise<ChatMessage> {
  try {
    console.log("Sending message to N8N:", message);
    
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        timestamp: new Date().toISOString(),
      }),
      // Adding these options to prevent CORS and cache issues
      mode: 'cors',
      cache: 'no-cache',
    });

    if (!response.ok) {
      console.error("N8N webhook returned error status:", response.status);
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("N8N response:", data);
    
    return {
      role: 'system',
      content: data.response || 'Resposta recebida.',
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error sending message to N8N:', error);
    throw error; // Let the component handle the error
  }
}
