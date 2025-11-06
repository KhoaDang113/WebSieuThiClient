import "./App.css";
import { RouterProvider } from "react-router-dom";
import routes from "@/routes/index";
import { CartProvider } from "@/components/cart/CartContext";
import { AddressProvider } from "@/components/address/AddressContext";
import { NotificationProvider } from "@/components/notification/NotificationContext";
import { NotificationPopup } from "@/components/notification/NotificationPopup";

function App() {
  return (
    <AddressProvider>
      <CartProvider>
        <NotificationProvider>
          <RouterProvider router={routes} />
          <NotificationPopup />
        </NotificationProvider>
      </CartProvider>
    </AddressProvider>
  );
}

export default App;
