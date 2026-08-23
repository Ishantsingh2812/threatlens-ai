import ThreatActivityChart from "../component/dashboard/ThreatActivityChart";

function Dashboard() {
  const stats = [
    {
      title: "Total Logs",
      value: "12,542",
      change: "+12.5%",
      description: "vs last 24 hours",
      icon: "📜",
    },
    {
      title: "Threats Detected",
      value: "187",
      change: "+8.2%",
      description: "vs last 24 hours",
      icon: "🚨",
    },
    {
      title: "Critical Threats",
      value: "23",
      change: "+3",
      description: "requires attention",
      icon: "⚠️",
    },
    {
      title: "Active Incidents",
      value: "14",
      change: "-5.4%",
      description: "vs last 24 hours",
      icon: "🛡️",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Security Dashboard</h1>

        <p className="mt-1 text-sm text-slate-400">
          Monitor your applications and detect suspicious activity in real time.
        </p>
      </div>

      {/* Security Status */}
      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.7)]" />

          <div>
            <p className="text-sm font-medium text-white">System Status</p>

            <p className="text-xs text-slate-500">
              Threat monitoring is active
            </p>
          </div>
        </div>

        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
          MONITORING
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">{stat.title}</p>

              <span className="text-lg">{stat.icon}</span>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <p className="text-3xl font-bold text-white">{stat.value}</p>

              <span className="text-xs text-emerald-400">{stat.change}</span>
            </div>

            <p className="mt-2 text-xs text-slate-500">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Threat Activity */}
        <div className="xl:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-white">Threat Activity</h2>

              <p className="mt-1 text-xs text-slate-500">
                Threats detected over the last 24 hours
              </p>
            </div>

            <select className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-400 outline-none">
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>

          <div className="mt-6">
            <ThreatActivityChart />
          </div>
        </div>

        {/* Threat Distribution */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="font-semibold text-white">Threat Distribution</h2>

          <p className="mt-1 text-xs text-slate-500">
            Detected threats by type
          </p>

          <div className="mt-6 space-y-5">
            <ThreatType name="Brute Force" count="62" percentage="33%" />

            <ThreatType name="SQL Injection" count="41" percentage="22%" />

            <ThreatType name="Suspicious Login" count="38" percentage="20%" />

            <ThreatType name="XSS" count="27" percentage="14%" />

            <ThreatType name="Other" count="19" percentage="11%" />
          </div>
        </div>
      </div>

      {/* Recent Threats */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div>
            <h2 className="font-semibold text-white">Recent Threats</h2>

            <p className="mt-1 text-xs text-slate-500">
              Latest suspicious activities detected by ThreatLens
            </p>
          </div>

          <button className="text-xs text-slate-400 hover:text-white">
            View all →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-800 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Threat</th>
                <th className="px-5 py-3">Source</th>
                <th className="px-5 py-3">Severity</th>
                <th className="px-5 py-3">Time</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              <ThreatRow
                threat="Brute Force Attack"
                source="192.168.1.24"
                severity="Critical"
                time="2 min ago"
                status="Investigating"
              />

              <ThreatRow
                threat="SQL Injection Attempt"
                source="10.0.0.42"
                severity="High"
                time="8 min ago"
                status="Blocked"
              />

              <ThreatRow
                threat="Suspicious Login"
                source="172.16.0.15"
                severity="Medium"
                time="14 min ago"
                status="Monitoring"
              />

              <ThreatRow
                threat="XSS Payload"
                source="192.168.1.72"
                severity="High"
                time="21 min ago"
                status="Blocked"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* Threat type */

function ThreatType({ name, count, percentage }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-slate-400">{name}</span>

        <span className="text-slate-500">{count}</span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-slate-400"
          style={{ width: percentage }}
        />
      </div>
    </div>
  );
}

/* Threat row */

function ThreatRow({ threat, source, severity, time, status }) {
  const severityStyle = {
    Critical: "bg-red-500/10 text-red-400",
    High: "bg-orange-500/10 text-orange-400",
    Medium: "bg-yellow-500/10 text-yellow-400",
  };

  const statusStyle = {
    Investigating: "bg-purple-500/10 text-purple-400",
    Blocked: "bg-emerald-500/10 text-emerald-400",
    Monitoring: "bg-blue-500/10 text-blue-400",
  };

  return (
    <tr className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30">
      <td className="px-5 py-4 font-medium text-white">{threat}</td>

      <td className="px-5 py-4 font-mono text-xs text-slate-400">{source}</td>

      <td className="px-5 py-4">
        <span
          className={`rounded-full px-2.5 py-1 text-xs ${
            severityStyle[severity]
          }`}
        >
          {severity}
        </span>
      </td>

      <td className="px-5 py-4 text-xs text-slate-500">{time}</td>

      <td className="px-5 py-4">
        <span
          className={`rounded-full px-2.5 py-1 text-xs ${statusStyle[status]}`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
}

export default Dashboard;
