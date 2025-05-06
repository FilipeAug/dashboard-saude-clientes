
import { ChatMessage } from "@/lib/types";

const N8N_WEBHOOK_URL = 'https://n8n-n8n.p6jvp3.easypanel.host/webhook/lovable';

// Função para gerenciar o ID de sessão do chat
function getSessionId(): string {
  let sessionId = localStorage.getItem('chatSessionId');
  
  if (!sessionId) {
    // Criar um ID de sessão único combinando timestamp e string aleatória
    sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem('chatSessionId', sessionId);
  }
  
  return sessionId;
}

export async function sendChatMessage(message: string): Promise<ChatMessage> {
  try {
    // Obter o ID de sessão para manter contexto entre mensagens
    const sessionId = getSessionId();
    
    // Preparar dados no formato que o N8N espera
    const payload = {
      chatInput: message,
      sessionId: sessionId,
      timestamp: new Date().toISOString()
    };
    
    console.log("Enviando para N8N:", payload);
    
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
    });

    if (!response.ok) {
      console.error("Erro na resposta do N8N:", response.status);
      throw new Error(`Erro no servidor: ${response.status}`);
    }

    const data = await response.json();
    console.log("Resposta do N8N:", data);
    
    // Retornar a mensagem formatada para o chat
    return {
      role: 'system',
      content: data.response || 'Não foi possível obter uma resposta válida.',
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Erro ao enviar mensagem para N8N:', error);
    throw error;
  }
}
