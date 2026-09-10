import { useEffect, useState } from "react";
import { getThreats, updateThreatStatus } from "../api/ThreatApi";
import { useNavigate } from "react-router-dom";
import { connectWebSocket, disconnectWebSocket } from "../api/WebSocket";

function Threats() {
  // --------------------------------
  // STATE
  // --------------------------------

  const [threats, setThreats] = useState([]);

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  const navigate = useNavigate();

  // --------------------------------
  // FETCH THREATS
  // --------------------------------
  const fetchThreats = async () => {
    try {
      const data = await getThreats();

      setThreats(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Failed to fetch threats:", err);
      setError("Unable to load threats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadThreats = async () => {
      try {
        const data = await getThreats();

        if (cancelled) return;

        setThreats(Array.isArray(data) ? data : []);
        setError("");
      } catch (err) {
        if (cancelled) return;

        console.error("Failed to fetch threats:", err);
        setError("Unable to load threats");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadThreats();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
  connectWebSocket(
    null,
    (newThreat) => {
      console.log("🚨 NEW THREAT IN THREATS PAGE:", newThreat);

      setThreats((currentThreats) => [
        newThreat,
        ...currentThreats,
      ]);
    }
  );

  return () => {
    disconnectWebSocket();
  };
}, []);

  // --------------------------------
  // FILTER THREATS
  // --------------------------------

  const filteredThreats = threats.filter((threat) => {
    // Search
    if (search.trim()) {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        threat.threatType?.toLowerCase().includes(query) ||
        threat.sourceIp?.toLowerCase().includes(query) ||
        threat.username?.toLowerCase().includes(query) ||
        threat.description?.toLowerCase().includes(query);

      if (!matchesSearch) {
        return false;
      }
    }

    // Severity
    if (severityFilter !== "ALL" && threat.severity !== severityFilter) {
      return false;
    }

    // Status
    if (statusFilter !== "ALL" && threat.status !== statusFilter) {
      return false;
    }

    // Threat Type
    if (typeFilter !== "ALL" && threat.threatType !== typeFilter) {
      return false;
    }

    return true;
  });

  // --------------------------------
  // UPDATE STATUS
  // --------------------------------

  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);

      await updateThreatStatus(id, status);

      // Refresh threats after update
      await fetchThreats();
    } catch (err) {
      console.error("Failed to update threat:", err);
      alert("Failed to update threat status");
    } finally {
      setUpdatingId(null);
    }
  };

  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 p-6 text-white">
        <div className="flex min-h-[300] items-center justify-center">
          <p className="text-gray-400">Loading threats...</p>
        </div>
      </div>
    );
  }

  // --------------------------------
  // ERROR
  // --------------------------------

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 p-6 text-white">
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6">
          <h2 className="text-lg font-semibold text-red-400">
            Failed to load threats
          </h2>

          <p className="mt-2 text-sm text-red-300">{error}</p>

          <button
            onClick={() => {
              setLoading(true);
              fetchThreats();
            }}
            className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/20"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------
  // UI
  // --------------------------------

  return (
    <div className="min-h-screen bg-gray-950 p-6 text-white">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Threat Management</h1>

          <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs text-red-400">
            {threats.length} Threats
          </span>
        </div>

        <p className="mt-2 text-gray-400">
          Monitor, investigate and manage detected security threats
        </p>
      </div>

      {/* FILTERS */}
      <div className="mb-6 rounded-xl border border-gray-800 bg-gray-900 p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search threats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-red-500"
          />

          {/* TYPE */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500"
          >
            <option value="ALL">All Threat Types</option>

            <option value="BRUTE_FORCE">Brute Force</option>

            <option value="SQL_INJECTION">SQL Injection</option>

            <option value="XSS">XSS</option>

            <option value="SUSPICIOUS_HTTP">Suspicious HTTP</option>

            <option value="NOT_FOUND_SCAN">Not Found Scan</option>

            <option value="UNUSUAL_LOGIN">Unusual Login</option>

            <option value="RATE_LIMIT_VIOLATION">Rate Limit Violation</option>
          </select>

          {/* SEVERITY */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500"
          >
            <option value="ALL">All Severities</option>

            <option value="CRITICAL">Critical</option>

            <option value="HIGH">High</option>

            <option value="MEDIUM">Medium</option>

            <option value="LOW">Low</option>
          </select>

          {/* STATUS */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500"
          >
            <option value="ALL">All Statuses</option>

            <option value="OPEN">Open</option>

            <option value="INVESTIGATING">Investigating</option>

            <option value="BLOCKED">Blocked</option>

            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* FILTER RESULT COUNT */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-300">
            {filteredThreats.length}
          </span>{" "}
          of <span className="font-medium text-gray-300">{threats.length}</span>{" "}
          threats
        </p>

        {(search ||
          severityFilter !== "ALL" ||
          statusFilter !== "ALL" ||
          typeFilter !== "ALL") && (
          <button
            onClick={() => {
              setSearch("");
              setSeverityFilter("ALL");
              setStatusFilter("ALL");
              setTypeFilter("ALL");
            }}
            className="text-sm text-red-400 transition hover:text-red-300"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* THREAT TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">
                <th className="px-5 py-4">Threat</th>

                <th className="px-5 py-4">Severity</th>

                <th className="px-5 py-4">Source IP</th>

                <th className="px-5 py-4">User</th>

                <th className="px-5 py-4">Status</th>

                <th className="px-5 py-4">Detected</th>

                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredThreats.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <div className="text-gray-400">No threats found</div>

                    {(search ||
                      severityFilter !== "ALL" ||
                      statusFilter !== "ALL" ||
                      typeFilter !== "ALL") && (
                      <p className="mt-2 text-sm text-gray-600">
                        Try changing or clearing your filters.
                      </p>
                    )}
                  </td>
                </tr>
              ) : (
                filteredThreats.map((threat) => (
                  <tr
                    key={threat.id}
                    className="border-b border-gray-800/50 transition hover:bg-gray-800/30"
                  >
                    {/* TYPE */}
                    <td className="px-5 py-4">
                      <div
                        onClick={() => navigate(`/threats/${threat.id}`)}
                        className="cursor-pointer font-medium text-white hover:text-red-400"
                      >
                        {formatThreatType(threat.threatType)}
                      </div>

                      <div className="mt-1 max-w-xs truncate text-xs text-gray-500">
                        {threat.description || "No description"}
                      </div>
                    </td>

                    {/* SEVERITY */}
                    <td className="px-5 py-4">
                      <SeverityBadge severity={threat.severity} />
                    </td>

                    {/* IP */}
                    <td className="px-5 py-4 font-mono text-sm text-gray-400">
                      {threat.sourceIp || "Unknown"}
                    </td>

                    {/* USER */}
                    <td className="px-5 py-4 text-sm text-gray-400">
                      {threat.username || "Unknown"}
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">
                      <StatusBadge status={threat.status} />
                    </td>

                    {/* TIME */}
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {formatDate(threat.detectedAt)}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {/* OPEN -> INVESTIGATING */}
                        {threat.status === "OPEN" && (
                          <ActionButton
                            label="Investigate"
                            onClick={() =>
                              handleStatusChange(threat.id, "INVESTIGATING")
                            }
                            loading={updatingId === threat.id}
                          />
                        )}

                        {/* INVESTIGATING -> BLOCKED */}
                        {threat.status === "INVESTIGATING" && (
                          <ActionButton
                            label="Block"
                            onClick={() =>
                              handleStatusChange(threat.id, "BLOCKED")
                            }
                            loading={updatingId === threat.id}
                          />
                        )}

                        {/* BLOCKED -> RESOLVED */}
                        {threat.status === "BLOCKED" && (
                          <ActionButton
                            label="Resolve"
                            onClick={() =>
                              handleStatusChange(threat.id, "RESOLVED")
                            }
                            loading={updatingId === threat.id}
                          />
                        )}

                        {/* RESOLVED */}
                        {threat.status === "RESOLVED" && (
                          <span className="text-xs text-gray-600">
                            Completed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --------------------------------
// SEVERITY BADGE
// --------------------------------

function SeverityBadge({ severity }) {
  const styles = {
    CRITICAL: "bg-red-500/10 text-red-400 border-red-500/20",

    HIGH: "bg-orange-500/10 text-orange-400 border-orange-500/20",

    MEDIUM: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

    LOW: "bg-green-500/10 text-green-400 border-green-500/20",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
        styles[severity] || "bg-gray-500/10 text-gray-400 border-gray-500/20"
      }`}
    >
      {severity || "UNKNOWN"}
    </span>
  );
}

// --------------------------------
// STATUS BADGE
// --------------------------------

function StatusBadge({ status }) {
  const styles = {
    OPEN: "bg-red-500/10 text-red-400 border-red-500/20",

    INVESTIGATING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

    BLOCKED: "bg-purple-500/10 text-purple-400 border-purple-500/20",

    RESOLVED: "bg-green-500/10 text-green-400 border-green-500/20",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
        styles[status] || "bg-gray-500/10 text-gray-400 border-gray-500/20"
      }`}
    >
      {status || "UNKNOWN"}
    </span>
  );
}

// --------------------------------
// ACTION BUTTON
// --------------------------------

function ActionButton({ label, onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:border-red-500 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Updating..." : label}
    </button>
  );
}

// --------------------------------
// FORMAT THREAT TYPE
// --------------------------------

function formatThreatType(type) {
  if (!type) {
    return "Unknown";
  }

  return type
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// --------------------------------
// FORMAT DATE
// --------------------------------

function formatDate(timestamp) {
  if (!timestamp) {
    return "Unknown";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default Threats;
