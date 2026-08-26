import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatbotAssistant({ isOpen, onClose }: ChatbotAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am your CI AI Assistant. I can help you analyze costs, inventory, and optimization opportunities with CloudLine-AI. What would you like to know?',
      sender: 'bot',
      timestamp: new Date(Date.now() - 120000),
    },
    {
      id: '2',
      text: 'System availability?',
      sender: 'user',
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: '3',
      text: 'Current system availability is 99.97%, exceeding our 99.9% target. Payment Gateway leads with 99.98% uptime. All critical services are performing within SLA requirements across multi-cloud infrastructure.',
      sender: 'bot',
      timestamp: new Date(Date.now() - 30000),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const getBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('cost') || lowerInput.includes('price')) {
      return 'I can help you analyze costs across your cloud infrastructure. Current monthly spend is optimized with 12% savings through our CloudLine-AI recommendations. Would you like a detailed breakdown?';
    } else if (lowerInput.includes('incident') || lowerInput.includes('issue')) {
      return 'We have 3 recent incidents: 1 resolved high-priority Payment API issue, 1 ongoing User Database investigation, and 1 resolved Cache Layer connectivity issue. All are being tracked with root cause analysis.';
    } else if (lowerInput.includes('performance') || lowerInput.includes('metric')) {
      return 'Key performance metrics are strong: 99.97% availability, 145ms avg response time (5% improvement), 12 min mean time to identify (15% faster), and 92% security score. All metrics exceed targets.';
    } else if (lowerInput.includes('help')) {
      return 'I can assist you with:\n• Cost analysis & inventory management\n• System health & availability monitoring\n• Incident tracking & root cause analysis\n• Performance metrics & optimization\n• Multi-cloud infrastructure insights\n\nWhat would you like to explore?';
    } else {
      return 'I understand you\'re asking about your cloud infrastructure. Could you be more specific? I can help with costs, incidents, performance metrics, or system health.';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200 z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-white rounded-t-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#AE275F] flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900">CI AI Assistant</h3>
              <p className="text-xs text-gray-600">CloudLine-AI Cost & Inventory Help</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-gray-200"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <div ref={scrollRef} className="h-full overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'bot' ? 'bg-pink-100' : 'bg-gray-200'
                  }`}
                >
                  {message.sender === 'bot' ? (
                    <Bot className="w-5 h-5 text-[#AE275F]" />
                  ) : (
                    <User className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div className={`flex-1 ${message.sender === 'user' ? 'text-right' : ''}`}>
                  <div
                    className={`inline-block px-4 py-2 rounded-lg ${
                      message.sender === 'bot'
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-[#AE275F] text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{formatTime(message.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            placeholder="Ask Health AI Assistant..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            className="bg-[#AE275F] hover:bg-[#800F2F] text-white"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
