
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Loader } from "lucide-react";
import { ChatMessage } from "@/lib/types";
import { sendChatMessage } from "@/services/n8nService";
import { toast } from "@/components/ui/sonner";

export default function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: "system",
    content: "Bem-vindo ao Dashboard! Como posso ajudar com seus dados hoje?",
    timestamp: new Date()
  }]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Rolagem automática para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const message = inputValue.trim();
    
    if (message && !isLoading) {
      // Adicionar mensagem do usuário ao chat
      const userMessage: ChatMessage = {
        role: "user",
        content: message,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputValue("");
      setIsLoading(true);

      try {
        // Enviar mensagem para o webhook N8N e obter resposta
        const botResponse = await sendChatMessage(message);
        setMessages(prev => [...prev, botResponse]);
      } catch (error) {
        console.error("Erro ao comunicar com N8N:", error);
        toast.error("Não foi possível obter resposta do assistente.");
        
        // Adicionar mensagem de erro no chat
        setMessages(prev => [...prev, {
          role: "system",
          content: "Desculpe, estou enfrentando problemas para processar sua solicitação. Por favor, tente novamente em alguns instantes.",
          timestamp: new Date()
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <Card className="flex flex-col h-[400px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Fale com os dados</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto flex-grow pb-2">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-lg max-w-[85%] ${
                message.role === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary"
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex w-full gap-2">
          <Input 
            placeholder="Digite sua mensagem..." 
            value={inputValue} 
            onChange={e => setInputValue(e.target.value)} 
            onKeyPress={handleKeyPress} 
            className="flex-grow"
            disabled={isLoading} 
          />
          <Button size="icon" onClick={handleSend} disabled={isLoading}>
            {isLoading ? 
              <Loader className="h-4 w-4 animate-spin" /> : 
              <SendHorizontal className="h-4 w-4" />
            }
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
