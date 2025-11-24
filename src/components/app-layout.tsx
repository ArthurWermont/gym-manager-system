import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "./navbar"; // <–– seu nav

export default function AppLayout() {
  return (
    <div className="h-screen w-screen flex bg-neutral-950 overflow-hidden">

      {/* SIDEBAR FIXO */}
      <div className="w-64 fixed left-0 top-0 bottom-0 border-r border-neutral-800 bg-neutral-900">
        <Sidebar />
      </div>

      {/* ÁREA DIREITA (NAVBAR + CONTEÚDO) */}
      <div className="flex-1 flex flex-col ml-64">

        {/* NAVBAR FIXO */}
        <div className="h-16 fixed left-64 right-0 top-0 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md flex items-center px-6 z-50">
          <Navbar />
        </div>

        {/* CONTEÚDO SCROLLÁVEL */}
        <div className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-8">
          <Outlet />
        </div>

      </div>
    </div>
  );
}
