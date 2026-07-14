"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Order } from "@/types/order";

interface Props {
  orders: Order[];
  loading: boolean;
  refresh: () => void;
  onDelete: (id: string) => void;
}

export default function OrderTable({
  orders,
  loading,
  onDelete,
}: Props) {

  const [search, setSearch] =
    useState("");

  const filteredOrders =
    useMemo(() => {

      return orders.filter((order) =>
        order.customerName
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        order.orderNumber
          .toLowerCase()
          .includes(search.toLowerCase())
      );

    }, [orders, search]);

  if (loading) {

    return (
      <div className="bg-white p-8 rounded-xl">
        Loading...
      </div>
    );

  }

  return (

    <div className="bg-white rounded-xl shadow">

      <div className="p-5 border-b border-gray-200">

        <input
          placeholder="Search Order..."
          value={search}
          onChange={(e)=>
            setSearch(e.target.value)
          }
          className="border border-gray-200 rounded-lg px-4 py-2 w-80"
        />

      </div>

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr className="text-left text-xs font-semibold  tracking-wide text-slate-600">

            <th className="p-4">
              Order
            </th>

            <th className="p-4">
              Customer
            </th>

            <th className="p-4" >
              Amount
            </th>

            <th className="p-4">
              Payment
            </th>

            <th className="p-4">
              Status
            </th>

            <th className="p-4">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {filteredOrders.map((order)=>(

            <tr
              key={order._id}
              className="border-t border-gray-200 hover:bg-gray-50"
            >

              <td className="px-4 py-8 font-semibold text-sm">
                {order.orderNumber}
              </td>

              <td>
                <div>
                  <div className="font-medium text-sm">
                    {order.customerName}
                  </div>

                  <div className="text-sm text-gray-500">
                    {order.customerMobile}
                  </div>
                </div>
              </td>

              <td className="text-sm">
                ₹{order.totalAmount}
              </td>

              <td className="text-sm">

                <span className="capitalize">

                  {order.paymentMethod}

                </span>

              </td>

              <td >

                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm capitalize">

                  {order.status.replaceAll("_"," ")}

                </span>

              </td>

              <td className="">
                <Link
                  href={`/orders/${order._id}`}
                  className="bg-green-600 text-white px-4 py-2  mr-2 rounded-lg text-sm"
                >
                  View
                </Link>

                <button
                  type="button"
                  onClick={() => onDelete(order._id)}
                  className="bg-red-600 text-white px-4 py-1 rounded-lg text-sm"
                >
                  Delete
                </button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}