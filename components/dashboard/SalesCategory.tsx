"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Vegetables", value: 45, color: "#22C55E" },
  { name: "Fruits", value: 28, color: "#3B82F6" },
  { name: "Dairy", value: 20, color: "#A855F7" },
  { name: "Bakery", value: 18, color: "#FBBF24" },
  { name: "Beverages", value: 17, color: "#FB7185" },
];

const total = data.reduce((sum, item) => sum + item.value, 0);

export default function SalesCategory() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">
          Sales by Category
        </h2>

        <button className="text-xs font-medium text-green-600 hover:text-green-700">
          View Report
        </button>
      </div>

      <div className="flex items-center justify-between gap-6">
        {/* Donut Chart */}
        <div className="relative h-52 w-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-slate-500">Total</span>
            <span className="text-xl font-bold">{total}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-4">
          {data.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />

                <span className="text-xs text-slate-700">
                  {item.name}
                </span>
              </div>

              <span className="text-xs text-slate-500">
                {item.value} (
                {((item.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}