
import { ChatMessage } from "@/lib/types";

const N8N_WEBHOOK_URL = 'https://n8n-n8n.p6jvp3.easypanel.host/webhook/lovable';

export async function sendChatMessage(message: string): Promise<ChatMessage> {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      role: 'system',
      content: data.response || 'Resposta recebida.',
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error sending message to N8N:', error);
    return {
      role: 'system',
      content: 'Erro ao processar sua mensagem. Por favor, tente novamente mais tarde.',
      timestamp: new Date(),
    };
  }
}
