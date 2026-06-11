import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";

/** Authenticated app shell: sidebar + scrollable content. Each page renders its own AppHeader. */
export default function AppLayout() {
  return (
    <div className="flex h-svh bg-bg">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
