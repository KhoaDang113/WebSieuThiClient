import { Link } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ChevronRight } from "lucide-react"

// Mock data
const mockConversations = [
  {
    id: 1,
    user_id: 101,
    user_name: "Nguyễn Văn A",
    user_email: "nguyvana@example.com",
    last_message: "Sản phẩm này có giao hàng nhanh không?",
    last_message_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    is_active: true,
    unread_count: 2,
  },
  {
    id: 2,
    user_id: 102,
    user_name: "Trần Thị B",
    user_email: "tranthib@example.com",
    last_message: "Cảm ơn, mình đã nhận được hàng",
    last_message_at: new Date(Date.now() - 5 * 60 * 60 * 1000),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    is_active: false,
    unread_count: 0,
  },
  {
    id: 3,
    user_id: 103,
    user_name: "Lê Văn C",
    user_email: "levanc@example.com",
    last_message: "Muốn hỏi về chính sách đổi hàng",
    last_message_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    is_active: true,
    unread_count: 5,
  },
  {
    id: 4,
    user_id: 104,
    user_name: "Phạm Thị D",
    user_email: "phamthid@example.com",
    last_message: "Tôi muốn hủy đơn hàng",
    last_message_at: new Date(Date.now() - 12 * 60 * 60 * 1000),
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    is_active: true,
    unread_count: 1,
  },
]

interface ConversationListProps {
  search: string
  statusFilter: string
  dateFilter: string
}

export function ConversationList({ search, statusFilter, dateFilter }: ConversationListProps) {
  const filteredConversations = mockConversations.filter((conv) => {
    const matchSearch =
      search === "" ||
      conv.user_name.toLowerCase().includes(search.toLowerCase()) ||
      conv.user_email.toLowerCase().includes(search.toLowerCase())

    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && conv.is_active) ||
      (statusFilter === "inactive" && !conv.is_active)

    return matchSearch && matchStatus
  })

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-muted/50 px-6 py-3 border-b border-border">
        <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-foreground">
          <div className="col-span-3">Khách hàng</div>
          <div className="col-span-4">Tin nhắn gần nhất</div>
          <div className="col-span-2">Thời gian</div>
          <div className="col-span-2">Trạng thái</div>
          <div className="col-span-1">Hành động</div>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => (
            <div key={conv.id} className="px-6 py-4 hover:bg-muted/30 transition-colors">
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Customer Info */}
                <div className="col-span-3">
                  <div>
                    <p className="font-medium text-foreground">{conv.user_name}</p>
                    <p className="text-sm text-muted-foreground">{conv.user_email}</p>
                  </div>
                </div>

                {/* Last Message */}
                <div className="col-span-4">
                  <div className="flex items-center gap-2">
                    {conv.unread_count > 0 && (
                      <Badge
                        variant="default"
                        className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center p-0"
                      >
                        {conv.unread_count}
                      </Badge>
                    )}
                    <p className="text-sm text-foreground truncate">{conv.last_message}</p>
                  </div>
                </div>

                {/* Time */}
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(conv.last_message_at, { addSuffix: true, locale: vi })}
                  </p>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <Badge variant={conv.is_active ? "default" : "secondary"}>
                    {conv.is_active ? "Đang hoạt động" : "Kết thúc"}
                  </Badge>
                </div>

                {/* Action */}
                <div className="col-span-1 flex-shrink-0">
                  <Link to={`/admin/messages/${conv.id}`}>
                    <Button size="sm" variant="ghost" className="w-10 h-10 p-0">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-12 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Không tìm thấy cuộc hội thoại nào</p>
          </div>
        )}
      </div>
    </div>
  )
}

