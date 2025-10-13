import MainLayout from "@/layouts/MainLayout";
import { createBrowserRouter, type RouteObject } from "react-router-dom";
import HomePage from "@/pages/home/index";
import ProductsPage from "@/pages/products";
import ShoppingCart from "@/pages/cart";
import ProductDetail from "@/pages/products-detail";
import LoginPage from "@/pages/login";
import SignUpPage from "@/pages/sign_up";

const router: RouteObject[] = [
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
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/sign_up",
    element: <SignUpPage />,
  },
];

const routerBroswer = createBrowserRouter(router);
export default routerBroswer;
