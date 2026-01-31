"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Sparkles, Loader2, Bot, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { sendChatMessage } from "@/lib/api"

interface Message {
    role: "user" | "ai"
    content: string
}

interface StageChatDrawerProps {
    isOpen: boolean
    onClose: () => void
    stageId: string
    stageLabel: string
    cropType: string
}

export function StageChatDrawer({ isOpen, onClose, stageId, stageLabel, cropType }: StageChatDrawerProps) {
    const { user } = useAuth()
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    role: "ai",
                    content: `Hello! I'm your CropMind assistant. How can I help you with the **${stageLabel}** stage of your **${cropType}** today?`
                }
            ])
        }
    }, [isOpen, stageLabel, cropType])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || !user?.email || loading) return

        const userMsg = input.trim()
        setInput("")
        setMessages(prev => [...prev, { role: "user", content: userMsg }])

        try {
            setLoading(true)
            const response = await sendChatMessage(user.email, userMsg, stageId)
            setMessages(prev => [...prev, { role: "ai", content: response.answer }])
        } catch (err) {
            console.error("Chat failed:", err)
            setMessages(prev => [...prev, { role: "ai", content: "Sorry, I encountered an error. Please try again." }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
                <SheetHeader className="p-6 border-b">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <SheetTitle>Stage Advice: {stageLabel}</SheetTitle>
                            <SheetDescription>
                                Contextual AI support for {cropType}
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <ScrollArea className="flex-1 p-6">
                    <div className="space-y-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                <Avatar className="h-8 w-8 shrink-0">
                                    {msg.role === "ai" ? (
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            <Bot className="h-4 w-4" />
                                        </AvatarFallback>
                                    ) : (
                                        <AvatarFallback className="bg-muted text-muted-foreground">
                                            <UserIcon className="h-4 w-4" />
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div className={`rounded-2xl p-3 text-sm max-w-[85%] ${msg.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                        : "bg-muted rounded-tl-none"
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex gap-3">
                                <Avatar className="h-8 w-8 animate-pulse">
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        <Bot className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="bg-muted rounded-2xl p-3 rounded-tl-none">
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                <div className="p-6 border-t mt-auto">
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="flex gap-2"
                    >
                        <Input
                            placeholder={`Ask about ${stageLabel}...`}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                            className="flex-1"
                        />
                        <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    )
}
