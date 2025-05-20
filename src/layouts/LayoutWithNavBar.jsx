import { Outlet } from "react-router-dom";
import { Navbar } from "../features/navbar/Navbar";
export const LayoutWithNavBar = () => (
  <div>
    <Navbar />
    <Outlet /> {/* Renders child route */}
  </div>
);
