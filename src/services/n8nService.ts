
import { ChatMessage } from "@/lib/types";

const N8N_WEBHOOK_URL = 'https://n8n-n8n.p6jvp3.easypanel.host/webhook/lovable';

// Function to generate a unique session ID or retrieve it from localStorage
function getSessionId(): string {
  // Check if we already have a session ID in localStorage
  let sessionId = localStorage.getItem('chatSessionId');
  
  // If not, create a new one and store it
  if (!sessionId) {
    sessionId = `session_${new Date().getTime()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('chatSessionId', sessionId);
  }
  
  return sessionId;
}

export async function sendChatMessage(message: string): Promise<ChatMessage> {
  try {
    console.log("Sending message to N8N:", message);
    
    // Get the session ID for this chat interaction
    const sessionId = getSessionId();
    console.log("Using session ID:", sessionId);
    
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatInput: message, // Changed from 'message' to 'chatInput' as expected by N8N
        sessionId: sessionId, // Added sessionId to maintain context
        timestamp: new Date().toISOString() // Keep timestamp for logging purposes
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
