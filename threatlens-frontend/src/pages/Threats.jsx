import { useEffect, useState } from "react";
import { getThreats } from "../api/ThreatApi";

function Threats() {

  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchThreats = async () => {

      try {

        const data = await getThreats();

        setThreats(data);

      } catch (error) {

        console.error("Failed to fetch threats:", error);

        setError("Unable to load threats");

      } finally {

        setLoading(false);
      }
    };

    fetchThreats();

  }, []);

  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading threats...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 text-white">

      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Threats
        </h1>

        <p className="mt-1 text-gray-400">
          Detected security threats across your system
        </p>

      </div>

      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">

        <table className="w-full">

          <thead className="border-b border-gray-800 bg-gray-950">

            <tr>

              <th className="px-6 py-4 text-left text-sm text-gray-400">
                Threat
              </th>

              <th className="px-6 py-4 text-left text-sm text-gray-400">
                Severity
              </th>

              <th className="px-6 py-4 text-left text-sm text-gray-400">
                Source IP
              </th>

              <th className="px-6 py-4 text-left text-sm text-gray-400">
                Username
              </th>

              <th className="px-6 py-4 text-left text-sm text-gray-400">
                Status
              </th>

              <th className="px-6 py-4 text-left text-sm text-gray-400">
                Detected At
              </th>

            </tr>

          </thead>

          <tbody>

            {threats.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No threats detected 🎉
                </td>

              </tr>

            ) : (

              threats.map((threat) => (

                <tr
                  key={threat.id}
                  className="border-b border-gray-800 hover:bg-gray-800/50"
                >

                  <td className="px-6 py-4">

                    <div className="font-medium">
                      {formatThreatType(threat.threatType)}
                    </div>

                    <div className="mt-1 text-xs text-gray-500">
                      {threat.description}
                    </div>

                  </td>

                  <td className="px-6 py-4">
                    <SeverityBadge severity={threat.severity} />
                  </td>

                  <td className="px-6 py-4 text-gray-300">
                    {threat.sourceIp}
                  </td>

                  <td className="px-6 py-4 text-gray-300">
                    {threat.username || "Unknown"}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={threat.status} />
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(threat.detectedAt).toLocaleString()}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

function formatThreatType(type) {

  if (!type) return "Unknown";

  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function SeverityBadge({ severity }) {

  const styles = {
    CRITICAL: "bg-red-500/10 text-red-400 border-red-500/20",
    HIGH: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    MEDIUM: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    LOW: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-medium ${
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
    OPEN: "bg-red-500/10 text-red-400",
    RESOLVED: "bg-green-500/10 text-green-400",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] || "bg-gray-500/10 text-gray-400"
      }`}
    >
      {status}
    </span>
  );
}

export default Threats;