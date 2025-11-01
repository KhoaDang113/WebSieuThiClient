import "./App.css";
import { RouterProvider } from "react-router-dom";
import routes from "@/routes/index";
import { CartProvider } from "@/components/cart/CartContext";
import { AddressProvider } from "@/contexts/AddressContext";

function App() {
  return (
    <AddressProvider>
      <CartProvider>
        <RouterProvider router={routes} />
      </CartProvider>
    </AddressProvider>
  );
}

export default App;
