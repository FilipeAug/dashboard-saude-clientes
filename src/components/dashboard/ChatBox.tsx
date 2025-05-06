
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
    content: "Bem-vindo ao Dashboard V4 Company! Como posso ajudar?",
    timestamp: new Date()
  }]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (inputValue.trim() && !isLoading) {
      const newUserMessage: ChatMessage = {
        role: "user",
        content: inputValue,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newUserMessage]);
      setInputValue("");
      setIsLoading(true);

      try {
        // Send message to N8N webhook and get response
        const botResponse = await sendChatMessage(inputValue.trim());
        setMessages(prev => [...prev, botResponse]);
      } catch (error) {
        console.error("Error communicating with N8N:", error);
        toast.error("Não foi possível obter resposta do assistente IA.");
        
        // Add fallback message
        setMessages(prev => [...prev, {
          role: "system",
          content: "Desculpe, não consegui processar sua solicitação. Por favor, tente novamente mais tarde.",
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
    <Card className="card-gradient flex flex-col h-[400px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Fale com os dados</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto flex-grow pb-2">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-lg max-w-[85%] ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                <p className="text-sm">{message.content}</p>
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
            {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
