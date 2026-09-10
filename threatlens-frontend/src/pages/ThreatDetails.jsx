import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getThreatById,
  updateThreatStatus,
} from "../api/ThreatApi";

function ThreatDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [threat, setThreat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  // --------------------------------
  // LOAD THREAT
  // --------------------------------

  useEffect(() => {
    const loadThreat = async () => {
      try {
        const data = await getThreatById(id);
        setThreat(data);
      } catch (err) {
        console.error("Failed to load threat:", err);
        setError("Unable to load threat");
      } finally {
        setLoading(false);
      }
    };

    loadThreat();
  }, [id]);

  // --------------------------------
  // UPDATE STATUS
  // --------------------------------

  const handleStatusChange = async (status) => {
    try {
      setUpdating(true);

      const updatedThreat = await updateThreatStatus(
        threat.id,
        status
      );

      setThreat(updatedThreat);
    } catch (err) {
      console.error("Failed to update threat:", err);
      alert("Failed to update threat status");
    } finally {
      setUpdating(false);
    }
  };

  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 p-6 text-white">
        Loading threat...
      </div>
    );
  }

  // --------------------------------
  // ERROR
  // --------------------------------

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 p-6 text-red-400">
        {error}
      </div>
    );
  }

  if (!threat) {
    return (
      <div className="min-h-screen bg-gray-950 p-6 text-white">
        Threat not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6 text-white">

      {/* BACK */}
      <button
        onClick={() => navigate("/threats")}
        className="mb-6 text-sm text-gray-400 transition hover:text-white"
      >
        ← Back to Threats
      </button>

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Threat Details
        </h1>

        <p className="mt-2 text-gray-400">
          Investigate and manage this security threat
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

        {/* TITLE */}
        <div className="border-b border-gray-800 pb-6">

          <div className="flex flex-wrap items-center gap-3">

            <h2 className="text-2xl font-semibold">
              {formatThreatType(threat.threatType)}
            </h2>

            <SeverityBadge severity={threat.severity} />

            <StatusBadge status={threat.status} />

          </div>

          <p className="mt-3 text-gray-400">
            {threat.description || "No description available"}
          </p>

        </div>

        {/* THREAT INFORMATION */}
        <div className="mt-6">

          <h3 className="text-lg font-semibold">
            Threat Information
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            <Info
              label="Threat ID"
              value={threat.id}
            />

            <Info
              label="Threat Type"
              value={formatThreatType(threat.threatType)}
            />

            <Info
              label="Severity"
              value={threat.severity}
            />

            <Info
              label="Status"
              value={threat.status}
            />

            <Info
              label="Source IP"
              value={threat.sourceIp || "Unknown"}
            />

            <Info
              label="Username"
              value={threat.username || "Unknown"}
            />

            <Info
              label="Detected At"
              value={formatDate(threat.detectedAt)}
            />

          </div>

        </div>

        {/* ACTIONS */}
        <div className="mt-8 border-t border-gray-800 pt-6">

          <h3 className="text-lg font-semibold">
            Actions
          </h3>

          <div className="mt-4 flex flex-wrap gap-3">

            {threat.status === "OPEN" && (
              <button
                disabled={updating}
                onClick={() =>
                  handleStatusChange("INVESTIGATING")
                }
                className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-yellow-400 disabled:opacity-50"
              >
                {updating
                  ? "Updating..."
                  : "Investigate"}
              </button>
            )}

            {threat.status === "INVESTIGATING" && (
              <button
                disabled={updating}
                onClick={() =>
                  handleStatusChange("BLOCKED")
                }
                className="rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-400 disabled:opacity-50"
              >
                {updating ? "Updating..." : "Block IP"}
              </button>
            )}

            {threat.status === "BLOCKED" && (
              <button
                disabled={updating}
                onClick={() =>
                  handleStatusChange("RESOLVED")
                }
                className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-green-400 disabled:opacity-50"
              >
                {updating ? "Updating..." : "Resolve"}
              </button>
            )}

            {threat.status === "RESOLVED" && (
              <span className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
                ✓ Threat Resolved
              </span>
            )}

          </div>

        </div>

        {/* RELATED LOG */}
        {threat.log && (
          <div className="mt-8 border-t border-gray-800 pt-6">

            <h3 className="text-lg font-semibold">
              Related Log
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Log associated with this detected threat
            </p>

            <div className="mt-4 rounded-lg border border-gray-800 bg-gray-950 p-5">

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

                <Info
                  label="Log ID"
                  value={threat.log.id}
                />

                <Info
                  label="IP Address"
                  value={threat.log.ipAddress}
                />

                <Info
                  label="Endpoint"
                  value={threat.log.endpoint}
                />

                <Info
                  label="HTTP Method"
                  value={threat.log.method}
                />

                <Info
                  label="Status Code"
                  value={threat.log.statusCode}
                />

                <Info
                  label="Username"
                  value={threat.log.username}
                />

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

// --------------------------------
// INFO
// --------------------------------

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-1 wrap-break-words text-sm text-gray-200">
        {value ?? "Unknown"}
      </p>
    </div>
  );
}

// --------------------------------
// SEVERITY
// --------------------------------

function SeverityBadge({ severity }) {
  const styles = {
    CRITICAL:
      "bg-red-500/10 text-red-400 border-red-500/20",

    HIGH:
      "bg-orange-500/10 text-orange-400 border-orange-500/20",

    MEDIUM:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

    LOW:
      "bg-green-500/10 text-green-400 border-green-500/20",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
        styles[severity] ||
        "bg-gray-500/10 text-gray-400 border-gray-500/20"
      }`}
    >
      {severity || "UNKNOWN"}
    </span>
  );
}

// --------------------------------
// STATUS
// --------------------------------

function StatusBadge({ status }) {
  const styles = {
    OPEN:
      "bg-red-500/10 text-red-400 border-red-500/20",

    INVESTIGATING:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

    BLOCKED:
      "bg-purple-500/10 text-purple-400 border-purple-500/20",

    RESOLVED:
      "bg-green-500/10 text-green-400 border-green-500/20",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
        styles[status] ||
        "bg-gray-500/10 text-gray-400 border-gray-500/20"
      }`}
    >
      {status || "UNKNOWN"}
    </span>
  );
}

// --------------------------------
// FORMAT TYPE
// --------------------------------

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

// --------------------------------
// FORMAT DATE
// --------------------------------

function formatDate(timestamp) {
  if (!timestamp) return "Unknown";

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default ThreatDetails;