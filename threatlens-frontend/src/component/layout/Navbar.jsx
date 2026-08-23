function Navbar() {
  return (
    <header className="h-18 border-b border-slate-800 bg-slate-950 px-6 flex items-center justify-between">

      {/* Left */}
      <div>
        <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-500">
          SECURITY CENTER
        </p>

        <h2 className="text-lg font-semibold text-white">
          ThreatLens
        </h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <div className="flex h-9 w-64 items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3">

          <span className="text-lg text-slate-500">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search logs, threats..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
          />

        </div>

        {/* Notification */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-sm transition hover:bg-slate-800"
        >
          🔔

          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-white">
            I
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">
              Ishant
            </p>

            <p className="text-xs text-slate-500">
              Security Analyst
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;