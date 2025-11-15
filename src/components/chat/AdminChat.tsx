"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { X, Upload } from "lucide-react";
import type { Message } from "@/types/chat.type";
import { getSocket } from "@/lib/socket";
import chatAdminService from "@/api/services/chatAdminService";
interface AdminMessage extends Message {
  file?: { name: string; type: string };
}

type AdminChatProps = {
  conversationId: string;
  onBack: () => void;
};

export function AdminChat({ conversationId, onBack }: AdminChatProps) {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    type: string;
    data?: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = getSocket();

    socket.emit("join_conversation", { conversation_id: conversationId });

    const onHistory = (history: AdminMessage[]) => {
      setMessages(history);
    };
    const onNewMessage = (msg: AdminMessage) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on("history.messages", onHistory);
    socket.on("message.new", onNewMessage);

    return () => {
      socket.off("history.messages", onHistory);
      socket.off("message.new", onNewMessage);
    };
  }, [conversationId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result as string;
          setSelectedFile({
            name: file.name,
            type: file.type,
            data: imageData,
          });
        };
        reader.readAsDataURL(file);
      } else {
        setSelectedFile({ name: file.name, type: file.type });
      }
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
              setSelectedFile({
                name: file.name,
                type: file.type,
                data: imageData,
              });
            };
            reader.readAsDataURL(file);
          }
          break;
        }
      }
    }
  };

  // const handleSend = () => {
  //   if (selectedFile) {
  //     if (selectedFile.type.startsWith("image/") && selectedFile.data) {
  //       setMessages([
  //         ...messages,
  //         {
  //           id: Date.now().toString(),
  //           text: input || "📷 Đã gửi ảnh",
  //           sender: "user",
  //           image: selectedFile.data,
  //           timestamp: new Date().toISOString(),
  //         },
  //       ]);
  //     } else {
  //       setMessages([
  //         ...messages,
  //         {
  //           id: Date.now().toString(),
  //           text: input || "📎 Đã gửi file",
  //           sender: "user",
  //           file: { name: selectedFile.name, type: selectedFile.type },
  //           timestamp: new Date().toISOString(),
  //         },
  //       ]);
  //     }
  //     setSelectedFile(null);
  //     setInput("");

  //     // Simulate admin response
  //     setTimeout(() => {
  //       setMessages((prev) => [
  //         ...prev,
  //         {
  //           id: Date.now().toString(),
  //           text: "Tôi đã nhận file/ảnh của bạn. Sẽ xem xét và phản hồi ngay!",
  //           sender: "admin",
  //           timestamp: new Date().toISOString(),
  //         },
  //       ]);
  //     }, 500);
  //   } else if (input.trim()) {
  //     setMessages([
  //       ...messages,
  //       {
  //         id: Date.now().toString(),
  //         text: input,
  //         sender: "user",
  //         timestamp: new Date().toISOString(),
  //       },
  //     ]);
  //     setInput("");

  //     // Simulate admin response
  //     setTimeout(() => {
  //       setMessages((prev) => [
  //         ...prev,
  //         {
  //           id: Date.now().toString(),
  //           text: "Cảm ơn bạn đã liên hệ! Quản trị viên sẽ phản hồi sớm nhất có thể.",
  //           sender: "admin",
  //           timestamp: new Date().toISOString(),
  //         },
  //       ]);
  //     }, 500);
  //   }
  // };
  const handleSend = async () => {
    const text = input.trim();

    if (!text && !selectedFile) return;

    const finalText =
      text ||
      (selectedFile
        ? selectedFile.type.startsWith("image/")
          ? "📷 Đã gửi ảnh"
          : "📎 Đã gửi file"
        : "");

    try {
      await chatAdminService.sendMessage(conversationId, finalText);
      setInput("");
      setSelectedFile(null);
    } catch (err) {
      console.error("Send message failed", err);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="w-96 h-[500px] flex flex-col bg-white">
      <div className="px-4 py-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-green-50 to-green-100">
        <div>
          <h3 className="font-semibold text-foreground">
            Chat với Quản trị viên
          </h3>
          <p className="text-xs text-muted-foreground">Hỗ trợ từ đội ngũ</p>
        </div>
        <button
          onClick={onBack}
          className="p-1 hover:bg-green-200 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender_type === "USER" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="max-w-xs">
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Uploaded"
                  className={`w-40 h-40 rounded-lg object-cover mb-2 ${
                    msg.sender_type === "USER"
                      ? "rounded-br-none"
                      : "rounded-bl-none"
                  }`}
                />
              )}
              {msg.file && (
                <div
                  className={`px-4 py-2 rounded-lg text-sm mb-2 flex items-center gap-2 ${
                    msg.sender_type === "USER"
                      ? "bg-green-500 text-white rounded-br-none"
                      : "bg-slate-100 text-foreground rounded-bl-none"
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span className="truncate">{msg.file.name}</span>
                </div>
              )}
              <div
                className={`px-4 py-2 rounded-lg text-sm ${
                  msg.sender_type === "USER"
                    ? "bg-green-500 text-white rounded-br-none"
                    : "bg-slate-100 text-foreground rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-3 border-t border-border">
        {selectedFile && (
          <div className="mb-3 flex gap-2">
            <div className="relative">
              {selectedFile.type.startsWith("image/") && selectedFile.data ? (
                <img
                  src={selectedFile.data}
                  alt="Preview"
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-slate-400" />
                </div>
              )}
              <button
                onClick={handleClearFile}
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
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-green-50 rounded border border-input transition-colors"
            title="Gửi file hoặc ảnh"
          >
            <Upload className="w-4 h-4 text-green-500" />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            onPaste={handlePaste}
            placeholder={
              selectedFile
                ? "Nhập chú thích..."
                : "Nhập tin nhắn hoặc dán ảnh..."
            }
            className="flex-1 px-3 py-2 rounded border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={handleSend}
            className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm font-medium"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
