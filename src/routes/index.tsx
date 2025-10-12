import MainLayout from "@/layouts/MainLayout";
import { createBrowserRouter, type RouteObject } from "react-router-dom";
import HomePage from "@/pages/home/index";
import ProductsPage from "@/pages/products";

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
    ],
  },
];

const routerBroswer = createBrowserRouter(router);
export default routerBroswer;
