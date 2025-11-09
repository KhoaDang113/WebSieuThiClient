import api from "../axiosConfig";
import type {
  CommentResponse,
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "../types";

class CommentService {
  /**
   * Lấy danh sách bình luận theo sản phẩm
   */
  async getCommentsByProduct(
    productId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<CommentResponse> {
    const response = await api.get<CommentResponse>("/comments/product", {
      params: {
        product_id: productId,
        page,
        limit,
      },
    });
    return response.data;
  }

  /**
   * Lấy danh sách phản hồi của một bình luận
   */
  async getReplies(
    commentId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<CommentResponse> {
    const response = await api.get<CommentResponse>(
      `/comments/${commentId}/replies`,
      {
        params: {
          page,
          limit,
        },
      }
    );
    return response.data;
  }

  /**
   * Lấy chi tiết một bình luận
   */
  async getCommentById(commentId: string): Promise<Comment> {
    const response = await api.get<Comment>(`/comments/${commentId}`);
    return response.data;
  }

  /**
   * Tạo bình luận mới
   */
  async createComment(data: CreateCommentRequest): Promise<Comment> {
    const response = await api.post<Comment>("/comments", data);
    return response.data;
  }

  /**
   * Cập nhật bình luận
   */
  async updateComment(
    commentId: string,
    data: UpdateCommentRequest
  ): Promise<Comment> {
    const response = await api.put<Comment>(`/comments/${commentId}`, data);
    return response.data;
  }

  /**
   * Xóa bình luận
   */
  async deleteComment(commentId: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(
      `/comments/${commentId}`
    );
    return response.data;
  }

  /**
   * Lấy bình luận của tôi
   */
  async getMyComments(page: number = 1, limit: number = 10): Promise<CommentResponse> {
    const response = await api.get<CommentResponse>("/comments/my-comments", {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  }
}

export default new CommentService();

