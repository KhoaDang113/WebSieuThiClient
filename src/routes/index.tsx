import { createBrowserRouter, type RouteObject } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
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
