"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import OrderTable from "@/components/orders/OrderTable";

import { getOrders } from "@/services/orderService";

import { Order } from "@/types/order";

export default function OrdersPage() {

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [deletedOrderIds, setDeletedOrderIds] =
    useState<string[]>([]);

  const loadOrders = async () => {
    try {
      const data =
        await getOrders();

      setOrders(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (orderId: string) => {
    setDeletedOrderIds((prev) => [...prev, orderId]);
  };
  useEffect(() => {

    loadOrders();

  }, []);

  return (

    <DashboardLayout>

      <div className="mb-8 mt-4">

        <h1 className="text-xl font-bold">

          Orders

        </h1>

        <p className="text-gray-500 text-sm">

          Manage customer orders

        </p>

      </div>

      <OrderTable
        orders={orders.filter((order) => !deletedOrderIds.includes(order._id))}
        loading={loading}
        refresh={loadOrders}
        onDelete={handleDelete}
      />

    </DashboardLayout>

  );

}