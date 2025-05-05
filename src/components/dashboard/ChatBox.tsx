
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import { ChatMessage } from "@/lib/types";

export default function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "system",
      content: "Bem-vindo ao Dashboard V4 Company! Como posso ajudar?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      const newUserMessage: ChatMessage = {
        role: "user",
        content: inputValue,
        timestamp: new Date(),
      };
      
      setMessages([...messages, newUserMessage]);
      setInputValue("");
      
      // Simulate response after a short delay
      setTimeout(() => {
        const botResponse: ChatMessage = {
          role: "system",
          content: "Obrigado por sua mensagem. Um de nossos agentes entrará em contato em breve.",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
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
        <CardTitle className="text-lg">Chat de Suporte</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto flex-grow pb-2">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-[85%] ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex w-full gap-2">
          <Input
            placeholder="Digite sua mensagem..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-grow"
          />
          <Button size="icon" onClick={handleSend}>
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
