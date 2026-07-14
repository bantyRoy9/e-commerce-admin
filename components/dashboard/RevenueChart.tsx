"use client";

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
  { day: "1 May", revenue: 3000 },
  { day: "3 May", revenue: 10000 },
  { day: "5 May", revenue: 12000 },
  { day: "7 May", revenue: 15000 },
  { day: "9 May", revenue: 20000 },
  { day: "11 May", revenue: 25000 },
  { day: "13 May", revenue: 19000 },
  { day: "15 May", revenue: 16000 },
  { day: "17 May", revenue: 17000 },
  { day: "19 May", revenue: 19000 },
  { day: "21 May", revenue: 24000 },
  { day: "23 May", revenue: 25000 },
  { day: "25 May", revenue: 32000 },
  { day: "27 May", revenue: 38000 },
];

export default function RevenueChart() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">
          Revenue Overview
        </h2>

        <select className="rounded-lg border border-slate-200 px-3 py-2 outline-none text-xs">
          <option>This Month</option>
          <option>Last Month</option>
          <option>This Year</option>
        </select>
      </div>

      {/* Chart */}
      <div className="h-[330px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="revenueGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#22c55e"
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor="#22c55e"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#E5E7EB"
            />

            <XAxis
              dataKey="day"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickFormatter={(v) => `₹${v / 1000}K`}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip 
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E5E7EB",
                boxShadow: "0 8px 24px rgba(0,0,0,.08)",
              }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#16A34A"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              dot={{
                r: 3,
                strokeWidth: 2,
                fill: "#fff",
                stroke: "#16A34A",
              }}
              activeDot={{
                r: 5,
                fill: "#16A34A",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}