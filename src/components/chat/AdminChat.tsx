"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { X, Upload, FileIcon, Download, Smile } from "lucide-react";
import type { Message } from "@/types/chat.type";
import { getSocket } from "@/lib/socket";
import chatAdminService from "@/api/services/chatAdminService";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";

interface Attachment {
  url: string;
  type: "image" | "file";
  name?: string;
  size?: number;
  mimetype?: string;
}

interface AdminMessage extends Message {
  file?: { name: string; type: string };
  attachments?: Attachment[];
}

type AdminChatProps = {
  conversationId: string;
  onBack: () => void;
};

export function AdminChat({ conversationId, onBack }: AdminChatProps) {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [input, setInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      // Limit to 5 files
      const newFiles = [...selectedFiles, ...filesArray].slice(0, 5);
      setSelectedFiles(newFiles);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  const handleSend = async () => {
    const text = input.trim();

    if (!text && selectedFiles.length === 0) return;

    try {
      await chatAdminService.sendMessage(
        conversationId,
        text,
        selectedFiles.length > 0 ? selectedFiles : undefined
      );
      setInput("");
      setSelectedFiles([]);
      setShowEmojiPicker(false);
    } catch (err) {
      console.error("Send message failed", err);
    }
  };

  return (
    <div className="w-80 h-[450px] flex flex-col bg-white">
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
            className={`flex ${msg.sender_type === "USER" ? "justify-end" : "justify-start"
              }`}
          >
            <div className="max-w-[240px]">
              {/* Text message */}
              {msg.text && (
                <div
                  className={`px-4 py-2 rounded-lg text-sm ${msg.sender_type === "USER"
                    ? "bg-green-500 text-white rounded-br-none"
                    : "bg-slate-100 text-foreground rounded-bl-none"
                    }`}
                >
                  {msg.text}
                </div>
              )}

              {/* Attachments */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="flex flex-col gap-2 mt-1">
                  {msg.attachments.map((attachment, idx) => (
                    <div key={idx}>
                      {attachment.type === "image" ? (
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <img
                            src={attachment.url}
                            alt={attachment.name || "Image"}
                            className="max-w-[240px] rounded-lg border border-border hover:opacity-90 transition-opacity cursor-pointer"
                          />
                        </a>
                      ) : (
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={attachment.name}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-muted/50 transition-colors ${msg.sender_type === "USER"
                            ? "bg-green-500 text-white border-green-400"
                            : "bg-slate-100 border-slate-200"
                            }`}
                        >
                          <FileIcon className="w-5 h-5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {attachment.name || "File"}
                            </p>
                            {attachment.size && (
                              <p className="text-xs opacity-75">
                                {formatFileSize(attachment.size)}
                              </p>
                            )}
                          </div>
                          <Download className="w-4 h-4 flex-shrink-0" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="px-3 py-3 border-t border-border relative">
        {/* File preview */}
        {selectedFiles.length > 0 && (
          <div className="mb-3 flex gap-2 flex-wrap">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="relative group bg-slate-100 rounded-lg p-2 flex items-center gap-2 max-w-[200px]"
              >
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <FileIcon className="w-6 h-6 text-gray-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-16 left-4 z-50">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        <div className="flex gap-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.csv,.zip,.rar"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={selectedFiles.length >= 5}
            className="p-1.5 hover:bg-green-50 rounded border border-input transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Gửi file hoặc ảnh"
          >
            <Upload className="w-4 h-4 text-green-500" />
          </button>
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-1.5 hover:bg-green-50 rounded border border-input transition-colors"
            title="Chọn emoji"
          >
            <Smile className="w-4 h-4 text-green-500" />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-2 py-1.5 rounded border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() && selectedFiles.length === 0}
            className="px-2 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
