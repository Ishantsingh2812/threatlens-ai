import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { time: "00:00", threats: 4 },
  { time: "02:00", threats: 7 },
  { time: "04:00", threats: 3 },
  { time: "06:00", threats: 12 },
  { time: "08:00", threats: 9 },
  { time: "10:00", threats: 18 },
  { time: "12:00", threats: 14 },
  { time: "14:00", threats: 25 },
  { time: "16:00", threats: 19 },
  { time: "18:00", threats: 31 },
  { time: "20:00", threats: 22 },
  { time: "22:00", threats: 28 },
];

function ThreatActivityChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="threatGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />

              <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="#1e293b"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="time"
            tick={{
              fill: "#64748b",
              fontSize: 11,
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{
              fill: "#64748b",
              fontSize: 11,
            }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              color: "#fff",
            }}
            labelStyle={{
              color: "#94a3b8",
            }}
          />

          <Area
            type="monotone"
            dataKey="threats"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#threatGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ThreatActivityChart;
