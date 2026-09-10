import { useEffect, useState } from "react";
import {
  getDashboardStats,
  getThreatActivity,
  getThreatTypeDistribution,
  getTopAttackingIps,
} from "../api/ThreatApi";

import {
  connectWebSocket,
  disconnectWebSocket,
} from "../api/WebSocket";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function Analytics() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [threatTypes, setThreatTypes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [topIps, setTopIps] = useState([]);

  // ==========================================
  // FETCH ANALYTICS DATA
  // ==========================================

const fetchAnalytics = async () => {
  try {
    const [
      statsData,
      activityData,
      threatTypeData,
      topIpData,
    ] = await Promise.all([
      getDashboardStats(),
      getThreatActivity(),
      getThreatTypeDistribution(),
      getTopAttackingIps(),
    ]);

    // --------------------------
    // STATS
    // --------------------------

    setStats(statsData);

    // --------------------------
    // THREAT ACTIVITY
    // --------------------------

    const formattedActivity = Array.isArray(activityData)
      ? activityData.map((item) => ({
          time: formatHour(item[0]),
          threats: Number(item[1]),
        }))
      : [];

    setActivity(formattedActivity);

    // --------------------------
    // THREAT TYPES
    // --------------------------

    const formattedThreatTypes = Array.isArray(threatTypeData)
      ? threatTypeData.map((item) => ({
          name: formatThreatType(item[0]),
          value: Number(item[1]),
        }))
      : [];

    setThreatTypes(formattedThreatTypes);

    // --------------------------
    // TOP ATTACKING IPS
    // --------------------------

    const formattedTopIps = Array.isArray(topIpData)
      ? topIpData.slice(0, 10).map((item) => ({
          ip: item[0],
          attacks: Number(item[1]),
        }))
      : [];

    setTopIps(formattedTopIps);

    // --------------------------
    // CLEAR ERROR
    // --------------------------

    setError("");

  } catch (err) {
    console.error("Analytics error:", err);

    setError("Unable to load analytics data");

  } finally {
    setLoading(false);
  }
};

  // ==========================================
  // INITIAL LOAD + REFRESH
  // ==========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAnalytics();
    }, 0);

    const interval = setInterval(() => {
      fetchAnalytics();
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // ==========================================
  // REAL-TIME WEBSOCKET
  // ==========================================

  useEffect(() => {
    connectWebSocket(
      null,
      async (newThreat) => {
        console.log(
          "🚨 ANALYTICS: New threat received",
          newThreat
        );

        await fetchAnalytics();
      }
    );

    return () => {
      disconnectWebSocket();
    };
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 p-6 text-white">
        Loading analytics...
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 p-6 text-red-400">
        {error}
      </div>
    );
  }

  // ==========================================
  // ANALYTICS
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-950 p-6 text-white">

      {/* HEADER */}

      <div className="mb-8">

        <div className="flex items-center gap-3">

          <h1 className="text-3xl font-bold">
            Security Analytics
          </h1>

          <span className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400">

            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

            LIVE

          </span>

        </div>

        <p className="mt-2 text-gray-400">
          Detailed analysis of ThreatLens security activity
        </p>

      </div>

      {/* ===================================== */}
      {/* SUMMARY CARDS */}
      {/* ===================================== */}

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

        <AnalyticsCard
          title="Total Logs"
          value={stats?.totalLogs ?? 0}
          icon="📜"
        />

        <AnalyticsCard
          title="Total Threats"
          value={stats?.totalThreats ?? 0}
          icon="🚨"
        />

        <AnalyticsCard
          title="Critical Threats"
          value={stats?.criticalThreats ?? 0}
          icon="🔴"
        />

        <AnalyticsCard
          title="Open Threats"
          value={stats?.openThreats ?? 0}
          icon="⚠️"
        />

      </div>

      {/* ===================================== */}
      {/* THREAT ACTIVITY */}
      {/* ===================================== */}

      <div className="mb-6 rounded-xl border border-gray-800 bg-gray-900 p-6">

        <div className="mb-6">

          <h2 className="text-lg font-semibold">
            Threat Activity
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Threats detected during the last 24 hours
          </p>

        </div>

        <div className="h-80">

          {activity.length === 0 ? (

            <div className="flex h-full items-center justify-center text-gray-500">
              No threat activity available
            </div>

          ) : (

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart data={activity}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                />

                <XAxis
                  dataKey="time"
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  stroke="#9CA3AF"
                  allowDecimals={false}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="threats"
                  name="Threats"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />

              </LineChart>

            </ResponsiveContainer>

          )}

        </div>

      </div>

      {/* ===================================== */}
      {/* THREAT TYPE + SEVERITY */}
      {/* ===================================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* THREAT TYPE */}

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

          <div className="mb-6">

            <h2 className="text-lg font-semibold">
              Threat Type Distribution
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Breakdown of detected attack types
            </p>

          </div>

          <div className="h-80">

            {threatTypes.length === 0 ? (

              <div className="flex h-full items-center justify-center text-gray-500">
                No threat types available
              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={threatTypes}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label
                  >

                    {threatTypes.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            PIE_COLORS[
                              index %
                                PIE_COLORS.length
                            ]
                          }
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            )}

          </div>

        </div>

        {/* SEVERITY */}

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

          <div className="mb-6">

            <h2 className="text-lg font-semibold">
              Severity Distribution
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Threats grouped by severity
            </p>

          </div>

          <div className="h-80">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={[
                  {
                    severity: "Critical",
                    threats:
                      stats?.criticalThreats ?? 0,
                  },
                  {
                    severity: "High",
                    threats:
                      stats?.highThreats ?? 0,
                  },
                  {
                    severity: "Medium",
                    threats:
                      stats?.mediumThreats ?? 0,
                  },
                  {
                    severity: "Low",
                    threats: 0,
                  },
                ]}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                />

                <XAxis
                  dataKey="severity"
                  stroke="#9CA3AF"
                />

                <YAxis
                  stroke="#9CA3AF"
                  allowDecimals={false}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />

                <Bar
                  dataKey="threats"
                  name="Threats"
                  fill="#ef4444"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* THREAT TYPE TABLE */}
      {/* ===================================== */}

      <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900 p-6">

        <div className="mb-5">

          <h2 className="text-lg font-semibold">
            Threat Breakdown
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Detailed threat type statistics
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead>

              <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">

                <th className="px-4 py-3">
                  Threat Type
                </th>

                <th className="px-4 py-3">
                  Count
                </th>

                <th className="px-4 py-3">
                  Percentage
                </th>

              </tr>

            </thead>

            <tbody>

              {threatTypes.map(
                (threat) => {

                  const percentage =
                    stats?.totalThreats > 0
                      ? Math.round(
                          (threat.value /
                            stats.totalThreats) *
                            100
                        )
                      : 0;

                  return (
                    <tr
                      key={threat.name}
                      className="border-b border-gray-800/50 hover:bg-gray-800/40"
                    >

                      <td className="px-4 py-4 font-medium">
                        {threat.name}
                      </td>

                      <td className="px-4 py-4 text-gray-400">
                        {threat.value}
                      </td>

                      <td className="px-4 py-4">

                        <div className="flex items-center gap-3">

                          <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-800">

                            <div
                              className="h-full rounded-full bg-red-500"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />

                          </div>

                          <span className="text-sm text-gray-400">
                            {percentage}%
                          </span>

                        </div>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ===================================== */}
      {/* TOP ATTACKING IPS */}
      {/* ===================================== */}

      <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900 p-6">

        <div className="mb-6">
          <h2 className="text-lg font-semibold">
            Top Attacking IPs
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            IP addresses responsible for the most detected threats
          </p>
        </div>

        {topIps.length === 0 ? (

          <div className="py-10 text-center text-gray-500">
            No attacking IP data available
          </div>

        ) : (

          <div className="space-y-4">

            {topIps.map((item, index) => {

              const maxAttacks = topIps[0]?.attacks || 1;

              const percentage =
                (item.attacks / maxAttacks) * 100;

              return (
                <div key={item.ip}>

                  <div className="mb-2 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <span className="w-6 text-sm text-gray-500">
                        #{index + 1}
                      </span>

                      <span className="font-mono text-sm text-gray-300">
                        {item.ip}
                      </span>

                    </div>

                    <span className="text-sm font-semibold text-red-400">
                      {item.attacks} attacks
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-800">

                    <div
                      className="h-full rounded-full bg-red-500 transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                </div>
              );

            })}

          </div>

        )}

      </div>

    </div>
  );
}

/* ==========================================
   ANALYTICS CARD
========================================== */

function AnalyticsCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 transition hover:border-gray-700">

      <div className="flex items-center justify-between">

        <p className="text-sm text-gray-400">
          {title}
        </p>

        <span className="text-xl">
          {icon}
        </span>

      </div>

      <p className="mt-3 text-3xl font-bold">
        {value}
      </p>

    </div>
  );
}

/* ==========================================
   HELPERS
========================================== */

function formatThreatType(type) {
  if (!type) {
    return "Unknown";
  }

  return type
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

function formatHour(timestamp) {
  if (!timestamp) {
    return "Unknown";
  }

  const date = new Date(
    timestamp.replace(" ", "T")
  );

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ==========================================
   CHART COLORS
========================================== */

const PIE_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

export default Analytics;