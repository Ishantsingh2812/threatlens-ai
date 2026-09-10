import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  getDashboardStats,
  getThreatTypeDistribution,
  getTopAttackingIps,
  getRecentThreats,
} from "../api/ThreatApi";

function Reports() {
  const [stats, setStats] = useState(null);
  const [threatTypes, setThreatTypes] = useState([]);
  const [topIps, setTopIps] = useState([]);
  const [recentThreats, setRecentThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReportData = async () => {
    try {
      const [
        statsData,
        threatTypeData,
        ipData,
        recentData,
      ] = await Promise.all([
        getDashboardStats(),
        getThreatTypeDistribution(),
        getTopAttackingIps(),
        getRecentThreats(),
      ]);

      setStats(statsData);

      setThreatTypes(
        Array.isArray(threatTypeData)
          ? threatTypeData.map((item) => ({
              type: formatThreatType(item[0]),
              count: Number(item[1]),
            }))
          : []
      );

      setTopIps(
        Array.isArray(ipData)
          ? ipData.slice(0, 5).map((item) => ({
              ip: item[0],
              attacks: Number(item[1]),
            }))
          : []
      );

      setRecentThreats(
        Array.isArray(recentData) ? recentData : []
      );
    } catch (error) {
      console.error("Report error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      await fetchReportData();
      if (isMounted) {
        // Component is still mounted
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, []);

const generateReport = () => {
  const doc = new jsPDF();

  const date = new Date().toLocaleString();

  // Title
  doc.setFontSize(22);
  doc.text("ThreatLens Security Report", 14, 20);

  doc.setFontSize(10);
  doc.text(`Generated: ${date}`, 14, 28);

  // Summary
  doc.setFontSize(15);
  doc.text("Security Summary", 14, 42);

  doc.setFontSize(11);

  doc.text(
    `Total Logs: ${stats?.totalLogs ?? 0}`,
    14,
    52
  );

  doc.text(
    `Total Threats: ${stats?.totalThreats ?? 0}`,
    14,
    60
  );

  doc.text(
    `Critical Threats: ${stats?.criticalThreats ?? 0}`,
    14,
    68
  );

  doc.text(
    `High Threats: ${stats?.highThreats ?? 0}`,
    14,
    76
  );

  doc.text(
    `Medium Threats: ${stats?.mediumThreats ?? 0}`,
    14,
    84
  );

  doc.text(
    `Open Threats: ${stats?.openThreats ?? 0}`,
    14,
    92
  );

  // Threat types
  doc.setFontSize(15);
  doc.text("Threat Type Breakdown", 14, 108);

  autoTable(doc, {
    startY: 114,
    head: [["Threat Type", "Count"]],
    body: threatTypes.map((item) => [
      item.type,
      item.count,
    ]),
  });

  // Top IPs
  let y = doc.lastAutoTable.finalY + 15;

  doc.setFontSize(15);
  doc.text("Top Attacking IPs", 14, y);

  autoTable(doc, {
    startY: y + 6,
    head: [["Rank", "IP Address", "Attacks"]],
    body: topIps.map((item, index) => [
      index + 1,
      item.ip,
      item.attacks,
    ]),
  });

  // Recent threats
  y = doc.lastAutoTable.finalY + 15;

  doc.setFontSize(15);
  doc.text("Recent Threats", 14, y);

  autoTable(doc, {
    startY: y + 6,
    head: [
      [
        "Type",
        "Severity",
        "Source IP",
        "Status",
      ],
    ],
    body: recentThreats.map((threat) => [
      formatThreatType(threat.threatType),
      threat.severity || "Unknown",
      threat.sourceIp || "Unknown",
      threat.status || "Unknown",
    ]),
  });

  doc.save("ThreatLens-Security-Report.pdf");
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 p-6 text-white">
        Loading security report...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6 text-white">

      {/* HEADER */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">
              Security Reports
            </h1>

            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
              REPORT
            </span>
          </div>

          <p className="mt-2 text-gray-400">
            Security overview generated from ThreatLens data.
          </p>
        </div>

        <button
          onClick={generateReport}
          className="rounded-lg bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-500"
        >
          📄 Generate Report
        </button>

      </div>

      {/* SUMMARY */}

      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

        <ReportCard
          title="Total Logs"
          value={stats?.totalLogs ?? 0}
          icon="📜"
        />

        <ReportCard
          title="Total Threats"
          value={stats?.totalThreats ?? 0}
          icon="🚨"
        />

        <ReportCard
          title="Critical Threats"
          value={stats?.criticalThreats ?? 0}
          icon="🔴"
        />

        <ReportCard
          title="Open Threats"
          value={stats?.openThreats ?? 0}
          icon="⚠️"
        />

      </div>

      {/* SEVERITY */}

      <div className="mb-6 rounded-xl border border-gray-800 bg-gray-900 p-6">

        <h2 className="text-lg font-semibold">
          Threat Severity Summary
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Current distribution of detected threats.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <SeverityCard
            title="Critical"
            value={stats?.criticalThreats ?? 0}
            className="text-red-400"
          />

          <SeverityCard
            title="High"
            value={stats?.highThreats ?? 0}
            className="text-orange-400"
          />

          <SeverityCard
            title="Medium"
            value={stats?.mediumThreats ?? 0}
            className="text-yellow-400"
          />

        </div>

      </div>

      {/* THREAT TYPES + IPS */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* THREAT TYPES */}

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

          <h2 className="text-lg font-semibold">
            Threat Type Breakdown
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Number of threats detected for each attack type.
          </p>

          <div className="mt-6 space-y-4">

            {threatTypes.length === 0 ? (
              <p className="text-gray-500">
                No threat data available.
              </p>
            ) : (
              threatTypes.map((item) => {

                const total = stats?.totalThreats || 1;

                const percentage =
                  (item.count / total) * 100;

                return (
                  <div key={item.type}>

                    <div className="mb-2 flex justify-between">

                      <span className="text-sm text-gray-300">
                        {item.type}
                      </span>

                      <span className="text-sm font-semibold text-red-400">
                        {item.count}
                      </span>

                    </div>

                    <div className="h-2 rounded-full bg-gray-800">

                      <div
                        className="h-2 rounded-full bg-red-500"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>
                );
              })
            )}

          </div>

        </div>

        {/* TOP IPS */}

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

          <h2 className="text-lg font-semibold">
            Top Attacking IPs
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Sources responsible for the most detected attacks.
          </p>

          <div className="mt-6 space-y-4">

            {topIps.length === 0 ? (
              <p className="text-gray-500">
                No attacking IP data available.
              </p>
            ) : (
              topIps.map((item, index) => (

                <div
                  key={item.ip}
                  className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-950 p-4"
                >

                  <div className="flex items-center gap-4">

                    <span className="text-sm text-gray-600">
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

              ))
            )}

          </div>

        </div>

      </div>

      {/* RECENT THREATS */}

      <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900 p-6">

        <div className="mb-5">

          <h2 className="text-lg font-semibold">
            Recent Threats
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Latest security threats detected by ThreatLens.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead>

              <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">

                <th className="px-4 py-3">
                  Type
                </th>

                <th className="px-4 py-3">
                  Severity
                </th>

                <th className="px-4 py-3">
                  Source IP
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

              {recentThreats.length === 0 ? (

                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No recent threats.
                  </td>
                </tr>

              ) : (

                recentThreats.map((threat) => (

                  <tr
                    key={threat.id}
                    className="border-b border-gray-800/50"
                  >

                    <td className="px-4 py-4 font-medium">
                      {formatThreatType(threat.threatType)}
                    </td>

                    <td className="px-4 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getSeverityClass(
                          threat.severity
                        )}`}
                      >
                        {threat.severity}
                      </span>

                    </td>

                    <td className="px-4 py-4 font-mono text-sm text-gray-400">
                      {threat.sourceIp || "Unknown"}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-400">
                      {threat.status || "Unknown"}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-500">
                      {formatDate(threat.detectedAt)}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* FOOTER */}

      <div className="mt-6 text-center text-xs text-gray-600">
        ThreatLens Security Intelligence Platform
      </div>

    </div>
  );
}

/* ==========================================
   REPORT CARD
========================================== */

function ReportCard({ title, value, icon }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">

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
   SEVERITY CARD
========================================== */

function SeverityCard({ title, value, className }) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-950 p-5">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className={`mt-2 text-3xl font-bold ${className}`}>
        {value}
      </p>

    </div>
  );
}

/* ==========================================
   HELPERS
========================================== */

function formatThreatType(type) {
  if (!type) return "Unknown";

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

function formatDate(timestamp) {
  if (!timestamp) return "Unknown";

  const date = new Date(
    timestamp.replace(" ", "T")
  );

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toLocaleString();
}

function getSeverityClass(severity) {
  switch (severity) {
    case "CRITICAL":
      return "bg-red-500/10 text-red-400";

    case "HIGH":
      return "bg-orange-500/10 text-orange-400";

    case "MEDIUM":
      return "bg-yellow-500/10 text-yellow-400";

    default:
      return "bg-green-500/10 text-green-400";
  }
}

export default Reports;