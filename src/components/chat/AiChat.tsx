"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { X, ImageIcon, Loader2 } from "lucide-react";
import { chatWithAI } from "@/lib/chatService";
import type { Message } from "@/types/chat.type";

export function AIChat({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Xin chào! Tôi là trợ lý AI của siêu thị. Tôi có thể giúp bạn tìm sản phẩm, tư vấn mua sắm, hoặc giải đáp thắc mắc. Bạn cần hỗ trợ gì?",
      sender: "ai",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Conversation history for context
  const conversationHistory = useRef<
    Array<{ role: "user" | "model"; parts: Array<{ text: string }> }>
  >([]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setSelectedImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          e.preventDefault();
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const imageData = event.target?.result as string;
              setSelectedImage(imageData);
            };
            reader.readAsDataURL(file);
          }
          break;
        }
      }
    }
  };

  const handleSend = async () => {
    if (isLoading) return;

    const messageText = input.trim();
    if (!messageText && !selectedImage) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: selectedImage ? messageText || "📷 Đã gửi ảnh" : messageText,
      sender: "user",
      image: selectedImage || undefined,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Update conversation history
    conversationHistory.current.push({
      role: "user",
      parts: [{ text: messageText || "Phân tích ảnh này" }],
    });

    // Clear input
    setInput("");
    const imageToSend = selectedImage;
    setSelectedImage(null);

    // Call AI
    setIsLoading(true);
    try {
      const aiResponse = await chatWithAI(
        messageText,
        imageToSend || undefined,
        conversationHistory.current
      );

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: "ai",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Update conversation history
      conversationHistory.current.push({
        role: "model",
        parts: [{ text: aiResponse }],
      });
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
        sender: "ai",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="w-96 h-[500px] flex flex-col bg-white">
      <div className="px-4 py-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100">
        <div>
          <h3 className="font-semibold text-foreground">Chat với AI</h3>
          <p className="text-xs text-muted-foreground">Hỗ trợ tự động 24/7</p>
        </div>
        <button
          onClick={onBack}
          className="p-1 hover:bg-blue-200 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="max-w-xs">
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Uploaded"
                  className={`w-40 h-40 rounded-lg object-cover mb-2 ${
                    msg.sender === "user"
                      ? "rounded-br-none"
                      : "rounded-bl-none"
                  }`}
                />
              )}
              <div
                className={`px-4 py-2 rounded-lg text-sm ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-slate-100 text-foreground rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs">
              <div className="px-4 py-2 rounded-lg text-sm bg-slate-100 text-foreground rounded-bl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang suy nghĩ...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-3 border-t border-border">
        {selectedImage && (
          <div className="mb-3 flex gap-2">
            <div className="relative">
              <img
                src={selectedImage}
                alt="Preview"
                className="w-16 h-16 rounded-lg object-cover"
              />
              <button
                onClick={handleClearImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="p-2 hover:bg-blue-50 rounded border border-input transition-colors disabled:opacity-50"
            title="Gửi ảnh"
          >
            <ImageIcon className="w-4 h-4 text-blue-500" />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            onPaste={handlePaste}
            disabled={isLoading}
            placeholder={
              selectedImage
                ? "Nhập chú thích..."
                : "Nhập tin nhắn hoặc dán ảnh..."
            }
            className="flex-1 px-3 py-2 rounded border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !selectedImage)}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "..." : "Gửi"}
          </button>
        </div>
      </div>
    </div>
  );
}
