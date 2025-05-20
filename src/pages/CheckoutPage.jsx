import { CartNavbar } from '../features/navbar/CartNavbar'
import { Checkout } from '../features/checkout/checkout'
import React, {useEffect} from "react";

export function CheckoutPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
      <div>
        <CartNavbar />
        <Checkout />
      </div>
      
  )
}