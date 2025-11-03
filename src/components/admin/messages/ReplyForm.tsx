import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip } from "lucide-react";

interface ReplyFormProps {
  conversationId: string;
  isConversationActive: boolean;
}

export function ReplyForm({
  conversationId,
  isConversationActive,
}: ReplyFormProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      // TODO: Sử dụng conversationId để gửi tin nhắn đến API
      console.log("Sending message to conversation:", conversationId);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Nhấn Enter để gửi, Shift+Enter để xuống dòng
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isConversationActive) {
    return (
      <div className="border-t border-border p-4 bg-card flex-shrink-0">
        <p className="text-center text-sm text-muted-foreground">
          Cuộc hội thoại này đã kết thúc. Bạn không thể gửi tin nhắn mới.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-border p-4 bg-card flex-shrink-0">
      {/* Input với nút đính kèm trong cùng dòng giống Messenger */}
      <div className="flex items-end gap-2">
        {/* Nút đính kèm file */}
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground h-10 w-10 p-0 flex-shrink-0"
          title="Đính kèm file"
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        {/* Textarea */}
        <div className="flex-1">
          <Textarea
            placeholder="Nhập tin nhắn... (Enter để gửi, Shift+Enter để xuống dòng)"
            className="resize-none min-h-[40px] max-h-32"
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
