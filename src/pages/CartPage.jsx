import React, {useEffect} from "react";
import { Cart } from "../features/cart/Cart";
import { CartNavbar } from "../features/navbar/CartNavbar";

export const CartPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  return (
    <div>
      <CartNavbar />
      <Cart />
    </div>
  );
};
