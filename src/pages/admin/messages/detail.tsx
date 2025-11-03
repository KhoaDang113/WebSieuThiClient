import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageList } from "@/components/admin/messages/MessageList";
import { ReplyForm } from "@/components/admin/messages/ReplyForm";
import { ArrowLeft, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock conversation data
const mockConversation = {
  id: 1,
  user_id: 101,
  user_name: "Nguyễn Văn A",
  user_email: "nguyvana@example.com",
  user_phone: "0912345678",
  created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  is_active: true,
};

export default function ConversationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [isActive, setIsActive] = useState(mockConversation.is_active);

  const handleEndConversation = () => {
    setIsActive(false);
  };

  const handleDeleteConversation = () => {
    // Handle delete logic
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] -m-6 bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between bg-card flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/admin/messages">
            <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {mockConversation.user_name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {mockConversation.user_email} • {mockConversation.user_phone}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Đang hoạt động" : "Kết thúc"}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleEndConversation}
                disabled={!isActive}
              >
                Kết thúc hội thoại
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={handleDeleteConversation}
              >
                Xóa hội thoại
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Area - Chỉ có 1 thanh cuộn ở đây */}
      <MessageList conversationId={id || "1"} />

      {/* Reply Form - Fixed at bottom */}
      <ReplyForm conversationId={id || "1"} isConversationActive={isActive} />
    </div>
  );
}
