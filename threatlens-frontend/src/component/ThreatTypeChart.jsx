import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function ThreatTypeChart({ data }) {

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

      <div className="mb-6">

        <h2 className="text-lg font-semibold text-white">
          Threat Type Distribution
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Number of threats detected by attack type
        </p>

      </div>

      <div className="h-80 w-full">

        {data.length === 0 ? (

          <div className="flex h-full items-center justify-center text-gray-500">
            No threat data available
          </div>

        ) : (

          <ResponsiveContainer width="100%" height="100%">

            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 40,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
              />

              <XAxis
                dataKey="threatType"
                stroke="#94a3b8"
                angle={-25}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 11 }}
              />

              <YAxis
                stroke="#94a3b8"
                allowDecimals={false}
              />

              <Tooltip />

              <Bar
                dataKey="count"
                fill="#ef4444"
                radius={[5, 5, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        )}

      </div>

    </div>
  );
}

export default ThreatTypeChart;