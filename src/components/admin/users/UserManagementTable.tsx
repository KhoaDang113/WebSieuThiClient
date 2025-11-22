import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Lock, Unlock, Loader2 } from "lucide-react";
import { userService } from "@/api";
import type { User, UserRole } from "@/types";

const roleColors = {
  user: "bg-green-100 text-green-800",
  staff: "bg-blue-100 text-blue-800",
  admin: "bg-red-100 text-red-800",
};

const roleLabels = {
  user: "Khách hàng",
  staff: "Nhân viên",
  admin: "Admin",
};

interface UserTableProps {
  searchTerm: string;
  roleFilter: string;
}

export function UserManagementTable({
  searchTerm,
  roleFilter,
}: UserTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
        role: roleFilter !== "all" ? (roleFilter as UserRole) : undefined,
      };

      const response = await userService.getAllUsers(params);
      setUsers(response.users);
      setPagination(response.pagination);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Không thể tải danh sách user");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when filters or pagination changes
  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter, pagination.page]);

  // Handle toggle user status (lock/unlock)
  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    const user = users.find((u) => u._id === userId);
    if (!user) return;

    const action = currentStatus ? "khóa" : "mở khóa";
    if (!window.confirm(`Bạn có chắc chắn muốn ${action} user "${user.name}"?`)) {
      return;
    }

    try {
      setActionLoading(userId);
      
      if (currentStatus) {
        await userService.lockUser(userId);
      } else {
        await userService.unlockUser(userId);
      }

      // Refresh users list after action
      await fetchUsers();
    } catch (err: any) {
      console.error("Error toggling user status:", err);
      alert(
        err.response?.data?.message || `Không thể ${action} user. Vui lòng thử lại.`
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Handle delete user (placeholder - need to implement backend endpoint)
  const handleDelete = (id: string) => {
    const user = users.find((u) => u._id === id);
    if (!user) return;
    
    alert(`Chức năng xóa user "${user.name}" chưa được implement ở backend`);
  };

  // Format date
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  if (loading && users.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Đang tải danh sách user...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchUsers}>Thử lại</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Danh sách User ({pagination.total})
        </h3>
        {loading && (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        )}
      </div>
      
      <div className="w-full overflow-x-auto">
        <div className="max-h-[600px] overflow-y-auto border rounded-lg">
          <table className="admin-table w-full">
            <thead className="sticky top-0 bg-background">
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="font-medium text-foreground">
                    {user._id.slice(-6)}
                  </td>
                  <td className="text-foreground">{user.name}</td>
                  <td className="text-muted-foreground">
                    {user.email || "N/A"}
                  </td>
                  <td className="text-muted-foreground">
                    {user.phone || "N/A"}
                  </td>
                  <td>
                    <Badge className={roleColors[user.role]}>
                      {roleLabels[user.role]}
                    </Badge>
                  </td>
                  <td>
                    <Badge
                      className={
                        user.isLocked
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {user.isLocked ? "Bị khóa" : "Hoạt động"}
                    </Badge>
                  </td>
                  <td className="text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </td>
                  <td>
                    <div className="flex gap-2 whitespace-nowrap flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 w-20 flex-shrink-0"
                        disabled
                      >
                        <Edit2 className="w-4 h-4" />
                        Sửa
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 w-24 flex-shrink-0"
                        onClick={() => handleToggleStatus(user._id, !user.isLocked)}
                        disabled={actionLoading === user._id}
                      >
                        {actionLoading === user._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : user.isLocked ? (
                          <>
                            <Unlock className="w-4 h-4" />
                            Mở khóa
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            Khóa
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-destructive hover:text-destructive w-16 flex-shrink-0"
                        onClick={() => handleDelete(user._id)}
                        disabled
                      >
                        <Trash2 className="w-4 h-4" />
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Không tìm thấy user nào</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Trang {pagination.page} / {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={pagination.page === 1 || loading}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={pagination.page === pagination.totalPages || loading}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

