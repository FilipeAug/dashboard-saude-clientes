
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/lib/types";
import { sendChatMessage } from "@/services/n8nService";
import { MessageCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'system',
      content: 'Olá! Como posso ajudar você com os dados hoje?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await sendChatMessage(input);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'Erro ao processar sua mensagem. Por favor, tente novamente.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="card-gradient overflow-hidden flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Chat de Dados
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0">
        <ScrollArea className="h-[400px] p-4">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[75%] rounded-lg p-3 ${
                    msg.role === 'user' 
                      ? 'bg-primary/20 text-white' 
                      : 'bg-secondary text-white'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {msg.timestamp.toLocaleTimeString('pt-BR')}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t border-secondary p-4">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite uma pergunta sobre os dados..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar"}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
