import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ConversationFiltersProps {
  statusFilter: string
  setStatusFilter: (value: string) => void
  dateFilter: string
  setDateFilter: (value: string) => void
}

export function ConversationFilters({
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
}: ConversationFiltersProps) {
  return (
    <div className="flex gap-4">
      {/* Status Filter */}
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Lọc theo trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value="active">Đang hoạt động</SelectItem>
          <SelectItem value="inactive">Kết thúc</SelectItem>
        </SelectContent>
      </Select>

      {/* Date Filter */}
      <Select value={dateFilter} onValueChange={setDateFilter}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Lọc theo thời gian" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả thời gian</SelectItem>
          <SelectItem value="today">Hôm nay</SelectItem>
          <SelectItem value="week">Tuần này</SelectItem>
          <SelectItem value="month">Tháng này</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

