import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ConversationList } from "@/components/admin/messages/ConversationList"
import { ConversationFilters } from "@/components/admin/messages/ConversationFilters"
import { Search } from "lucide-react"

export default function MessagesPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-6">
        <h1 className="text-3xl font-bold text-foreground">Quản lý Tin nhắn</h1>
        <p className="text-sm text-muted-foreground mt-1">Quản lý cuộc hội thoại và phản hồi tin nhắn từ khách hàng</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6 max-w-7xl">
          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên user, email..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filters */}
            <ConversationFilters
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
            />
          </div>

          {/* Conversations List */}
          <ConversationList search={search} statusFilter={statusFilter} dateFilter={dateFilter} />
        </div>
      </div>
    </div>
  )
}

