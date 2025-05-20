import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LayoutWithoutNavBar } from "./layouts/LayoutWithoutNavBar";
import { LayoutWithNavBar } from "./layouts/LayoutWithNavBar";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
//import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartNavbar } from "./features/navbar/CartNavbar";
const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutWithNavBar />, // Includes NavBar
    children: [{ 
      path: "/", 
      element: <HomePage /> 
    }],
    // {
    //   path: "/product-detail", 
    //   element: <ProductDetailPage /> 
    // }],
  },
  {
    path: "/checkout",
    element: <LayoutWithoutNavBar />, // No NavBar
    children: [{ path: "", element: <CheckoutPage /> }],
  },
  {
    path: "/cart",
    element: <LayoutWithoutNavBar />, // No NavBar
    children: [{ path: "", element: <CartPage /> }],
  },
  {
    path: "/cart-nav",
    element: <CartNavbar />,
  },
  {
    path: "/login",
    element: <LayoutWithoutNavBar />, // No NavBar
    children: [{ path: "", element: <LoginPage /> }],
  },
  {
    path: "/signup",
    element: <LayoutWithoutNavBar />, // No NavBar
    children: [{ path: "", element: <SignupPage /> }],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
