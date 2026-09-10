import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "User";

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
    ${
      isActive
        ? "bg-slate-800 text-white"
        : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-950 border-r border-slate-800 flex flex-col">

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="text-2xl">
          🛡️
        </div>

        <div>
          <h1 className="text-lg font-bold text-white">
            ThreatLens
          </h1>

          <p className="text-[10px] tracking-widest text-slate-500">
            SECURITY CENTER
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto">

        <p className="px-3 mt-2 mb-2 text-[10px] font-semibold tracking-widest text-slate-500">
          OVERVIEW
        </p>

        <NavLink to="/dashboard" className={navItemClass}>
          <span>◉</span>
          <span>Dashboard</span>
        </NavLink>

        <p className="px-3 mt-6 mb-2 text-[10px] font-semibold tracking-widest text-slate-500">
          SECURITY
        </p>

        <NavLink to="/logs" className={navItemClass}>
          <span>📜</span>
          <span>Live Logs</span>
        </NavLink>

        <NavLink to="/threats" className={navItemClass}>
          <span>🚨</span>
          <span>Threats</span>
        </NavLink>

        <NavLink to="/analyzer" className={navItemClass}>
          <span>🔍</span>
          <span>Analyzer</span>
        </NavLink>

        <p className="px-3 mt-6 mb-2 text-[10px] font-semibold tracking-widest text-slate-500">
          INSIGHTS
        </p>

        <NavLink to="/analytics" className={navItemClass}>
          <span>📊</span>
          <span>Analytics</span>
        </NavLink>

        <NavLink to="/copilot" className={navItemClass}>
          <span>🤖</span>
          <span>AI Copilot</span>
        </NavLink>

        <NavLink to="/reports" className={navItemClass}>
          <span>📄</span>
          <span>Reports</span>
        </NavLink>

      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-800 p-4 space-y-3">

        {/* User */}
        <div className="flex items-center gap-3 px-3 py-2">

          <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            👤
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {username}
            </p>

            <p className="text-[10px] text-slate-500 uppercase">
              {localStorage.getItem("role") || "USER"}
            </p>
          </div>

        </div>

        {/* Settings */}
        <NavLink to="/settings" className={navItemClass}>
          <span>⚙️</span>
          <span>Settings</span>
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;