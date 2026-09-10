import { useEffect, useState } from "react";

import {
  getDashboardStats,
  getThreatActivity,
  getThreatTypeDistribution,
  getRecentThreats,
} from "../api/ThreatApi";

import ThreatTypeChart from "../component/ThreatTypeChart";

import ThreatActivityChart from "../component/dashboard/ThreatActivityChart";

function Dashboard() {

  const [stats, setStats] = useState(null);
  const [threatActivity, setThreatActivity] = useState([]);
  const [threatTypes, setThreatTypes] = useState([]);
  const [recentThreats, setRecentThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

  const fetchDashboardData = async () => {

    try {

      const [
        statsData,
        activityData,
        threatTypeData,
        recentThreatData,
      ] = await Promise.all([
        getDashboardStats(),
        getThreatActivity(),
        getThreatTypeDistribution(),
        getRecentThreats(),
      ]);

      // Stats
      setStats(statsData);


      // Threat Activity
      const formattedActivity = activityData.map((item) => ({
        time: item[0],
        threats: Number(item[1]),
      }));

      setThreatActivity(formattedActivity);


      // Threat Types
      const formattedThreatTypes = threatTypeData.map((item) => ({
        threatType: item[0],
        count: Number(item[1]),
      }));

      setThreatTypes(formattedThreatTypes);


      // Recent Threats
      setRecentThreats(recentThreatData);

      setError("");

    } catch (err) {

      console.error("Dashboard error:", err);

      setError("Unable to load dashboard data");

    } finally {

      setLoading(false);

    }

  };


  // Initial load
  fetchDashboardData();


  // Refresh every 5 seconds
  const interval = setInterval(() => {
    fetchDashboardData();
  }, 5000);


  // Cleanup
  return () => {
    clearInterval(interval);
  };

}, []);


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


