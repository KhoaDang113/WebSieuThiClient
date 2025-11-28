import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink } from "lucide-react";
import commentService from "@/api/services/commentService";
import type { CommentResponse } from "@/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CommentsPage() {
  const [comments, setComments] = useState<CommentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadComments = async (page: number = 1) => {
    try {
      setLoading(true);
      // Note: Backend doesn't have getAllCommentsForAdmin endpoint
      // We'll use getCommentsByProduct but without product_id filter
      // This is a limitation - ideally backend should provide admin endpoint
      // For now, we'll show a message to use product pages
      setComments({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments(1);
  }, []);

  const handleDeleteClick = (commentId: string) => {
    setSelectedCommentId(commentId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCommentId) return;

    try {
      setDeleting(true);
      await commentService.adminDeleteComment(selectedCommentId);
      setDeleteDialogOpen(false);
      setSelectedCommentId(null);
      // Reload current page
      loadComments(currentPage);
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Có lỗi xảy ra khi xóa bình luận");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quản Lý Bình Luận</h1>
        <p className="text-muted-foreground mt-1">
          Xem và quản lý bình luận sản phẩm
        </p>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">Thông Báo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-800">
            Hiện tại, để xem và quản lý bình luận, vui lòng truy cập trang chi tiết sản phẩm tương ứng.
            Backend chưa cung cấp API lấy tất cả bình luận cho admin. 
          </p>
          <p className="text-sm text-blue-800 mt-2">
            Bạn có thể xóa bình luận vi phạm trực tiếp từ trang sản phẩm hoặc thông qua API endpoint:
            <code className="bg-blue-100 px-2 py-1 rounded ml-1">
              DELETE /comments/admin/:id
            </code>
          </p>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng Bình Luận
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {comments?.total || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bình Luận Gốc
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {comments?.data.filter(c => !c.parent_id).length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Trả Lời
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {comments?.data.filter(c => c.parent_id).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comments Table */}
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : !comments || comments.data.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Không có dữ liệu bình luận để hiển thị
              </p>
              <p className="text-sm text-muted-foreground">
                Vui lòng truy cập trang sản phẩm để xem và quản lý bình luận
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sản Phẩm</TableHead>
                    <TableHead>Người Dùng</TableHead>
                    <TableHead>Nội Dung</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Ngày Tạo</TableHead>
                    <TableHead className="text-right">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comments.data.map((comment) => (
                    <TableRow key={comment._id}>
                      <TableCell className="font-medium">
                        {typeof comment.product_id === 'object' 
                          ? comment.product_id?.name || 'N/A'
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {typeof comment.user_id === 'object'
                          ? comment.user_id?.full_name || comment.user_id?.email || 'N/A'
                          : 'N/A'}
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        {comment.content}
                      </TableCell>
                      <TableCell>
                        {comment.parent_id ? (
                          <span className="text-sm text-muted-foreground">Trả lời</span>
                        ) : (
                          <span className="text-sm font-medium">Bình luận gốc</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(comment.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {typeof comment.product_id === 'object' && comment.product_id?.slug && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                window.open(`/products/${comment.product_id.slug}`, '_blank')
                              }
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Xem
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteClick(comment._id!)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Xóa
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {comments.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadComments(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ← Trước
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Trang {currentPage} / {comments.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadComments(currentPage + 1)}
                    disabled={currentPage === comments.totalPages}
                  >
                    Sau →
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
