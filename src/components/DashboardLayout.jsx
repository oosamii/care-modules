import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import Sidebar from "../components/Sidebar";
import { Bell, Search, Menu } from "lucide-react";
import { useState } from "react";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  if (!user) return <Navigate to="/" />;

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="w-64 bg-white shadow-lg">
            <Sidebar />
          </div>
          <div
            className="flex-1 bg-black/30"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-custBorder">
          <div className="h-14 px-4 md:px-6 flex items-center justify-between">
            {/* Left Side */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                className="md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </button>

              {/* Mobile Search Icon */}
              <button className="md:hidden">
                <Search size={18} />
              </button>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Search Bar (Desktop Only) */}
              <div className="hidden md:flex items-center gap-2 border border-custBorder px-3 py-1.5 rounded-full w-[260px] lg:w-[320px]">
                <Search size={16} className="text-gray-400" />
                <input
                  className="bg-transparent text-sm outline-none w-full"
                  placeholder="Search..."
                />
              </div>

              {/* Notifications */}
              <button className="relative">
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-custred rounded-full" />
              </button>

              {/* Avatar */}
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenProfile(!openProfile)}
                  className="flex items-center gap-2"
                >
                  <img
                    src="https://i.pravatar.cc/32"
                    alt="User"
                    className="w-8 h-8 rounded-full object-cover cursor-pointer"
                  />
                </button>

                {openProfile && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.role}</p>
                    </div>

                    <button
                      onClick={() => {
                        logout(); // clears session
                        setOpenProfile(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
