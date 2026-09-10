import { useState } from "react";
import { analyzeThreat } from "../api/ThreatApi";

function Analyzer() {
  const [logInput, setLogInput] = useState("");
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

const analyzeLog = async () => {
  if (!logInput.trim() || analyzing) return;

  setAnalyzing(true);
  setResult(null);

  try {
    const data = await analyzeThreat(logInput);

    setResult(data);
  } catch (error) {
    console.error("Analyzer error:", error);

    alert(
      "Unable to connect to ThreatLens backend. Make sure Spring Boot is running."
    );
  } finally {
    setAnalyzing(false);
  }
};

  const clearAnalyzer = () => {
    setLogInput("");
    setResult(null);
  };

  const getSeverityStyle = () => {
    if (result?.severity === "CRITICAL") {
      return "border-red-500/30 bg-red-500/10 text-red-400";
    }

    if (result?.severity === "HIGH") {
      return "border-orange-500/30 bg-orange-500/10 text-orange-400";
    }

    if (result?.severity === "MEDIUM") {
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";
    }

    return "border-green-500/30 bg-green-500/10 text-green-400";
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6 text-white">

      {/* HEADER */}

      <div className="mb-8">

        <div className="flex items-center gap-3">

          <h1 className="text-3xl font-bold">
            AI Threat Analyzer
          </h1>

          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
            AI POWERED
          </span>

        </div>

        <p className="mt-2 text-gray-400">
          Analyze security logs and identify potential cyber threats.
        </p>

      </div>

      {/* ANALYZER INPUT */}

      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

        <div className="mb-4">

          <h2 className="text-lg font-semibold">
            Security Log
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Paste a security log below for threat analysis.
          </p>

        </div>

        <textarea
          value={logInput}
          onChange={(e) => setLogInput(e.target.value)}
          placeholder={`Example:

192.168.1.29 - admin
POST /login
401
Failed login attempt`}
          className="h-52 w-full resize-none rounded-lg border border-gray-700 bg-gray-950 p-4 font-mono text-sm text-gray-200 outline-none transition focus:border-red-500"
        />

        <div className="mt-4 flex gap-3">

          <button
            onClick={analyzeLog}
            disabled={!logInput.trim() || analyzing}
            className="rounded-lg bg-red-600 px-6 py-3 font-medium transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {analyzing ? "Analyzing..." : "🔍 Analyze Threat"}
          </button>

          <button
            onClick={clearAnalyzer}
            className="rounded-lg border border-gray-700 px-6 py-3 font-medium text-gray-300 transition hover:bg-gray-800"
          >
            Clear
          </button>

        </div>

      </div>

      {/* RESULT */}

      {result && (

        <div className="mt-6">

          <div className="mb-4 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-semibold">
                Analysis Result
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Threat assessment generated from the submitted log.
              </p>
            </div>

            <span
              className={`rounded-full border px-4 py-2 text-sm font-semibold ${getSeverityStyle()}`}
            >
              {result.severity}
            </span>

          </div>

          {/* RESULT CARDS */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">

              <p className="text-sm text-gray-500">
                Threat Type
              </p>

              <p className="mt-3 text-xl font-bold text-red-400">
                {result.threatType.replaceAll("_", " ")}
              </p>

            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">

              <p className="text-sm text-gray-500">
                Risk Score
              </p>

              <div className="mt-3 flex items-end gap-2">

                <span className="text-3xl font-bold">
                  {result.riskScore}
                </span>

                <span className="mb-1 text-gray-500">
                  / 100
                </span>

              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-800">

                <div
                  className="h-full rounded-full bg-red-500 transition-all duration-700"
                  style={{
                    width: `${result.riskScore}%`,
                  }}
                />

              </div>

            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">

              <p className="text-sm text-gray-500">
                Confidence
              </p>

              <div className="mt-3 flex items-end gap-2">

                <span className="text-3xl font-bold">
                  {result.confidence}%
                </span>

              </div>

              <p className="mt-2 text-sm text-gray-500">
                Detection confidence
              </p>

            </div>

          </div>

          {/* WHY DETECTED */}

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

              <h3 className="text-lg font-semibold">
                Why Was This Detected?
              </h3>

              <div className="mt-5 space-y-4">

                {result.reasons.map((reason, index) => (

                  <div
                    key={index}
                    className="flex gap-3"
                  >

                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-xs text-red-400">
                      ✓
                    </span>

                    <p className="text-sm text-gray-300">
                      {reason}
                    </p>

                  </div>

                ))}

              </div>

            </div>

            {/* RECOMMENDATION */}

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

              <h3 className="text-lg font-semibold">
                Recommended Action
              </h3>

              <div className="mt-5 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">

                <p className="text-sm leading-6 text-gray-300">
                  {result.recommendation}
                </p>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* EMPTY STATE */}

      {!result && !analyzing && (

        <div className="mt-6 rounded-xl border border-dashed border-gray-800 bg-gray-900/50 p-12 text-center">

          <div className="text-4xl">
            🛡️
          </div>

          <h3 className="mt-4 text-lg font-semibold">
            Ready to Analyze
          </h3>

          <p className="mx-auto mt-2 max-w-lg text-sm text-gray-500">
            Paste a security log above and ThreatLens will analyze
            the activity and provide a threat classification,
            severity, risk score, and recommended action.
          </p>

        </div>

      )}

    </div>
  );
}

export default Analyzer;