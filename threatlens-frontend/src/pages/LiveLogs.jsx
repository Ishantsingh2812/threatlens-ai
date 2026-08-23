import { useEffect, useState } from "react";
import { getLogs } from "../api/ThreatApi";

function LiveLogs() {

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [methodFilter, setMethodFilter] = useState("ALL");

const fetchLogs = async () => {
  try {
    const data = await getLogs();

    setLogs(data);
    setError("");

  } catch (error) {
    console.error("Failed to fetch logs:", error);
    setError("Unable to load logs");

  } finally {
    setLoading(false);
  }
};

useEffect(() => {

  const timer = setTimeout(() => {
    fetchLogs();
  }, 0);

  const interval = setInterval(() => {
    fetchLogs();
  }, 5000);

  return () => {
    clearTimeout(timer);
    clearInterval(interval);
  };

}, []);

  const filteredLogs = logs.filter((log) => {

    const matchesSearch =
      log.ipAddress?.toLowerCase().includes(search.toLowerCase()) ||
      log.endpoint?.toLowerCase().includes(search.toLowerCase()) ||
      log.username?.toLowerCase().includes(search.toLowerCase());

    const matchesLevel =
      levelFilter === "ALL" ||
      log.level === levelFilter;

    const matchesMethod =
      methodFilter === "ALL" ||
      log.method === methodFilter;

    return matchesSearch && matchesLevel && matchesMethod;
  });

  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading logs...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6 text-white">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">

        <div>

          <div className="flex items-center gap-3">

            <h1 className="text-3xl font-bold">
              Live Logs
            </h1>

            <span className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400">

              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

              LIVE

            </span>

          </div>

          <p className="mt-1 text-gray-400">
            Monitor incoming application logs in real time
          </p>

        </div>

        <button
          onClick={fetchLogs}
          className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm hover:bg-gray-800"
        >
          ↻ Refresh
        </button>

      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-3">

        <input
          type="text"
          placeholder="Search IP, endpoint, username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-sm outline-none placeholder:text-gray-600 focus:border-gray-600"
        />

        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-sm outline-none"
        >
          <option value="ALL">All Levels</option>
          <option value="INFO">INFO</option>
          <option value="WARN">WARN</option>
          <option value="ERROR">ERROR</option>
        </select>

        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-sm outline-none"
        >
          <option value="ALL">All Methods</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>

      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">

        <StatCard
          title="Total Logs"
          value={logs.length}
        />

        <StatCard
          title="Warnings"
          value={logs.filter((log) => log.level === "WARN").length}
        />

        <StatCard
          title="Errors"
          value={logs.filter((log) => log.level === "ERROR").length}
        />

      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px]">

            <thead className="border-b border-gray-800 bg-gray-950">

              <tr>

                <TableHeader>Time</TableHeader>
                <TableHeader>Level</TableHeader>
                <TableHeader>Method</TableHeader>
                <TableHeader>Endpoint</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>IP Address</TableHeader>
                <TableHeader>Username</TableHeader>

              </tr>

            </thead>

            <tbody>

              {filteredLogs.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No logs found
                  </td>

                </tr>

              ) : (

                filteredLogs.map((log) => (

                  <tr
                    key={log.id}
                    className="border-b border-gray-800 transition hover:bg-gray-800/40"
                  >

                    <td className="px-5 py-4 text-sm text-gray-400">
                      {formatTime(log.timestamp)}
                    </td>

                    <td className="px-5 py-4">
                      <LevelBadge level={log.level} />
                    </td>

                    <td className="px-5 py-4">
                      <MethodBadge method={log.method} />
                    </td>

                    <td className="px-5 py-4 font-mono text-sm text-gray-300">
                      {log.endpoint}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge code={log.statusCode} />
                    </td>

                    <td className="px-5 py-4 font-mono text-sm text-gray-400">
                      {log.ipAddress}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-300">
                      {log.username || "Unknown"}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        <div className="border-t border-gray-800 px-5 py-3 text-xs text-gray-500">
          Showing {filteredLogs.length} of {logs.length} logs
        </div>

      </div>

    </div>
  );
}


/* ---------- Components ---------- */

function StatCard({ title, value }) {

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>

    </div>
  );
}


function TableHeader({ children }) {

  return (
    <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
      {children}
    </th>
  );
}


function LevelBadge({ level }) {

  const styles = {
    INFO: "bg-blue-500/10 text-blue-400",
    WARN: "bg-yellow-500/10 text-yellow-400",
    ERROR: "bg-red-500/10 text-red-400",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[level] || "bg-gray-500/10 text-gray-400"
      }`}
    >
      {level || "UNKNOWN"}
    </span>
  );
}


function MethodBadge({ method }) {

  const styles = {
    GET: "text-green-400",
    POST: "text-blue-400",
    PUT: "text-yellow-400",
    DELETE: "text-red-400",
  };

  return (
    <span
      className={`font-mono text-xs font-semibold ${
        styles[method] || "text-gray-400"
      }`}
    >
      {method}
    </span>
  );
}


function StatusBadge({ code }) {

  let style = "bg-gray-500/10 text-gray-400";

  if (code >= 200 && code < 300) {
    style = "bg-green-500/10 text-green-400";
  } else if (code >= 400 && code < 500) {
    style = "bg-yellow-500/10 text-yellow-400";
  } else if (code >= 500) {
    style = "bg-red-500/10 text-red-400";
  }

  return (
    <span
      className={`rounded-md px-2.5 py-1 text-xs font-medium ${style}`}
    >
      {code}
    </span>
  );
}


function formatTime(timestamp) {

  if (!timestamp) {
    return "-";
  }

  return new Date(timestamp).toLocaleTimeString();
}


export default LiveLogs;