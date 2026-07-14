"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";
import OrderDetails from "@/components/orders/OrderDetails";

import { getOrder } from "@/services/orderService";

export default function OrderPage() {

  const { id } = useParams();

  const [order, setOrder] = useState<any>();

  
  const loadOrder = async () => {

    const data = await getOrder(id as string);

    setOrder(data);

  };
  useEffect(() => {

    loadOrder();

  }, []);

  if (!order) {

    return (

      <DashboardLayout>

        Loading...

      </DashboardLayout>

    );

  }

  return (

    <DashboardLayout>

      <OrderDetails
        order={order}
        refresh={loadOrder}
      />

    </DashboardLayout>

  );

}