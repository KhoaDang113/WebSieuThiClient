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
import OrdersPage from "@/pages/order-management";
import CustomerOrdersPage from "@/pages/customer-orders";
import KhuyenMaiPage from "@/pages/sale";

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
        path: "/products",
        element: <ProductsPage />,
      },
      {
        path: "/cart",
        element: <ShoppingCart />,
      },
      {
        path: "/products-detail/:id",
        element: <ProductDetail />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/sign_up",
        element: <SignUpPage />,
      },
      {
        path: "/my-orders",
        element: <CustomerOrdersPage />,
      },
      {
        path: "/khuyen-mai",
        element: <KhuyenMaiPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
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
    element: <StaffLayout />,
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
