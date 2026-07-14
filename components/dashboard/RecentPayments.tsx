import {
  BanknotesIcon,
  CreditCardIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";

const payments = [
  {
    name: "Rahul Sharma",
    amount: "₹540",
    mode: "UPI Payment",
    icon: (
      <BanknotesIcon className="h-5 w-5 text-green-600" />
    ),
    bg: "bg-green-100",
  },
  {
    name: "Ankit Verma",
    amount: "₹280",
    mode: "Credit Card",
    icon: (
      <CreditCardIcon className="h-5 w-5 text-blue-600" />
    ),
    bg: "bg-blue-100",
  },
  {
    name: "Aman Yadav",
    amount: "₹740",
    mode: "Wallet",
    icon: (
      <WalletIcon className="h-5 w-5 text-purple-600" />
    ),
    bg: "bg-purple-100",
  },
  {
    name: "Neha Singh",
    amount: "₹320",
    mode: "Cash on Delivery",
    icon: (
      <BanknotesIcon className="h-5 w-5 text-orange-500" />
    ),
    bg: "bg-orange-100",
  },
  {
    name: "Vivek Kumar",
    amount: "₹610",
    mode: "UPI Payment",
    icon: (
      <BanknotesIcon className="h-5 w-5 text-green-600" />
    ),
    bg: "bg-green-100",
  },
];

export default function RecentPayments() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <h2 className="text-sm font-semibold text-slate-800">
          Recent Payments
        </h2>

        <button className="text-xs font-medium text-green-600 hover:text-green-700">
          View All
        </button>
      </div>

      {/* Payments */}
      <div>
        {payments.map((payment, index) => (
          <div
            key={payment.name}
            className={`flex items-center justify-between px-6 py-4 transition hover:bg-slate-50 text-xs ${
              index !== payments.length - 1
                ? "border-b border-slate-100"
                : ""
            }`}
          >
            {/* Left */}
            <div className="flex items-center gap-4">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full ${payment.bg}`}
              >
                {payment.icon}
              </div>

              <div>
                <h3 className="font-semibold text-slate-800">
                  {payment.name}
                </h3>

                <p className="text-xs text-slate-500">
                  {payment.mode}
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
              <h3 className="font-bold text-slate-900">
                {payment.amount}
              </h3>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600">
                Success
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}