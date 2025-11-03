import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Lock, Unlock } from "lucide-react";

interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: "admin" | "staff" | "customer";
  status: "active" | "locked";
  created_at: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    full_name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0912345678",
    role: "admin",
    status: "active",
    created_at: "2024-01-15",
  },
  {
    id: "2",
    full_name: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "0987654321",
    role: "staff",
    status: "active",
    created_at: "2024-02-20",
  },
  {
    id: "3",
    full_name: "Lê Văn C",
    email: "levanc@example.com",
    phone: "0901234567",
    role: "customer",
    status: "locked",
    created_at: "2024-03-10",
  },
  {
    id: "4",
    full_name: "Phạm Thị D",
    email: "phamthid@example.com",
    phone: "0923456789",
    role: "customer",
    status: "active",
    created_at: "2024-03-25",
  },
  {
    id: "5",
    full_name: "Hoàng Văn E",
    email: "hoangvane@example.com",
    phone: "0934567890",
    role: "staff",
    status: "active",
    created_at: "2024-04-05",
  },
];

const roleColors = {
  admin: "bg-red-100 text-red-800",
  staff: "bg-blue-100 text-blue-800",
  customer: "bg-green-100 text-green-800",
};

const roleLabels = {
  admin: "Admin",
  staff: "Nhân viên",
  customer: "Khách hàng",
};

const statusColors = {
  active: "bg-green-100 text-green-800",
  locked: "bg-red-100 text-red-800",
};

const statusLabels = {
  active: "Hoạt động",
  locked: "Bị khóa",
};

interface UserTableProps {
  searchTerm: string;
  roleFilter: string;
}

export function UserManagementTable({
  searchTerm,
  roleFilter,
}: UserTableProps) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [toggleStatusUserId, setToggleStatusUserId] = useState<string | null>(
    null
  );

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa user này?")) {
      setUsers(users.filter((user) => user.id !== id));
      setDeleteUserId(null);
    }
  };

  const handleToggleStatus = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (
      user &&
      window.confirm(
        `Bạn có chắc chắn muốn ${
          user.status === "active" ? "khóa" : "mở khóa"
        } user này?`
      )
    ) {
      setUsers(
        users.map((user) =>
          user.id === id
            ? {
                ...user,
                status: user.status === "active" ? "locked" : "active",
              }
            : user
        )
      );
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          Danh sách User ({filteredUsers.length})
        </h3>
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
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="font-medium text-foreground">{user.id}</td>
                  <td className="text-foreground">{user.full_name}</td>
                  <td className="text-muted-foreground">{user.email}</td>
                  <td className="text-muted-foreground">{user.phone}</td>
                  <td>
                    <Badge className={roleColors[user.role]}>
                      {roleLabels[user.role]}
                    </Badge>
                  </td>
                  <td>
                    <Badge className={statusColors[user.status]}>
                      {statusLabels[user.status]}
                    </Badge>
                  </td>
                  <td className="text-muted-foreground">{user.created_at}</td>
                  <td>
                    <div className="flex gap-2 whitespace-nowrap flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 w-20 flex-shrink-0"
                      >
                        <Edit2 className="w-4 h-4" />
                        Sửa
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 w-24 flex-shrink-0"
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {user.status === "active" ? (
                          <>
                            <Lock className="w-4 h-4" />
                            Khóa
                          </>
                        ) : (
                          <>
                            <Unlock className="w-4 h-4" />
                            Mở khóa
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-destructive hover:text-destructive w-16 flex-shrink-0"
                        onClick={() => handleDelete(user.id)}
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

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Không tìm thấy user nào</p>
        </div>
      )}
    </Card>
  );
}

