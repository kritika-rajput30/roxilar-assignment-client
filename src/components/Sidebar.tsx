import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { dashboardOptions } from "../constant/dashboardOptions";

const Sidebar = () => {
  const role = useSelector((state) => state.auth.role);
  const options = dashboardOptions[role] || [];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/auth");
  };

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="md:hidden absolute top-2 p-4 flex-col justify-between items-center">
        <button className=" " onClick={() => setIsOpen(true)} aria-label="Open Menu">
          <Menu />
        </button>
      </div>

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-gray-900 text-white p-5">
        <div className="text-2xl font-bold capitalize mb-10">
          <span className="text-white">RateHub</span>
        </div>

        <ul className="space-y-4">
          {options.map((opt, idx) => (
            <li key={idx}>
              <NavLink
                to={opt.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-800"
                  }`
                }
              >
                {opt.icon}
                <span>{opt.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="pt-6 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-md border-2 border-white hover:bg-red-600 w-full transition-colors"
          >
            <LogOut />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <aside className="relative z-50 w-64 bg-gray-900 text-white p-5 h-full">
            <div className="flex items-center justify-between mb-10">
              <div className="text-2xl font-bold">{role} Dashboard</div>
              <button onClick={() => setIsOpen(false)} aria-label="Close Menu">
                <X />
              </button>
            </div>

            <ul className="space-y-4">
              {options.map((opt, idx) => (
                <li key={idx}>
                  <NavLink
                    to={opt.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        isActive ? "bg-gray-700" : "hover:bg-gray-800"
                      }`
                    }
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="pt-6 mt-auto">
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-md border-2 border-white hover:bg-red-600 w-full transition-colors"
              >
                <LogOut />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
