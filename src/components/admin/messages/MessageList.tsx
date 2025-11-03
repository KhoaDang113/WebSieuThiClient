import { useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  message_id: number;
  conversation_id: string;
  sender_type: "user" | "admin";
  sender_name: string;
  content: string;
  created_at: Date;
  is_read: boolean;
}

// Mock messages
const mockMessages: Message[] = [
  {
    id: 1,
    message_id: 1,
    conversation_id: "1",
    sender_type: "user",
    sender_name: "Nguyễn Văn A",
    content: "Xin chào, tôi có câu hỏi về sản phẩm này",
    created_at: new Date(Date.now() - 60 * 60 * 1000),
    is_read: true,
  },
  {
    id: 2,
    message_id: 2,
    conversation_id: "1",
    sender_type: "admin",
    sender_name: "Admin",
    content: "Xin chào! Tôi có thể giúp gì cho bạn?",
    created_at: new Date(Date.now() - 55 * 60 * 1000),
    is_read: true,
  },
  {
    id: 3,
    message_id: 3,
    conversation_id: "1",
    sender_type: "user",
    sender_name: "Nguyễn Văn A",
    content: "Sản phẩm này có giao hàng nhanh không?",
    created_at: new Date(Date.now() - 50 * 60 * 1000),
    is_read: true,
  },
  {
    id: 4,
    message_id: 4,
    conversation_id: "1",
    sender_type: "admin",
    sender_name: "Admin",
    content:
      "Có chứ! Chúng tôi cung cấp giao hàng nhanh trong vòng 2-4 giờ tại các khu vực thành phố lớn. Bạn ở đâu?",
    created_at: new Date(Date.now() - 45 * 60 * 1000),
    is_read: true,
  },
  {
    id: 5,
    message_id: 5,
    conversation_id: "1",
    sender_type: "user",
    sender_name: "Nguyễn Văn A",
    content: "Tôi ở Hà Nội, phường Thanh Xuân. Giá giao hàng bao nhiêu?",
    created_at: new Date(Date.now() - 30 * 60 * 1000),
    is_read: true,
  },
  {
    id: 6,
    message_id: 6,
    conversation_id: "1",
    sender_type: "admin",
    sender_name: "Admin",
    content:
      "Giao hàng miễn phí cho đơn hàng từ 50.000 đồng. Với bạn, giao hàng sẽ là miễn phí!",
    created_at: new Date(Date.now() - 25 * 60 * 1000),
    is_read: false,
  },
];

interface MessageListProps {
  conversationId: string;
}

export function MessageList({ conversationId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mockMessages]);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-4 bg-muted/30">
      {mockMessages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-3",
            message.sender_type === "admin" && "flex-row-reverse"
          )}
        >
          {/* Avatar placeholder */}
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold text-white",
              message.sender_type === "admin" ? "bg-blue-600" : "bg-green-600"
            )}
          >
            {message.sender_name.charAt(0)}
          </div>

          {/* Message content */}
          <div
            className={cn(
              "flex flex-col gap-1 max-w-md",
              message.sender_type === "admin" && "items-end"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">
                {message.sender_name}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(message.created_at, {
                  addSuffix: true,
                  locale: vi,
                })}
              </span>
            </div>
            <div
              className={cn(
                "px-4 py-2 rounded-lg break-words",
                message.sender_type === "admin"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-card border border-border rounded-bl-none"
              )}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
