import { createBrowserRouter, type RouteObject } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin";
import AdminUsers from "@/pages/admin/users";
import AdminProducts from "@/pages/admin/products";
import AdminCategories from "@/pages/admin/categories";
import AddProductPage from "@/pages/admin/products/add";
import AdminMessages from "@/pages/admin/messages";
import ConversationDetailPage from "@/pages/admin/messages/detail";
import StaffLayout from "@/layouts/StaffLayout";
import HomePage from "@/pages/home/index";
import ProductsPage from "@/pages/products";
import ShoppingCart from "@/pages/cart";
import ProductDetail from "@/pages/products-detail";
import LoginPage from "@/pages/login";
import SignUpPage from "@/pages/sign_up";
import VerifyEmailPage from "@/pages/verify-email";
import ForgotPasswordPage from "@/pages/forgot-password";
import AuthCallbackPage from "@/pages/auth-callback";
import OrdersPage from "@/pages/order-management";
import CustomerOrdersPage from "@/pages/customer-orders";
import KhuyenMaiPage from "@/pages/sale";
import AccountPage from "@/pages/account";
import SearchPage from "@/pages/search";
import PaymentSuccessPage from "@/pages/payments/success";
import PaymentFailedPage from "@/pages/payments/failed";
import {
  ProtectedRoute,
  PublicRoute,
  AdminRoute,
  StaffRoute,
} from "@/components/auth/ProtectedRoute";

const router: RouteObject[] = [
  // User
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/products",
        element: <ProductsPage />,
      },
      {
        path: "/cart",
        element: (
          <ProtectedRoute>
            <ShoppingCart />
          </ProtectedRoute>
        ),
      },
      {
        path: "/products-detail/:id",
        element: <ProductDetail />,
      },
      {
        path: "/login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "/sign_up",
        element: (
          <PublicRoute>
            <SignUpPage />
          </PublicRoute>
        ),
      },
      {
        path: "/verify-email",
        element: <VerifyEmailPage />,
      },
      {
        path: "/forgot-password",
        element: (
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        ),
      },
      {
        path: "/auth-callback",
        element: <AuthCallbackPage />,
      },
      {
        path: "/my-orders",
        element: (
          <ProtectedRoute>
            <CustomerOrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/khuyen-mai",
        element: <KhuyenMaiPage />,
      },
      {
        path: "/account",
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/payments/success",
        element: <PaymentSuccessPage />,
      },
      {
        path: "/payments/failed",
        element: <PaymentFailedPage />,
      },
    ],
  },

  // Admin
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "/admin/users",
        element: <AdminUsers />,
      },
      {
        path: "/admin/products",
        element: <AdminProducts />,
      },
      {
        path: "/admin/products/add",
        element: <AddProductPage />,
      },
      {
        path: "/admin/categories",
        element: <AdminCategories />,
      },
      {
        path: "/admin/messages",
        element: <AdminMessages />,
      },
      {
        path: "/admin/messages/:id",
        element: <ConversationDetailPage />,
      },
    ],
  },

  // Staff
  {
    path: "/staff",
    element: (
      <StaffRoute>
        <StaffLayout />
      </StaffRoute>
    ),
    children: [
      {
        path: "/staff/orders",
        element: <OrdersPage />,
      },
    ],
  },
];

const routerBroswer = createBrowserRouter(router);
export default routerBroswer;
