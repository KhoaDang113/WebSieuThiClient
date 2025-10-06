import MainLayout from "@/layouts/MainLayout";
import { createBrowserRouter, type RouteObject } from "react-router-dom";
import HomePage from "@/pages/home/index";
const router: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
];

const routerBroswer = createBrowserRouter(router);
export default routerBroswer;
