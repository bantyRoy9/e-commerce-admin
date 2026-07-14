import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";

interface Props {
  title: string;
  value: string;
  change: string;
  changeColor?: string;
  subtitle?: string;
  icon: ReactNode;
  iconBg: string;
}

export default function DashboardCard({
  title,
  value,
  change,
  changeColor = "text-green-600",
  subtitle = "vs yesterday",
  icon,
  iconBg,
}: Props) {
  return (
    <div className="flex  gap-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        {/* Icon */}
        <div
          className={`w-18 h-18 rounded-full flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="">
        <p className="text-gray-500 text-xs">{title}</p>

        <div className="flex items-center gap-3 mt-2">
          <h2 className="text-xl font-bold text-gray-900">{value}</h2>

          <span
            className={`flex justify-center items-center gap-0 text-xs font-semibold px-2 py-1 rounded-full bg-green-100 ${changeColor}`}
          >
            <ArrowUpIcon className="w-3 h-3" /> {change}
          </span>
        </div>

        <p className="text-sm text-gray-400 mt-2">{subtitle}</p>
      </div>
    </div>
  );
}