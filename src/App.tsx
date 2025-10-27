import "./App.css";
import { RouterProvider } from "react-router-dom";
import routes from "@/routes/index";
import { CartProvider } from "@/components/cart/CartContext";

function App() {
  return (
    <CartProvider>
      <RouterProvider router={routes} />
    </CartProvider>
  );
}

export default App;
