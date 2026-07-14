"use client";

import { useState } from "react";
import {
  updateOrderStatus,
} from "@/services/orderService";

interface Props {

  order: any;

  refresh: () => void;

}

const statusConfig = {
  confirmed: { label: "Accept", color: "bg-blue-600", textColor: "text-blue-600", bgLight: "bg-blue-100" },
  packed: { label: "Packed", color: "bg-yellow-500", textColor: "text-yellow-600", bgLight: "bg-yellow-100" },
  out_for_delivery: { label: "Out for Delivery", color: "bg-purple-600", textColor: "text-purple-600", bgLight: "bg-purple-100" },
  delivered: { label: "Delivered", color: "bg-green-600", textColor: "text-green-600", bgLight: "bg-green-100" },
  cancelled: { label: "Cancel", color: "bg-red-600", textColor: "text-red-600", bgLight: "bg-red-100" },
};

export default function OrderDetails({

  order,

  refresh,

}: Props) {

  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(order.status);

  const updateStatus =
    async (status: string) => {

      if (currentStatus === status) return;

      setLoading(true);
      try {
        await updateOrderStatus(
          order._id,
          status
        );
        setCurrentStatus(status);
        refresh();
      } catch (error) {
        console.error("Failed to update status:", error);
      } finally {
        setLoading(false);
      }

    };

  return (

<div className="space-y-6">

<div className="bg-white rounded-xl shadow p-6">

<div className="flex justify-between items-start">
  <div>
    <h1 className="text-3xl font-bold">
      {order.orderNumber}
    </h1>
    <p className="text-gray-500 mt-2">
      Placed on {new Date(order.createdAt).toLocaleString()}
    </p>
  </div>
  <div className={`px-4 py-2 rounded-lg ${statusConfig[currentStatus as keyof typeof statusConfig]?.bgLight}`}>
    <span className={`font-bold ${statusConfig[currentStatus as keyof typeof statusConfig]?.textColor}`}>
      {statusConfig[currentStatus as keyof typeof statusConfig]?.label || order.status}
    </span>
  </div>
</div>

</div>

<div className="grid grid-cols-2 gap-6">

<div className="bg-white rounded-xl shadow p-6">

<h2 className="font-bold text-xl mb-4">

Customer

</h2>

<p>

<b>Name : </b>

{order.customerName}

</p>

<p>

<b>Phone : </b>

{order.customerMobile}

</p>

<p>

<b>Payment : </b>

{order.paymentMethod}

</p>

<p>

<b>Status : </b>

{order.paymentStatus}

</p>

<p>

<b>Transaction : </b>

{order.transactionId}

</p>

</div>

<div className="bg-white rounded-xl shadow p-6">

<h2 className="font-bold text-xl mb-4">

Address

</h2>

<p>

{order.address.houseNo}

</p>

<p>

{order.address.area}

</p>

<p>

{order.address.city}

</p>

<p>

{order.address.state}

</p>

<p>

{order.address.pincode}

</p>

</div>

</div>

<div className="bg-white rounded-xl shadow">

<div className="p-6 border-b border-slate-200">

<h2 className="text-xl font-bold">

Ordered Items

</h2>

</div>

<table className="w-full">

<thead>

<tr>

<th className="p-4">

Product

</th>

<th>

Qty

</th>

<th>

Price

</th>

<th>

Total

</th>

</tr>

</thead>

<tbody>

{order.items.map((item: any) => (

<tr
key={item.productId}
className="border-t border-slate-200 border-s border-slate-200late-200"
>

<td className="p-4">

{item.name}

</td>

<td>

{item.quantity}

</td>

<td>

₹{item.price}

</td>

<td>

₹{item.price * item.quantity}

</td>

</tr>

))}

</tbody>

</table>

</div>

<div className="bg-white rounded-xl shadow p-6">

<div className="flex justify-between text-2xl font-bold">

<span>Total</span>

<span>

₹{order.totalAmount}

</span>

</div>

</div>

<div className="bg-white rounded-xl shadow p-6">

<h2 className="text-xl font-bold mb-5">

Update Order Status

</h2>

<div className="flex flex-wrap gap-3">

<button
onClick={()=>
updateStatus(
"confirmed"
)
}
disabled={loading || currentStatus === "confirmed"}
className={`px-5 py-3 rounded-lg font-semibold transition-all ${
  currentStatus === "confirmed"
    ? "bg-blue-600 text-white opacity-50 cursor-not-allowed"
    : "bg-blue-600 text-white hover:bg-blue-700"
} ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
>

{loading && currentStatus === "confirmed" ? "Updating..." : "Accept"}

</button>

<button
onClick={()=>
updateStatus(
"packed"
)
}
disabled={loading || currentStatus === "packed"}
className={`px-5 py-3 rounded-lg font-semibold transition-all ${
  currentStatus === "packed"
    ? "bg-yellow-500 text-white opacity-50 cursor-not-allowed"
    : "bg-yellow-500 text-white hover:bg-yellow-600"
} ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
>

{loading && currentStatus === "packed" ? "Updating..." : "Packed"}

</button>

<button
onClick={()=>
updateStatus(
"out_for_delivery"
)
}
disabled={loading || currentStatus === "out_for_delivery"}
className={`px-5 py-3 rounded-lg font-semibold transition-all ${
  currentStatus === "out_for_delivery"
    ? "bg-purple-600 text-white opacity-50 cursor-not-allowed"
    : "bg-purple-600 text-white hover:bg-purple-700"
} ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
>

{loading && currentStatus === "out_for_delivery" ? "Updating..." : "Out"}

</button>

<button
onClick={()=>
updateStatus(
"delivered"
)
}
disabled={loading || currentStatus === "delivered"}
className={`px-5 py-3 rounded-lg font-semibold transition-all ${
  currentStatus === "delivered"
    ? "bg-green-600 text-white opacity-50 cursor-not-allowed"
    : "bg-green-600 text-white hover:bg-green-700"
} ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
>

{loading && currentStatus === "delivered" ? "Updating..." : "Delivered"}

</button>

<button
onClick={()=>
updateStatus(
"cancelled"
)
}
disabled={loading || currentStatus === "cancelled"}
className={`px-5 py-3 rounded-lg font-semibold transition-all ${
  currentStatus === "cancelled"
    ? "bg-red-600 text-white opacity-50 cursor-not-allowed"
    : "bg-red-600 text-white hover:bg-red-700"
} ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
>

{loading && currentStatus === "cancelled" ? "Updating..." : "Cancel"}

</button>

</div>

</div>

</div>

  );

}