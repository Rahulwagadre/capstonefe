import { Outlet } from "react-router-dom";
// Layout for pages without NavBar
export const LayoutWithoutNavBar = () => (
  <div>
    <Outlet /> {/* Renders child route */}
  </div>
);
