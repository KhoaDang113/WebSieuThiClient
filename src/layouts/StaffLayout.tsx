"use client"

import { Footer } from "@/components/navbar-and-footer/Footer";
import { ScrollToTop } from "@/components/scroll/ScrollToTop";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { StaffNavbar } from "@/components/navbar-and-footer/StaffNavbar";
import { useOrders } from "@/hooks/useOrders";
import { useNotification } from "@/components/notification/NotificationContext";
import { useEffect, useRef } from "react";
import authService from "@/api/services/authService";
import { useAuthStore } from "@/stores/authStore";

export default function StaffLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { showNotification } = useNotification();
  const previousOrdersRef = useRef<string[]>([]);
  const { user } = useAuthStore();

  // Chặn staff truy cập các trang ngoài /staff/*
  useEffect(() => {
    const checkAccess = () => {
      // Kiểm tra đã đăng nhập chưa
      if (!authService.isAuthenticated()) {
        navigate("/login", { replace: true });
        return;
      }

      // Lấy user hiện tại
      const currentUser = user || authService.getCurrentUser();

      // Kiểm tra role staff
      if (currentUser?.role === "staff") {
        // Nếu staff cố truy cập trang ngoài /staff/*, redirect về /staff/orders
        if (!location.pathname.startsWith("/staff")) {
          navigate("/staff/orders", { replace: true });
        }
      } else if (currentUser?.role !== "admin") {
        // Nếu không phải staff và không phải admin, redirect về home
        navigate("/", { replace: true });
      }
    };

    checkAccess();
  }, [location.pathname, navigate, user]);

  useEffect(() => {
    // Lấy danh sách ID đơn hàng hiện tại
    const currentOrderIds = orders.map((order) => order.id);

    // Nếu đây không phải lần đầu render
    if (previousOrdersRef.current.length > 0) {
      // Tìm các đơn hàng mới (có trong currentOrders nhưng không có trong previousOrders)
      const newOrders = orders.filter(
        (order) =>
          !previousOrdersRef.current.includes(order.id) &&
          order.status === "pending"
      );

      // Hiển thị thông báo cho mỗi đơn hàng mới
      newOrders.forEach((order) => {
        showNotification({
          type: "info",
          title: "Đơn hàng mới",
          message: `Đơn hàng ${order.id} từ ${order.customer_name} - ${order.total_amount.toLocaleString("vi-VN")}đ`,
          duration: 6000, // 6 giây
        });
      });
    }

    // Cập nhật danh sách ID đơn hàng đã biết
    previousOrdersRef.current = currentOrderIds;
  }, [orders, showNotification]);

  return (
    <div className="staff-layout w-full bg-[#e9edf0] pb-4">
      <ScrollToTop />
      <StaffNavbar />
      <main className="flex flex-col w-full mx-auto px-3 overflow-hidden gap-5 mt-2">
        <Outlet />
        <Footer />
      </main>
    </div>
  );
}
