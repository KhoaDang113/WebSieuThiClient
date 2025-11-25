import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/ui/star-rating";
import { orderRatingService } from "@/api";
import type { CreateOrderRatingDto } from "@/types/order-rating.type";

interface OrderRatingDialogProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  onSuccess?: () => void;
}

export function OrderRatingDialog({
  open,
  onClose,
  orderId,
  onSuccess,
}: OrderRatingDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [ratings, setRatings] = useState({
    overall: 0,
    productQuality: 0,
    packaging: 0,
    deliveryTime: 0,
    shipper: 0,
  });
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    // Validation
    if (ratings.overall === 0) {
      setError("Vui lòng chọn đánh giá tổng thể");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data: CreateOrderRatingDto = {
        order_id: orderId,
        rating_overall: ratings.overall,
        ...(ratings.productQuality > 0 && { rating_product_quality: ratings.productQuality }),
        ...(ratings.packaging > 0 && { rating_packaging: ratings.packaging }),
        ...(ratings.deliveryTime > 0 && { rating_delivery_time: ratings.deliveryTime }),
        ...(ratings.shipper > 0 && { rating_shipper: ratings.shipper }),
        ...(comment.trim() && { comment: comment.trim() }),
      };

      await orderRatingService.createRating(data);
      
      // Success
      toast.success("Đánh giá của bạn đã được gửi thành công!");
      onSuccess?.();
      onClose();
      
      // Reset form
      setRatings({
        overall: 0,
        productQuality: 0,
        packaging: 0,
        deliveryTime: 0,
        shipper: 0,
      });
      setComment("");
    } catch (err: any) {
      console.error("Error submitting rating:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      // Reset form on close
      setRatings({
        overall: 0,
        productQuality: 0,
        packaging: 0,
        deliveryTime: 0,
        shipper: 0,
      });
      setComment("");
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Đánh giá đơn hàng
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Overall Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Đánh giá tổng thể <span className="text-red-500">*</span>
            </label>
            <StarRating
              value={ratings.overall}
              onChange={(value) => setRatings({ ...ratings, overall: value })}
              size="lg"
            />
          </div>

          {/* Product Quality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chất lượng sản phẩm
            </label>
            <StarRating
              value={ratings.productQuality}
              onChange={(value) => setRatings({ ...ratings, productQuality: value })}
            />
          </div>

          {/* Packaging */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đóng gói
            </label>
            <StarRating
              value={ratings.packaging}
              onChange={(value) => setRatings({ ...ratings, packaging: value })}
            />
          </div>

          {/* Delivery Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời gian giao hàng
            </label>
            <StarRating
              value={ratings.deliveryTime}
              onChange={(value) => setRatings({ ...ratings, deliveryTime: value })}
            />
          </div>

          {/* Shipper */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dịch vụ giao hàng
            </label>
            <StarRating
              value={ratings.shipper}
              onChange={(value) => setRatings({ ...ratings, shipper: value })}
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhận xét của bạn
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về đơn hàng này..."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#007E42] hover:bg-[#006633]"
            >
              {loading ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
