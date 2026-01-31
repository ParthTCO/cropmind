"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { sendChatMessage } from "@/lib/api"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const exampleConversations = [
  {
    user: "पान पिवळी पडली आहेत",
    assistant: "हे नायट्रोजनची कमतरता असू शकते. सध्याच्या वाढीच्या टप्प्यात (दिवस 32) पानांचे पिवळेपणा सामान्यतः नायट्रोजनच्या कमतरतेमुळे होते. मी शिफारस करतो: 50 किलो/हेक्टर युरिया लावा. सर्वोत्तम वेळ: सकाळी 6-8 वाजता जेव्हा माती ओली असते.",
  },
  {
    user: "बारिश के बाद क्या करूं?",
    assistant: "कल बारिश की संभावना 60% है (15-20mm अपेक्षित)। मेरी सलाह:\\n\\n1. बारिश के दौरान सिंचाई रोकें\\n2. बारिश के बाद खेत में जल निकासी की जांच करें\\n3. बारिश रुकने के 24 घंटे बाद नाइट्रोजन उर्वरक लगाएं\\n4. कीट संक्रमण के लिए निगरानी करें क्योंकि नमी फंगल रोग बढ़ा सकती है",
  },
]

const suggestedQuestions = [
  "When should I irrigate next?",
  "How to identify pest attacks?",
  "Best fertilizer for current stage?",
  "Weather impact on my crop?",
]

export default function ChatPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "नमस्ते! मैं CropMind AI आपका खेती सहायक हूं। आप हिंदी, मराठी या English में पूछ सकते हैं। आज मैं आपकी कैसे मदद कर सकता हूं?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading || !user?.email) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await sendChatMessage(user.email, input)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.answer,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      console.error("Chat error:", err)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Chat header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Bot className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-semibold">CropMind AI Assistant</h2>
          <p className="text-sm text-muted-foreground">Ask anything about farming in your language</p>
        </div>
      </div>

      {/* Messages area */}
      <Card className="flex-1 overflow-hidden border-border/50">
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="rounded-2xl bg-muted px-4 py-3">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Suggested questions */}
          {messages.length <= 2 && (
            <div className="border-t border-border p-4">
              <p className="mb-3 text-sm text-muted-foreground">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => setInput(question)}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-sm transition-colors hover:bg-muted"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about pests, irrigation, fertilizer, crop issues..."
                disabled={!user?.email}
                className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading || !user?.email}
                size="icon"
                className="h-12 w-12 shrink-0 rounded-xl"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            {!user?.email && (
              <p className="mt-2 text-xs text-muted-foreground">Please sign in to use the chat</p>
            )}
          </div>
        </div>
      </Card>

      {/* Example conversations preview */}
      {messages.length <= 1 && (
        <div className="mt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span>Example conversations in multiple languages</span>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {exampleConversations.map((conv, index) => (
              <Card key={index} className="border-border/50 p-4">
                <p className="text-sm font-medium">Farmer: &ldquo;{conv.user}&rdquo;</p>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                  AI: &ldquo;{conv.assistant}&rdquo;
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
