import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Loader2, User, Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are HidayahAI, an Islamic guidance assistant created by Murshid Alam. 

Rules:
- Give concise, clear answers (2-4 paragraphs max)
- Avoid using markdown formatting like **, ##, or bullet points with *
- Write in plain, flowing prose
- Include Quran/Hadith references when relevant but keep them brief
- If someone asks who created you or who is the founder or who developed you, respond: "I was created by Mohammed Murshid Alam"
- If asked non-Islamic questions, say: "I am HidayahAI, designed for Islamic guidance based on Quran and Hadith only."
- Be warm, compassionate, and respectful`;

// Format AI response to remove markdown artifacts
const formatResponse = (text: string): string => {
  return text
    .replace(/\*\*/g, '') // Remove bold markers
    .replace(/\*/g, '') // Remove italic markers
    .replace(/###?\s*/g, '') // Remove headers
    .replace(/^-\s+/gm, '• ') // Convert markdown lists to bullets
    .replace(/^\d+\.\s+/gm, (match) => match) // Keep numbered lists
    .replace(/>\s*/g, '') // Remove blockquote markers
    .replace(/`/g, '') // Remove code markers
    .trim();
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);


    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "HidayahAI",
        },
        body: JSON.stringify({
          model: "tngtech/deepseek-r1t2-chimera:free",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
            userMessage,
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const rawContent = data.choices[0]?.message?.content || "I apologize, I couldn't generate a response. Please try again.";
      
      const assistantMessage: Message = {
        role: "assistant",
        content: formatResponse(rawContent),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, there was an error processing your request. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col py-8 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 max-w-4xl flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="text-center mb-4 flex-shrink-0">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            HidayahAI
          </h1>
          <p className="text-muted-foreground text-sm">
            Islamic guidance based on Quran & Hadith
          </p>
        </div>

        {/* Chat Area */}
        <Card className="card-glass flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Messages Container - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center p-6">
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center mx-auto">
                    <Bot className="w-8 h-8 text-indigo-400" />
                  </div>
                  <p className="text-muted-foreground text-sm max-w-md">
                    Assalamu Alaikum! I'm HidayahAI. Ask me about Quran, Hadith, or Islamic guidance.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      "What does Quran say about patience?",
                      "Hadith about kindness",
                      "How to perform Wudu?",
                    ].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        className="text-xs border-indigo-500/30 hover:bg-indigo-500/20"
                        onClick={() => setInput(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                          : "bg-muted/50 border border-border/50"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-muted/50 border border-border/50 rounded-2xl px-4 py-3">
                      <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border/50 flex-shrink-0">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Quran, Hadith, or Islamic guidance..."
                className="min-h-[50px] max-h-[100px] resize-none bg-background/50 border-indigo-500/30 focus:border-indigo-500"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-4"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
