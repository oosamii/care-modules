import { NavLink } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { sidebarItems } from "./sidebarItems";
import usePermission from "../utils/usePermission";
import { useAuth } from "../utils/AuthContext";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const { canAccess } = usePermission();
  const { user } = useAuth();

  return (
    <div
      className={`h-screen bg-white border-r flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Section */}
      <div className="p-4 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              H
            </div>
            <span className="text-lg font-semibold">HealthERP</span>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronLeft
            className={`transition-transform ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 space-y-1">
        {sidebarItems
          .filter((item) => {
            if (item.children) {
              return item.children.some(canAccess);
            }
            return canAccess(item);
          })
          .map((item) => {
            const Icon = item.icon;

            if (item.children) {
              const filteredChildren =
                item.children.filter(canAccess);

              return (
                <div key={item.label}>
                  <button
                    onClick={() =>
                      setOpenMenu(
                        openMenu === item.label ? null : item.label
                      )
                    }
                    className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
                  >
                    <Icon size={20} />
                    {!collapsed && (
                      <span className="flex-1 text-left">
                        {item.label}
                      </span>
                    )}
                  </button>

                  {openMenu === item.label &&
                    !collapsed &&
                    filteredChildren.length > 0 && (
                      <div className="ml-8 mt-1 space-y-1">
                        {filteredChildren.map((child) => {
                          const ChildIcon = child.icon;

                          return (
                            <NavLink
                              key={child.label}
                              to={child.path}
                              className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                                ${
                                  isActive
                                    ? "bg-blue-100 text-blue-600"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`
                              }
                            >
                              <ChildIcon size={18} />
                              <span>{child.label}</span>
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <Icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
      </nav>

      {/* Bottom Profile */}
      <div className="border-t p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
          {user?.name?.charAt(0) || "U"}
        </div>

        {!collapsed && (
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-gray-500">
              {user?.role}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;