function formatDetectedTime(timestamp) {

  if (!timestamp) {
    return "Unknown";
  }

  const date = new Date(timestamp);

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

  /* ---------------- LOADING ---------------- */

  if (loading) {

    return (
      <div className="min-h-screen bg-gray-950 p-6 text-white">
        Loading dashboard...
      </div>
    );

  }


  /* ---------------- ERROR ---------------- */

  if (error) {

    return (
      <div className="min-h-screen bg-gray-950 p-6 text-red-400">
        {error}
      </div>
    );

  }


  /* ---------------- DASHBOARD ---------------- */

  return (

    <div className="min-h-screen bg-gray-950 p-6 text-white">

      {/* HEADER */}

      <div className="mb-8 flex items-center justify-between">

        <div>

          <div className="flex items-center gap-3">

            <h1 className="text-3xl font-bold">
              Security Dashboard
            </h1>

            <span className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400">

              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

              LIVE

            </span>

          </div>

          <p className="mt-2 text-gray-400">
            Real-time overview of ThreatLens security activity
          </p>

        </div>


        <div className="text-right text-sm text-gray-500">

          Monitoring System

          <div className="text-green-400">
            ● Operational
          </div>

        </div>

      </div>


      {/* STAT CARDS */}

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

        <StatCard
          title="Total Logs"
          value={stats.totalLogs}
          icon="📜"
        />

        <StatCard
          title="Total Threats"
          value={stats.totalThreats}
          icon="🚨"
        />

        <StatCard
          title="Critical Threats"
          value={stats.criticalThreats}
          icon="🔴"
        />

        <StatCard
          title="High Threats"
          value={stats.highThreats}
          icon="🟠"
        />

        <StatCard
          title="Medium Threats"
          value={stats.mediumThreats}
          icon="🟡"
        />

        <StatCard
          title="Open Threats"
          value={stats.openThreats}
          icon="⚠️"
        />

      </div>


      {/* THREAT ACTIVITY */}

      <ThreatActivityChart data={threatActivity} />


      {/* LOWER DASHBOARD */}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

  <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

    <div className="mb-6">

      <h2 className="text-lg font-semibold">
        Threat Severity
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Distribution of detected threats by severity
      </p>

    </div>

    <div className="space-y-5">

      <SeverityBar
        label="Critical"
        value={stats.criticalThreats}
        total={stats.totalThreats}
      />

      <SeverityBar
        label="High"
        value={stats.highThreats}
        total={stats.totalThreats}
      />

      <SeverityBar
        label="Medium"
        value={stats.mediumThreats}
        total={stats.totalThreats}
      />

    </div>

  </div>


  <ThreatTypeChart data={threatTypes} />



        {/* THREAT SEVERITY */}

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

          <div className="mb-6">

            <h2 className="text-lg font-semibold">
              Threat Severity
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Distribution of detected threats by severity
            </p>

          </div>


          <div className="space-y-5">

            <SeverityBar
              label="Critical"
              value={stats.criticalThreats}
              total={stats.totalThreats}
            />

            <SeverityBar
              label="High"
              value={stats.highThreats}
              total={stats.totalThreats}
            />

            <SeverityBar
              label="Medium"
              value={stats.mediumThreats}
              total={stats.totalThreats}
            />

          </div>

        </div>


        {/* SECURITY OVERVIEW */}

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

          <div className="mb-6">

            <h2 className="text-lg font-semibold">
              Security Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Current ThreatLens monitoring status
            </p>

          </div>


          <div className="space-y-4">

            <OverviewRow
              label="Total Requests Logged"
              value={stats.totalLogs}
            />

            <OverviewRow
              label="Threats Detected"
              value={stats.totalThreats}
            />

            <OverviewRow
              label="Open Threats"
              value={stats.openThreats}
            />

            <OverviewRow
              label="Critical Threats"
              value={stats.criticalThreats}
            />

          </div>

        </div>

      </div>


      {/* RECENT ACTIVITY */}

      <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900 p-6">

        <div className="mb-5">

          <h2 className="text-lg font-semibold">
            Recent Security Activity
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Latest events detected by ThreatLens
          </p>

        </div>

<div className="overflow-x-auto">

  {recentThreats.length === 0 ? (

    <div className="py-10 text-center text-gray-500">
      No recent threats detected
    </div>

  ) : (

    <table className="w-full text-left">

      <thead>

        <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">

          <th className="px-4 py-3">
            Threat
          </th>

          <th className="px-4 py-3">
            Severity
          </th>

          <th className="px-4 py-3">
            Source IP
          </th>

          <th className="px-4 py-3">
            User
          </th>

          <th className="px-4 py-3">
            Status
          </th>

          <th className="px-4 py-3">
            Detected
          </th>

        </tr>

      </thead>


      <tbody>

        {recentThreats.map((threat) => (

          <tr
            key={threat.id}
            className="border-b border-gray-800/50 transition hover:bg-gray-800/40"
          >

            {/* THREAT TYPE */}

            <td className="px-4 py-4">

              <span className="font-medium text-white">
                {formatThreatType(threat.threatType)}
              </span>

            </td>


            {/* SEVERITY */}

            <td className="px-4 py-4">

              <SeverityBadge
                severity={threat.severity}
              />

            </td>


            {/* SOURCE IP */}

            <td className="px-4 py-4 font-mono text-sm text-gray-400">

              {threat.sourceIp || "Unknown"}

            </td>


            {/* USER */}

            <td className="px-4 py-4 text-sm text-gray-400">

              {threat.username || "Unknown"}

            </td>


            {/* STATUS */}

            <td className="px-4 py-4">

              <StatusBadge
                status={threat.status}
              />

            </td>


            {/* TIME */}

            <td className="px-4 py-4 text-sm text-gray-500">

              {formatDetectedTime(threat.detectedAt)}

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  )}

</div>

      </div>

    </div>

  )
}


/* ---------------- STAT CARD ---------------- */

function StatCard({ title, value, icon }) {

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


/* ---------------- SEVERITY BAR ---------------- */

function SeverityBar({ label, value, total }) {

  const percentage =
    total > 0
      ? Math.round((value / total) * 100)
      : 0;

  return (

    <div>

      <div className="mb-2 flex justify-between text-sm">

        <span className="text-gray-400">
          {label}
        </span>

        <span className="font-medium text-white">
          {value}
        </span>

      </div>


      <div className="h-2 overflow-hidden rounded-full bg-gray-800">

        <div
          className="h-full rounded-full bg-red-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />

      </div>


      <p className="mt-1 text-right text-xs text-gray-600">
        {percentage}%
      </p>

    </div>

  );
}


/* ---------------- OVERVIEW ROW ---------------- */

function OverviewRow({ label, value }) {

  return (

    <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-950 px-4 py-3">

      <span className="text-sm text-gray-400">
        {label}
      </span>

      <span className="font-semibold text-white">
        {value}
      </span>

    </div>

  );

}

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
        styles[severity] ||
        "bg-gray-500/10 text-gray-400 border-gray-500/20"
      }`}
    >
      {severity}
    </span>
  );
}

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
        styles[status] ||
        "bg-gray-500/10 text-gray-400 border-gray-500/20"
      }`}
    >
      {status}
    </span>
  );
}

export default Dashboard;