import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

const orders = [
  {
    id: "#ORD-1024",
    customer: "Rahul Sharma",
    amount: "₹540",
    status: "Pending",
    date: "24 May, 2025 10:30 AM",
  },
  {
    id: "#ORD-1023",
    customer: "Ankit Verma",
    amount: "₹280",
    status: "Delivered",
    date: "24 May, 2025 09:15 AM",
  },
  {
    id: "#ORD-1022",
    customer: "Aman Yadav",
    amount: "₹740",
    status: "Packed",
    date: "24 May, 2025 08:45 AM",
  },
  {
    id: "#ORD-1021",
    customer: "Neha Singh",
    amount: "₹320",
    status: "Out for Delivery",
    date: "23 May, 2025 07:30 PM",
  },
  {
    id: "#ORD-1020",
    customer: "Vivek Kumar",
    amount: "₹610",
    status: "Delivered",
    date: "23 May, 2025 06:20 PM",
  },
];

const statusClasses: Record<string, string> = {
  Pending: "bg-orange-100 text-orange-600",
  Delivered: "bg-green-100 text-green-600",
  Packed: "bg-blue-100 text-blue-600",
  "Out for Delivery": "bg-purple-100 text-purple-600",
};

export default function LatestOrders() {
  return (
    <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <h2 className="text-sm font-semibold text-slate-800">
          Latest Orders
        </h2>

        <button className="text-xs font-medium text-green-600 hover:text-green-700">
          View All Orders
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-y border-slate-200 bg-white">
            <tr className="text-left text-xs text-slate-500">
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition text-xs"
              >
                <td className="px-6 py-5 font-semibold text-slate-800">
                  {order.id}
                </td>

                <td className="px-6 py-5 text-slate-700">
                  {order.customer}
                </td>

                <td className="px-6 py-5 font-medium text-slate-800">
                  {order.amount}
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-md px-3 py-1 text-xs font-medium ${
                      statusClasses[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="px-6 py-5 text-xs text-slate-500">
                  {order.date}
                </td>

                <td className="px-6 py-5 text-right">
                  <button className="text-slate-400 hover:text-slate-700">
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}