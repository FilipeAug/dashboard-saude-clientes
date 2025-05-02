
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/lib/types";
import { sendChatMessage } from "@/services/n8nService";
import { MessageCircle, Send } from "lucide-react";
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
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="p-2 bg-muted/10">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Chat de Dados</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-2 pt-1">
        <ScrollArea className="h-[180px]">
          <div className="space-y-2">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-2 py-1 text-xs ${
                    msg.role === 'user' 
                      ? 'bg-primary/10 text-foreground' 
                      : 'bg-muted/20 text-foreground'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t border-muted/20 p-2">
        <form onSubmit={handleSendMessage} className="flex w-full gap-1">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Perguntar..."
            disabled={isLoading}
            className="flex-1 h-7 text-xs"
          />
          <Button type="submit" disabled={isLoading} size="sm" className="h-7 px-2">
            <Send className="h-3 w-3" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
