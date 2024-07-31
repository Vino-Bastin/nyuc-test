import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-r from-violet-600 to-indigo-600">
      <Outlet />
    </div>
  );
};

export default Layout;
